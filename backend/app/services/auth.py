from fastapi import HTTPException, status
from app.database import get_supabase
from app.schemas.auth import LoginRequest, RegisterRequest


def login(data: LoginRequest):
    db = get_supabase()
    try:
        auth_response = db.auth.sign_in_with_password({"email": data.email, "password": data.password})
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")

    if not auth_response.user or not auth_response.session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")

    user_id = auth_response.user.id

    result = db.table("users").select("*").eq("id", user_id).execute()

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado en el sistema")

    return {"access_token": auth_response.session.access_token, "user": result.data[0]}


def register(data: RegisterRequest):
    db = get_supabase()

    if data.role == "alumno":
        if not data.student_code or len(data.student_code) != 8 or not data.student_code.isdigit():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El código de alumno debe tener exactamente 8 dígitos")
        password = data.student_code
    else:
        if not data.password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La contraseña es requerida")
        password = data.password

    try:
        auth_response = db.auth.admin.create_user({
            "email": data.email,
            "password": password,
            "email_confirm": True,
        })
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    user_id = auth_response.user.id
    db.table("users").insert({
        "id": user_id,
        "email": data.email,
        "password_hash": "",
        "full_name": data.full_name,
        "role": data.role,
        "student_code": data.student_code,
    }).execute()

    result = db.table("users").select("*").eq("id", user_id).single().execute()
    return result.data
