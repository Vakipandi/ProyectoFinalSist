from pydantic import BaseModel
from typing import Literal
from datetime import datetime


class KmsArticleCreate(BaseModel):
    title: str
    content: str
    category: Literal["academico", "financiero", "infraestructura", "sistemas", "matricula", "tramites"]
    keywords: list[str]


class KmsArticleResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str
    keywords: list[str]
    is_published: bool
    view_count: int
    created_by: str | None
    created_at: datetime
    updated_at: datetime
