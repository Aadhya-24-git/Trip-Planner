from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    home_city: Optional[str] = "Chennai"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    home_city: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    home_city: Optional[str] = "Chennai"
    preferences: Optional[Dict[str, Any]] = {}
    created_at: datetime

    class Config:
        from_attributes = True

Token.model_rebuild()
