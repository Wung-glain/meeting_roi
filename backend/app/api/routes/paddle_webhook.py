from fastapi import APIRouter, Form, File, UploadFile, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List,Optional
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from dotenv import load_dotenv
from app.db.database import get_db
from app.db.models import User, Subscription, Plan
from datetime import datetime, timezone
from app.schemas.meeting_schemas import *
from starlette.requests import ClientDisconnect
from starlette.responses import JSONResponse
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

# --- Paddle Webhook Secret ---
PADDLE_WEBHOOK_SECRET = os.environ.get("PADDLE_WEBHOOK_SECRET")

if not PADDLE_WEBHOOK_SECRET:
    raise ValueError("PADDLE_WEBHOOK_SECRET environment variable must be set for webhook signature verification.")


# --- Helper for DB operations using SQLAlchemy Session ---
async def db_upsert_subscription(db: Session, sub_data: dict):
    """
    Inserts or updates a subscription record in the 'subscriptions' table.
    """
    print(f"Attempting DB UPSERT for Subscription: {sub_data.get('paddle_subscription_id')}")
    try:
        # Check if subscription already exists
        existing_sub = db.query(Subscription).filter(
            Subscription.paddle_subscription_id == sub_data['paddle_subscription_id']
        ).first()

        if existing_sub:
            # Update existing subscription
            for key, value in sub_data.items():
                if hasattr(existing_sub, key):
                    # Handle datetime conversion for timestamp fields
                    if key in ['current_period_start', 'current_period_end', 'next_billed_at'] and value:
                        setattr(existing_sub, key, datetime.fromisoformat(value.replace('Z', '+00:00')))
                    elif key == 'unit_price_amount' and value is not None:
                        setattr(existing_sub, key, float(value)) # Ensure numeric conversion
                    else:
                        setattr(existing_sub, key, value)
            existing_sub.updated_at = datetime.now(timezone.utc)
            db.add(existing_sub) # Mark for update
            print(f"✅ Updated existing subscription {sub_data['paddle_subscription_id']}")
            db.commit()
            db.refresh(existing_sub)
            return existing_sub
        else:
            # Create new subscription
            new_sub = Subscription(
                paddle_subscription_id=sub_data['paddle_subscription_id'],
                user_id=sub_data['user_id'],
                paddle_price_id=sub_data['paddle_price_id'],
                status=sub_data['status'],
                cancel_at_period_end=sub_data.get('cancel_at_period_end', False),
                unit_price_amount=float(sub_data['unit_price_amount']) if sub_data.get('unit_price_amount') is not None else None,
                quantity=sub_data.get('quantity', 1),
                created_at=datetime.now(timezone.utc) # Set created_at only for new records
            )
            if sub_data.get('current_period_start'):
                new_sub.current_period_start = datetime.fromisoformat(sub_data['current_period_start'].replace('Z', '+00:00'))
            if sub_data.get('current_period_end'):
                new_sub.current_period_end = datetime.fromisoformat(sub_data['current_period_end'].replace('Z', '+00:00'))
            if sub_data.get('next_billed_at'):
                new_sub.next_billed_at = datetime.fromisoformat(sub_data['next_billed_at'].replace('Z', '+00:00'))

            db.add(new_sub)
            print(f"✅ Created new subscription {sub_data['paddle_subscription_id']}")
            db.commit()
            db.refresh(new_sub)
            return new_sub
    except Exception as e:
        db.rollback() # Rollback in case of error
        print(f"🚨 Error during SQLAlchemy subscription upsert: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error during subscription upsert: {e}")

