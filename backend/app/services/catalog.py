from fastapi import HTTPException, status
from app.database import get_supabase
from app.schemas.catalog import ServiceCreate


def get_services(category: str | None = None) -> list:
    db = get_supabase()
    query = db.table("service_catalog").select("*").eq("is_active", True)
    if category:
        query = query.eq("category", category)
    return query.order("name").execute().data


def get_service(service_id: str) -> dict:
    db = get_supabase()
    result = db.table("service_catalog").select("*").eq("id", service_id).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
    return result.data[0]


def create_service(data: ServiceCreate) -> dict:
    db = get_supabase()
    result = db.table("service_catalog").insert({
        "name": data.name,
        "description": data.description,
        "requirements": data.requirements,
        "responsible": data.responsible,
        "estimated_time": data.estimated_time,
        "procedure": data.procedure,
        "category": data.category,
    }).execute()
    return result.data[0]


def update_service(service_id: str, data: ServiceCreate) -> dict:
    db = get_supabase()
    result = db.table("service_catalog").update({
        "name": data.name,
        "description": data.description,
        "requirements": data.requirements,
        "responsible": data.responsible,
        "estimated_time": data.estimated_time,
        "procedure": data.procedure,
        "category": data.category,
    }).eq("id", service_id).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
    return result.data[0]


def delete_service(service_id: str) -> None:
    db = get_supabase()
    db.table("service_catalog").update({"is_active": False}).eq("id", service_id).execute()
