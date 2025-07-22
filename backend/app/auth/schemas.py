from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterUser(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    email_verified: bool
    user_id: str
    full_name: str
    email: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    email: EmailStr
    new_password: str