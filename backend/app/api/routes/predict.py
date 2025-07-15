from fastapi import APIRouter, Form, File, UploadFile
from pydantic import BaseModel, Field
from typing import List,Optional
from fastapi.responses import JSONResponse
import joblib
from fastapi import HTTPException
import pandas as pd
import traceback
import numpy as np
import os
import io
from dotenv import load_dotenv

class MeetingInput(BaseModel):
    time_block: str
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

# Load environment variables
load_dotenv()
# This path is relative to where prediction.py is located.
# Assuming utils.py is in the parent directory (project root)
try:
    from app.ml.train import generate_meeting_suggestions
except ImportError:
    # If utils.py is in the same directory as routers/prediction.py
    # or if you have a different project structure
    try:
        from app.ml.train import generate_meeting_suggestions
    except ImportError:
        print("Error: 'utils.py' not found or 'generate_meeting_suggestions' not defined in it.")
        print("Please ensure the generate_meeting_suggestions function is in 'utils.py' in the appropriate location.")
        # For now, we'll just define a dummy to prevent server crash during development
        def generate_meeting_suggestions(input_data, estimated_cost=None):
            return ["Suggestions utility not loaded. Check backend logs."]
# NEW OpenAI SDK (>=1.0.0)
from openai import OpenAI
# Global variables to hold loaded models and preprocessing objects
# These will be populated by the main app's startup event
# We declare them here so they can be referenced within this module



client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()

# ==== Input Models ====



# ==== Load ML Model ====

MODEL_PATH = os.path.join("models", "meeting_roi_model.pkl")
EST_PATH = os.path.join("models", "estimated_cost_model.pkl")
PROD_PATH = os.path.join("models", "productivity_model.pkl")
ENCODE_PATH = os.path.join("models", "label_encoder.pkl")
FEATURES_PATH = os.path.join("models", "model_features.pkl")
model = joblib.load(MODEL_PATH)
est_model = joblib.load(EST_PATH)
prod_model = joblib.load(PROD_PATH)
all_training_features = joblib.load(FEATURES_PATH)
label_encoder = joblib.load(ENCODE_PATH)


# ==== GPT Prompt Builder ====

def generate_gpt_prompt(agenda: str, attendees: List[str], duration: int, historical_productivity: float):
    return f"""
You are a productivity expert.

Evaluate the productivity potential of the following meeting:

- Agenda: {agenda}
- Attendees: {", ".join(attendees)}
- Duration: {duration} minutes
- Historical productivity: {historical_productivity}

Respond in JSON format like this:
{{
  "score": 0.65,
  "reason": "Agenda is vague and includes too many participants",
  "suggestion": "Clarify the agenda and reduce attendees"
}}
"""

# ==== GPT Call with new SDK ====

def call_gpt(prompt: str):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # use "gpt-4o" or fallback to "gpt-3.5-turbo"
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        return json.dumps({
            "score": 0.5,
            "reason": f"GPT analysis failed: {str(e)}",
            "suggestion": "Fallback to ML-only result"
        })

# ==== Merge GPT + ML Outputs ====

import json

def merge_predictions(structured: dict, gpt_json: str):
    try:
        gpt_data = json.loads(gpt_json)
    except:
        gpt_data = {"score": 0.5, "reason": "Invalid GPT output", "suggestion": "N/A"}

    final_score = round(
        0.6 * structured['predicted_productivity_score'] +
        0.4 * gpt_data.get("score", 0.5), 2
    )

    return {
        "final_score": final_score,
        "ml_score": structured['predicted_productivity_score'],
        "gpt_score": gpt_data.get("score", 0.5),
        "verdict": "Productive" if final_score >= 0.6 else "Unproductive",
        "estimated_cost": structured['estimated_cost'],
        "recommendation": gpt_data.get("suggestion", structured['recommendation']),
        "ml_recommendation": structured['recommendation'],
        "gpt_reason": gpt_data.get("reason", "N/A")
    }

# ==== Predict Endpoint ====

@router.post("/predict")
def predict_productivity(meeting: MeetingInput):
    num_attendees = len(meeting.attendees)
    avg_hourly_rate = sum(a.hourly_rate for a in meeting.attendees) / num_attendees
    has_agenda = 1 if meeting.agenda.strip() else 0

    features = np.array([[
        num_attendees,
        meeting.duration_minutes,
        has_agenda,
        avg_hourly_rate,
        meeting.meeting_time_hour,
        meeting.historical_productivity_avg
    ]])

    prediction = model.predict(features)[0]
    prob = model.predict_proba(features)[0][1]
    estimated_cost = round(avg_hourly_rate * (meeting.duration_minutes / 60) * num_attendees, 2)

    structured_result = {
        "predicted_productivity_score": round(prob, 2),
        "verdict": "Productive" if prediction == 1 else "Unproductive",
        "estimated_cost": estimated_cost,
        "recommendation": "Reduce participants or duration" if prediction == 0 else "Keep it optimized"
    }

    # GPT Analysis
    attendee_names = [a.name for a in meeting.attendees]
    gpt_prompt = generate_gpt_prompt(meeting.agenda, attendee_names, meeting.duration_minutes, meeting.historical_productivity_avg)
    gpt_output = call_gpt(gpt_prompt)

    # Merge and return
    return merge_predictions(structured_result, gpt_output)


# Define the input data model for the API
def preprocess_input(data: MeetingInput, all_training_features: list) -> pd.DataFrame:
    input_dict = data.model_dump()
    df = pd.DataFrame([input_dict])

    df['remote'] = df['remote'].astype(int)
    df['has_action_items'] = df['has_action_items'].astype(int)

    df['roles_list'] = df['roles'].apply(lambda x: [r.strip() for r in x.replace(';', ',').split(',')])
    known_roles = [col.replace('role_', '') for col in all_training_features if col.startswith('role_')]
    for role in known_roles:
        df[f'role_{role}'] = df['roles_list'].apply(lambda x: 1 if role in x else 0)

    df.drop(columns=['roles', 'roles_list', 'agenda_file'], inplace=True)

    df = pd.get_dummies(df, columns=['time_block', 'tool', 'meeting_type'], drop_first=True)

    final_df = pd.DataFrame(0, index=[0], columns=all_training_features)
    for col in df.columns:
        if col in final_df.columns:
            final_df[col] = df[col].iloc[0]

    return final_df
@router.post("/predict_one", response_model=PredictionOutput)
def predict_one(meeting: MeetingInput):
    try:
        # Preprocess input
        X = preprocess_input(meeting, all_training_features)

        # Predict productivity
        prod_numeric = prod_model.predict(X)[0]
        prod_confidence = prod_model.predict_proba(X)[0][1]
        productivity_label = label_encoder.inverse_transform([prod_numeric])[0]

        # Predict cost
        estimated_cost = est_model.predict(X)[0]

        # Example logic-based explanation/factors (optional)
        factors = {
            "duration_status": "Too long" if meeting.duration > 90 else "Optimal",
            "attendee_status": "Many attendees" if meeting.attendees > 8 else "OK",
            "clarity_status": "Unclear" if meeting.agenda_clarity < 3 else "Clear",
        }

        return PredictionOutput(
            result=productivity_label,
            confidence=round(float(prod_confidence), 2),
            estimated_cost=round(float(estimated_cost), 2),
            explanation="Based on ML and business rules.",
            factors=factors
        )

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")