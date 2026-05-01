from fastapi import APIRouter, Depends
from app.schemas.auth import LoginRequest, LoginResponse, RegisterRequest, UserResponse
from app.services import auth as auth_service
from app.dependencies import get_current_user, require_role

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest):
    return auth_service.login(data)


@router.post("/register", response_model=UserResponse)
def register(data: RegisterRequest, _=Depends(require_role("admin"))):
    return auth_service.register(data)


@router.get("/me", response_model=UserResponse)
def me(current_user=Depends(get_current_user)):
    return current_user