async def db_update_user_subscription_info(
    db: Session, 
    user_id: str,
    plan_status: str, 
    unit_price_amount: float = None ,
    paddle_current_subscription_id: str = None
):
    """
    Updates user-specific subscription information in the 'users' table.
    """
    print(f"Attempting DB UPDATE for User {user_id} with plan_status: {plan_status}")
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            print(f"❌ User with ID {user_id} not found for update.")
            # Depending on your app, you might raise an error or create a user here
            return None

        user.plan_status = plan_status
        
        # Only update paddle_current_subscription_id if explicitly provided (including None)
        if paddle_current_subscription_id is not None:
            user.paddle_current_subscription_id = paddle_current_subscription_id
        elif paddle_current_subscription_id is None: # Explicitly set to None if passed as None
            user.paddle_current_subscription_id = None
        # If paddle_current_subscription_id is not passed at all, leave it as is.
        # 🔥 Match and update plan_id from plans table based on unit_price_amount
        if unit_price_amount is not None:
            matched_plan = db.query(Plan).filter(Plan.price_usd == unit_price_amount).first()
            if matched_plan:
                user.plan_id = matched_plan.id
                print(f"✅ Set plan_id for user {user_id} to Plan {matched_plan.name} (${unit_price_amount})")
            else:
                print(f"⚠️ No plan found for price ${unit_price_amount}. Skipping plan_id update.")

        db.add(user) # Mark for update
        db.commit()
        db.refresh(user)
        print(f"✅ Successfully updated user {user_id} subscription info.")
        return user
    except Exception as e:
        db.rollback() # Rollback in case of error
        print(f"🚨 Error during SQLAlchemy user update: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error during user update: {e}")


