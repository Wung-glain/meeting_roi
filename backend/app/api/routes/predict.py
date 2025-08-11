from fastapi import APIRouter, Form, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List,Optional
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from dotenv import load_dotenv
from app.db.database import get_db
from app.db.models import *
from app.schemas.meeting_schemas import *
from app.db.models import User, Plan
from app.auth.jwt import get_current_user
import json
import asyncio
import os
import httpx

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

async def get_gpt_response(model: str, prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are an AI that returns ONLY valid JSON."},
            {"role": "user", "content": prompt}
        ],
    
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(OPENAI_API_URL, headers=headers, json=payload)
        if response.status_code != 200:
            print("OpenAI API error:", response.text)
            response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    
class MeetingInput(BaseModel):
    time_block: str
    meeting_title: str
    meeting_notes: str
    remote: bool
    tool: str
    agenda_file: Optional[str] = None
    meeting_type: str
    duration: int
    attendees: int
    agenda_clarity: int
    has_action_items: bool
    departments: int
    roles: str
    average_annual_salary: float



class PredictionOutput(BaseModel):
    result: str                         # Productive / Unproductive
    confidence: float                   # Confidence score (mock or real)
    estimated_cost: float               # Meeting cost
    explanation: str = None             # Optional explanation
    factors: dict = None                # Key factor breakdown


load_dotenv()



router = APIRouter()



@router.get("/meeting_statistics/{user_id}", response_model=DashboardResponse)
def get_dashboard_data(user_id: str, db: Session = Depends(get_db)):
    # Fetch meeting overview
    overview = db.query(MeetingOverview).filter(MeetingOverview.user_id == user_id).first()
    if not overview:
        overview_data = MeetingOverviewOut(
            user_id=user_id,
            total_estimated_cost=0.0,
            total_meeting_analyzed=0,
            total_roi=0.0,
            total_estimated_value_gain=0.0,
            total_productive_meetings=0
        )
    else:
        overview_data = MeetingOverviewOut.model_validate(overview)

    # Fetch recent predictions
    predictions = db.query(RecentPrediction).all()
    predictions_data = [RecentPredictionOut.model_validate(pred) for pred in predictions]

    # Fetch user + plan usage
    user = db.query(User).filter(User.id == user_id).first()
    if user and user.plan_id:
        plan = db.query(Plan).filter(Plan.id == user.plan_id).first()
        predictions_used = user.predictions_used
        max_predictions_permonth = plan.max_predictions_per_month
    else:
        predictions_used = 0
        max_predictions_permonth = 0

    user_usage = UserUsage(
        predictions_used=predictions_used,
        max_predictions_per_month=max_predictions_permonth
    )

    return DashboardResponse(
        overview=overview_data,
        recent_predictions=predictions_data,
        user_usage=user_usage
    )



@router.post("/predict_one")
async def predict_one(meeting_data: MeetingInput, 
                      db: Session = Depends(get_db), 
                      current_user: User = Depends(get_current_user)):

    # 1️⃣ Get user's plan
    plan = db.query(Plan).filter(Plan.id == current_user.plan_id).first()
    if not plan:
        raise HTTPException(status_code=400, detail="User plan not found")

    # 2️⃣ Select GPT model
    if plan.name.lower() in ["pro", "business"]:
        gpt_model = "gpt-5-mini"
    else:
        gpt_model = "gpt-5-nano"

    # 3️⃣ Check predictions quota
    if current_user.predictions_used >= plan.max_predictions_per_month:
        raise HTTPException(status_code=403, detail="Prediction quota exceeded")

    # 4️⃣ Build GPT prompt with JSON enforcement
    base_prompt = f"""
You are a meeting ROI analysis assistant.

Meeting details:
- Title: {meeting_data.meeting_title}
- Notes: {meeting_data.meeting_notes}
- Time Block: {meeting_data.time_block}
- Remote: {meeting_data.remote}
- Tool: {meeting_data.tool}
- Type: {meeting_data.meeting_type}
- Duration: {meeting_data.duration} minutes
- Attendees: {meeting_data.attendees}
- Agenda clarity: {meeting_data.agenda_clarity}
- Has action items: {meeting_data.has_action_items}
- Departments involved: {meeting_data.departments}
- Roles: {meeting_data.roles}
- Average annual salary: ${meeting_data.average_annual_salary}

If an agenda file exists, analyze it separately and include agenda-specific improvement suggestions.

Return ONLY valid JSON with these exact keys:
{{
    "is_productive": true or false,
    "confidence_score": integer (0-100),
    "roi": float,
    "estimated_cost": float,
    "estimated_value_gain_on_meeting": float,
    "suggestions": {{
        "agenda_suggestions": [list of strings],
        "general_suggestions": [list of strings]
    }}
}}
"""

    if meeting_data.agenda_file:
        base_prompt += f"\nAgenda File Content:\n{meeting_data.agenda_file}"

    # 5️⃣ Call GPT API
    try:
        gpt_response = await get_gpt_response(model=gpt_model, prompt=base_prompt)
        prediction_data = json.loads(gpt_response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid GPT output format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GPT request failed: {str(e)}")

    # 6️⃣ Store meeting + prediction asynchronously
    async def store_meeting_and_prediction():
        # Meeting record
        meeting = Meeting(
            user_id=current_user.id,
            meeting_title=meeting_data.meeting_title,
            agenda_format=None,
            agenda_file=meeting_data.agenda_file,
            time_block=meeting_data.time_block,
            remote=meeting_data.remote,
            tool=meeting_data.tool,
            meeting_type=meeting_data.meeting_type,
            duration=meeting_data.duration,
            attendees=meeting_data.attendees,
            agenda_clarity=[meeting_data.agenda_clarity],
            has_action_items=meeting_data.has_action_items,
            departments=str(meeting_data.departments),
            roles=meeting_data.roles,
            average_annual_salary=meeting_data.average_annual_salary,
            meeting_notes=meeting_data.meeting_notes,
            roi=prediction_data["roi"]
        )
        db.add(meeting)
        db.flush()  # so we get meeting_id before commit

        # Prediction record
        prediction = MeetingPrediction(
            meeting_id=meeting.meeting_id,
            is_productive=prediction_data["is_productive"],
            confidence_score=prediction_data["confidence_score"],
            roi=prediction_data["roi"],
            estimated_cost=prediction_data["estimated_cost"],
            estimated_value_gain_on_meeting=prediction_data["estimated_value_gain_on_meeting"],
            suggestions=json.dumps(prediction_data["suggestions"])
        )
        db.add(prediction)

        # Update user usage
        current_user.predictions_used += 1

        db.commit()

    asyncio.create_task(store_meeting_and_prediction())

    # 7️⃣ Return GPT results instantly
    return {
        "is_productive": prediction_data["is_productive"],
        "confidence_score": prediction_data["confidence_score"],
        "roi": prediction_data["roi"],
        "estimated_cost": prediction_data["estimated_cost"],
        "estimated_value_gain_on_meeting": prediction_data["estimated_value_gain_on_meeting"],
        "suggestions": prediction_data["suggestions"]
    }
