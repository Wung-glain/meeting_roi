from fastapi import APIRouter, Form, File, UploadFile, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List,Optional
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from dotenv import load_dotenv
from app.db.database import get_db
from app.db.models import MeetingOverview, RecentPrediction
from app.schemas.meeting_schemas import *
import os
import httpx
import hmac
import hashlib
import json




paddle_router = APIRouter()
PADDLE_API_KEY = os.getenv("PADDLE_API_KEY")  # Set this securely

async def get_customer_details(customer_id: str):
    url = f"https://api.paddle.com/customers/{customer_id}"

    headers = {
        "Authorization": f"Bearer {PADDLE_API_KEY}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

@paddle_router.post("/paddle")
async def paddle_webhook(request: Request):
    body = await request.body()
    data = json.loads(body)
    
    event_type = data.get("event_type")
   
    if event_type == "customer.created":
        email = data["data"].get("email")
        print(email)
    
    if event_type == "subscription.created":

        sub = data["data"].get("id")

        # Now you can store email + subscription info in your DB
        print("✅ sub id :", sub)
    
    
    return JSONResponse({"status": "ignored"})