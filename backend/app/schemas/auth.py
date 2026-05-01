from pydantic import BaseModel, EmailStr
from typing import Literal


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str | None = None
    full_name: str
    role: Literal["alumno", "secretaria", "admin"]
    student_code: str | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    student_code: str | None


class LoginResponse(BaseModel):
    access_token: str
    user: UserResponse