# --- Webhook Endpoint ---
@paddle_router.post("/paddle")
async def paddle_webhook(request: Request, db: Session = Depends(get_db)):
    print("Webhook is up and running")

    try:
        body = await request.body()

        if not body:
            print("⚠️ Empty request body received.")
            return JSONResponse(
                {"status": "ignored", "reason": "empty body"}, status_code=400
            )

        data = json.loads(body)

    except ClientDisconnect:
        print("🚨 Client disconnected before sending body.")
        return JSONResponse(
            {"status": "error", "reason": "client disconnected"}, status_code=400
        )

    except json.JSONDecodeError as e:
        print(f"🚨 JSON decode error: {e}")
        return JSONResponse(
            {"status": "error", "reason": "invalid JSON"}, status_code=400
        )

    except Exception as e:
        print(f"🚨 Unexpected error reading webhook: {e}")
        return JSONResponse(
            {"status": "error", "reason": str(e)}, status_code=500
        )

    event_type = data.get("event_type")
    event_data = data.get("data", {})
    custom_data = event_data.get("custom_data", {})
    user_id = custom_data.get("user_id") # This is your internal user ID from checkout

    print(f"Received Paddle Webhook Event: {event_type}")
    if user_id:
        print(f"  Associated User ID from custom_data: {user_id}")
    else:
        print("  No user_id found in custom_data for this event. This may be expected for some events (e.g., customer.created if not from checkout).")

    # Helper function to extract subscription details
    def extract_subscription_details(sub_event_data):
        items = sub_event_data.get("items", [])
        first_item = items[0] if items else {}
        price_data = first_item.get("price", {})
        
        unit_price_amount = None
        if price_data.get('unit_price'):
            unit_price_amount = float(price_data['unit_price'].get('amount', '0')) / 100 
        elif first_item.get('unit_price'):
             unit_price_amount = float(first_item['unit_price'].get('amount', '0')) / 100

        return {
            "paddle_subscription_id": sub_event_data.get("id"),
            "paddle_price_id": price_data.get("id"),
            "user_id": user_id, # Link to your internal user ID
            "status": sub_event_data.get("status"),
            "current_period_start": sub_event_data.get("current_billing_period", {}).get("starts_at"),
            "current_period_end": sub_event_data.get("current_billing_period", {}).get("ends_at"),
            "next_billed_at": sub_event_data.get("next_billed_at"),
            "cancel_at_period_end": sub_event_data.get("cancel_at_period_end"),
            "unit_price_amount": unit_price_amount,
            "quantity": first_item.get("quantity"),
        }

    # --- Handle different event types ---

    if event_type == "subscription.created":
        sub_details = extract_subscription_details(event_data)
        print(f"Subscription Created: {sub_details}")
        await db_upsert_subscription(db, sub_details)
        if user_id:
            await db_update_user_subscription_info(db, user_id, sub_details['status'], unit_price_amount=sub_details['unit_price_amount'],paddle_current_subscription_id=sub_details['paddle_subscription_id'])

    elif event_type == "subscription.activated":
        sub_details = extract_subscription_details(event_data)
        print(f"Subscription Activated: {sub_details}")
        await db_upsert_subscription(db, sub_details)
        if user_id:
            await db_update_user_subscription_info(db, user_id, sub_details['status'], unit_price_amount=sub_details['unit_price_amount'],paddle_current_subscription_id=sub_details['paddle_subscription_id'])

    elif event_type == "subscription.updated":
        sub_details = extract_subscription_details(event_data)
        print(f"Subscription Updated: {sub_details}")
        await db_upsert_subscription(db, sub_details)
        if user_id:
            await db_update_user_subscription_info(db, user_id, sub_details['status'], unit_price_amount=sub_details['unit_price_amount'],paddle_current_subscription_id=sub_details['paddle_subscription_id'])

    elif event_type == "subscription.canceled":
        sub_details = extract_subscription_details(event_data)
        print(f"Subscription Canceled: {sub_details}")
        await db_upsert_subscription(db, sub_details)
        if user_id:
            if sub_details.get('cancel_at_period_end'):
                print(f"Subscription {sub_details['paddle_subscription_id']} will cancel at period end. User remains on current plan until then.")
                # Optional: You might update user plan to 'canceling' or similar temporary status
                # await db_update_user_subscription_info(db, user_id, 'canceling', paddle_current_subscription_id=sub_details['paddle_subscription_id'])
            else:
                # Immediate cancellation: set user plan to 'free' and clear current subscription ID
                await db_update_user_subscription_info(db, user_id, 'free', unit_price_amount=None,paddle_current_subscription_id=None)

    elif event_type == "subscription.past_due":
        sub_details = extract_subscription_details(event_data)
        print(f"Subscription Past Due: {sub_details}")
        await db_upsert_subscription(db, sub_details)
        if user_id:
            await db_update_user_subscription_info(db, user_id, sub_details['status'],unit_price_amount=sub_details['unit_price_amount'],paddle_current_subscription_id=sub_details['paddle_subscription_id'])

    elif event_type == "subscription.paused":
        sub_details = extract_subscription_details(event_data)
        print(f"Subscription Paused: {sub_details}")
        await db_upsert_subscription(db, sub_details)
        if user_id:
            await db_update_user_subscription_info(db, user_id, sub_details['status'], unit_price_amount=sub_details['unit_price_amount'],paddle_current_subscription_id=sub_details['paddle_subscription_id'])

    elif event_type == "subscription.resumed":
        sub_details = extract_subscription_details(event_data)
        print(f"Subscription Resumed: {sub_details}")
        await db_upsert_subscription(db, sub_details)
        if user_id:
            await db_update_user_subscription_info(db, user_id, sub_details['status'], unit_price_amount=sub_details['unit_price_amount'],paddle_current_subscription_id=sub_details['paddle_subscription_id'])

    elif event_type == "subscription.expired":
        sub_details = extract_subscription_details(event_data)
        print(f"Subscription Expired: {sub_details}")
        await db_upsert_subscription(db, sub_details)
        if user_id:
            # Downgrade user to 'free' plan and clear current subscription ID.
            await db_update_user_subscription_info(db, user_id, 'free', paddle_current_subscription_id=None)

    elif event_type == "transaction.completed":
        transaction_id = event_data.get("id")
        transaction_status = event_data.get("status")
        subscription_id = event_data.get("subscription_id")
        customer_email = event_data.get("customer", {}).get("email")
        total_amount = event_data.get("details", {}).get("charge_totals", {}).get("total")
        
        print(f"Transaction Completed: ID={transaction_id}, Status={transaction_status}, Subscription ID={subscription_id}, Amount={total_amount}, Customer Email={customer_email}")
        
        if subscription_id:
            print(f"Payment confirmed for subscription: {subscription_id}")
        else:
            print("This is a one-time transaction, not linked to a subscription. Handle fulfillment here if applicable.")

    else:
        print(f"Unhandled event type: {event_type}")

    return JSONResponse({"status": "acknowledged", "event_type": event_type})

