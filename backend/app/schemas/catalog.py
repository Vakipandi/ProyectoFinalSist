from pydantic import BaseModel
from typing import Literal
from datetime import datetime


class ServiceCreate(BaseModel):
    name: str
    description: str
    requirements: str | None = None
    responsible: str
    estimated_time: str
    procedure: str
    category: Literal["academico", "financiero", "infraestructura", "sistemas", "matricula", "tramites"]


class ServiceResponse(BaseModel):
    id: str
    name: str
    description: str
    requirements: str | None
    responsible: str
    estimated_time: str
    procedure: str
    category: str
    is_active: bool
    created_at: datetime
