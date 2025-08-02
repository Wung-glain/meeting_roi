from fastapi import APIRouter, Depends, HTTPException, status, Request, Body
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from fastapi.responses import RedirectResponse
from app.auth import schemas, utils, jwt
from app.db.models import User
from jose import JWTError
from jose import jwt as lib_jwt
from app.core.config import settings
from app.db.database import get_db
from app.auth.schemas import RegisterUser, LoginRequest, ResetPasswordRequest
from app.auth.utils import *
from datetime import datetime, timezone, timedelta
from app.db.models import Plan, Subscription, User
from pydantic import BaseModel
from app.db.database import get_db
import uuid
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.lib.email_utils import send_verification_email, send_reset_pass
from app.auth.jwt import verify_email_token, get_current_user, get_user_by_id, create_email_token, create_access_token



router = APIRouter()

class PlanResponse(BaseModel):
    plan_name: str
    current_period_end: Optional[datetime] = None
    subscription_status: Optional[str] = None

    class Config:
        orm_mode = True
class TokenData(BaseModel):
    user_id: str = None

class EmailRequest(BaseModel):
    email: str

def get_user_by_email(db, email):
    return db.query(User).filter(User.email == email).first()




@router.post("/register")
def register(user: RegisterUser, db: Session = Depends(get_db)):
    # 1. Prevent duplicate email
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Create user
    new_user = User(
        id=str(uuid.uuid4()),
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password),
        email_verified=False,
        plan_status="free",
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3. Fetch or create 'free' plan
    plan = db.query(Plan).filter(Plan.name == "free").first()
    if not plan:
        plan = Plan(
            name="free",
            price_usd=0.0,
            max_predictions_per_month=20,
            description="Free plan with limited access"
        )
        db.add(plan)
        db.commit()
        db.refresh(plan)

    # 4. Associate user with the plan
    new_user.plan_id = plan.id
    db.commit()

    # 5. Create a free subscription record (not tied to Paddle)
    subscription = Subscription(
        user_id=new_user.id,
        plan_id=plan.id,
        paddle_subscription_id="N/A",
        paddle_price_id="N/A",
        status="active",
        current_period_start=datetime.now(timezone.utc),
        current_period_end=None,
        next_billed_at=None,
        cancel_at_period_end=False,
        unit_price_amount=0.0,
        quantity=1
    )
    db.add(subscription)
    db.commit()

    return {
        "message": "User registered successfully with free plan",
        "user_id": str(new_user.id)
    }

@router.post("/login", response_model = schemas.Token)
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"user_id": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "email_verified": user.email_verified,
        "user_id": str(user.id),
        "full_name": user.full_name,
        "email": user.email
    }


#API for email verification
@router.post("/send-verification-email")
async def resend_verification_email(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    token = create_email_token(str(current_user.id))
    send_verification_email(current_user.email, token)
    return {"message": "Verification email sent."}

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    user_id = verify_email_token(token)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.email_verified = True
    db.commit()
    return {"message": "Email verified successfully"}

@router.get("/me")
def get_me(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == current_user.id)
        .order_by(Subscription.created_at.desc())
        .first()
    )

    # 🔍 Get plan info if available
    plan_name = None
    plan_expires = None
    last_payment = None
    payment_method = None

    if subscription and subscription.plan:
        plan_name = subscription.plan.name
        plan_expires = (
            subscription.current_period_end.isoformat()
            if subscription.current_period_end else None
        )
        last_payment = (
            subscription.current_period_start.isoformat()
            if subscription.current_period_start else None
        )
        # Optional logic for payment method (can be updated manually or inferred)
        if subscription.unit_price_amount and subscription.unit_price_amount > 0:
            payment_method = "card"  # Change logic here if you track it

    return {
        "user_id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "email_verified": current_user.email_verified,
        "subscription_plan": plan_name,
        "plan_expires": plan_expires,
        "last_payment": last_payment,
        "payment_method": payment_method,
        "created_at": current_user.created_at.isoformat(),
    }
class TokenPayload(BaseModel):
    token: str

@router.post("/verify")
def verify_email(payload: TokenPayload, db: Session = Depends(get_db)):
    token = payload.token
    try:
        user_id = verify_email_token(token)
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid token")

        user = get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user.email_verified:
            return {"message": "Email Validated"}

        user.email_verified = True
        db.commit()
        return {"message": "Email Verified"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
#API for passowrd reset email
@router.post("/request-password-reset")
async def resend_verification_email(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    
    token = create_email_token(str(data.email))
    send_reset_pass(data.email, token)
    return {"message": "Password reset email sent."}

@router.post("/reset-password")
def reset_password(token: str = Body(...), new_password: str = Body(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == token).first()
    if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired token.")

    # Here you can add password validation (length, complexity)
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="Password too short.")

    # Hash password (example with passlib)
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    user.password_hash = pwd_context.hash(new_password)

    # Clear reset token and expiry
    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()

    return {"msg": "Password reset successful"}


@router.get("/get-plan/{user_id}", response_model=PlanResponse)
def get_user_plan(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.plan:
        raise HTTPException(status_code=404, detail="User has no plan")

    # Get latest subscription for the user
    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == user.id)
        .order_by(Subscription.created_at.desc())
        .first()
    )

    current_period_end = subscription.current_period_end if subscription else None
    subscription_status = subscription.status if subscription else None

    return {
        "plan_name": user.plan.name,
        "current_period_end": current_period_end,
        "subscription_status": subscription_status,
    }