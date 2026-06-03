import random
import string
from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.database import get_supabase
from app.schemas.consultation import ConsultationCreate

KEYWORDS_ALTA = [
    "urgente", "emergencia", "bloqueado", "no puedo acceder", "error crítico",
    "suspendido", "deuda", "vencido", "plazo", "examen", "nota incorrecta"
]
KEYWORDS_MEDIA = [
    "problema", "falla", "demora", "pendiente", "solicitud", "revisión",
    "actualizar", "cambio", "modificar", "consulta"
]

AREA_MAP = {
    "sistemas": "Área de Sistemas",
    "academico": "Registro Académico",
    "matricula": "Registro Académico",
    "tramites": "Registro Académico",
    "financiero": "Finanzas",
    "infraestructura": "Infraestructura",
    "otro": "Secretaría General",
}


def _infer_priority(text: str) -> str:
    text_lower = text.lower()
    if any(k in text_lower for k in KEYWORDS_ALTA):
        return "alta"
    if any(k in text_lower for k in KEYWORDS_MEDIA):
        return "media"
    return "baja"


def _generate_code() -> str:
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"CON-{suffix}"


def create_consultation(data: ConsultationCreate, user_id: str) -> dict:
    db = get_supabase()

    code = _generate_code()
    while db.table("consultations").select("id").eq("code", code).execute().data:
        code = _generate_code()

    priority = _infer_priority(f"{data.title} {data.description}")
    assigned_area = AREA_MAP.get(data.category, "Secretaría General")

    result = db.table("consultations").insert({
        "code": code,
        "user_id": user_id,
        "category": data.category,
        "title": data.title,
        "description": data.description,
        "priority": priority,
        "status": "registrado",
        "assigned_area": assigned_area,
    }).execute()

    consultation = result.data[0]

    db.table("status_history").insert({
        "consultation_id": consultation["id"],
        "changed_by": user_id,
        "old_status": None,
        "new_status": "registrado",
        "comment": f"Consulta registrada y derivada a {assigned_area}",
    }).execute()

    db.table("consultations").update({
        "status": "derivado",
    }).eq("id", consultation["id"]).execute()

    db.table("status_history").insert({
        "consultation_id": consultation["id"],
        "changed_by": user_id,
        "old_status": "registrado",
        "new_status": "derivado",
        "comment": f"Derivado automáticamente a {assigned_area}",
    }).execute()

    final = db.table("consultations").select("*").eq("id", consultation["id"]).execute()
    return final.data[0]


def get_all_consultations() -> list:
    db = get_supabase()
    result = db.table("consultations").select("*").order("created_at", desc=True).execute()
    data = result.data
    priority_order = {"alta": 0, "media": 1, "baja": 2}
    data.sort(key=lambda c: (priority_order.get(c["priority"], 3), c["created_at"]))
    return data


def get_my_consultations(user_id: str) -> list:
    db = get_supabase()
    result = db.table("consultations").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data


def get_by_code(code: str) -> dict:
    db = get_supabase()
    result = db.table("consultations").select("*").eq("code", code).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consulta no encontrada")
    return result.data[0] 


def update_status(code: str, new_status: str, staff_id: str, comment: str | None) -> dict:
    db = get_supabase()
    result = db.table("consultations").select("*").eq("code", code).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consulta no encontrada")

    consultation = result.data[0]
    old_status = consultation["status"]

    updated = db.table("consultations").update({
        "status": new_status,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }).eq("code", code).execute()

    db.table("status_history").insert({
        "consultation_id": consultation["id"],
        "changed_by": staff_id,
        "old_status": old_status,
        "new_status": new_status,
        "comment": comment,
    }).execute()

    return updated.data[0]


def update_response(code: str, response_text: str, staff_id: str) -> dict:
    db = get_supabase()
    result = db.table("consultations").select("id", "status").eq("code", code).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consulta no encontrada")

    consultation = result.data[0]
    old_status = consultation["status"]

    updated = db.table("consultations").update({
        "response": response_text,
        "status": "resuelto",
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }).eq("code", code).execute()

    db.table("status_history").insert({
        "consultation_id": consultation["id"],
        "changed_by": staff_id,
        "old_status": old_status,
        "new_status": "resuelto",
        "comment": "Consulta respondida",
    }).execute()

    return updated.data[0]


def get_history(code: str) -> list:
    db = get_supabase()
    result = db.table("consultations").select("id").eq("code", code).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consulta no encontrada")

    consultation_id = result.data[0]["id"]
    history = db.table("status_history").select("*").eq("consultation_id", consultation_id).order("created_at").execute()
    return history.data
