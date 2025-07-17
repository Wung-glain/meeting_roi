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
from app.lib.email_utils import send_verification_email, send_reset_pass
from app.auth.jwt import verify_email_token, get_current_user, get_user_by_id, create_email_token, create_access_token



router = APIRouter()


class TokenData(BaseModel):
    user_id: str = None

class EmailRequest(BaseModel):
    email: str

def get_user_by_email(db, email):
    return db.query(User).filter(User.email == email).first()




@router.post("/register")
def register(user: RegisterUser, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Get or create plan
    plan = db.query(Plan).filter(Plan.name == user.plan).first()
    if not plan:
        plan = Plan(name=user.plan, description=f"{user.plan.title()} Plan", price_usd=0)
        db.add(plan)
        db.commit()
        db.refresh(plan)

    # Create subscription
    new_sub = Subscription(
        user_id=new_user.id,
        plan_id=plan.id,
        status="active",
        start_date = datetime.now(timezone.utc),
        end_date=None,
        stripe_customer_id=None,
        stripe_subscription_id=None
    )
    db.add(new_sub)
    db.commit()

    return {
        "message": "User registered and subscribed successfully",
        "user_id": str(new_user.id),
        "plan": plan.name
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
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "email_verified": current_user.email_verified,
    }

@router.get("/verify")
def verify_email(token: str, db: Session = Depends(get_db)):
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

    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
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