from passlib.context import CryptContext
from app.core.config import settings
import secrets
from datetime import datetime, timezone, timedelta
from jose import jwt , JWTError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_reset_token(user_email: str):
    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    payload = {"sub": user_email, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_reset_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None