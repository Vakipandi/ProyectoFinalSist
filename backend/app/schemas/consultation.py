from pydantic import BaseModel
from typing import Literal
from datetime import datetime


class ConsultationCreate(BaseModel):
    category: Literal["academico", "financiero", "infraestructura", "sistemas", "matricula", "tramites", "otro"]
    title: str
    description: str


class StatusUpdate(BaseModel):
    status: Literal["registrado", "derivado", "en_revision", "resuelto"]
    comment: str | None = None


class ResponseUpdate(BaseModel):
    response: str


class ConsultationResponse(BaseModel):
    id: str
    code: str
    user_id: str
    category: str
    title: str
    description: str
    priority: str
    status: str
    assigned_to: str | None
    assigned_area: str | None
    response: str | None
    created_at: datetime
    updated_at: datetime


class StatusHistoryResponse(BaseModel):
    id: str
    consultation_id: str
    changed_by: str
    old_status: str | None
    new_status: str
    comment: str | None
    created_at: datetime
