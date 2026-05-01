from fastapi import APIRouter, Depends, Query
from app.schemas.kms import KmsArticleCreate, KmsArticleResponse
from app.services import kms as kms_service
from app.dependencies import get_current_user, require_role

router = APIRouter(prefix="/kms", tags=["kms"])


@router.post("", response_model=KmsArticleResponse)
def create(data: KmsArticleCreate, current_user=Depends(require_role("secretaria", "admin"))):
    return kms_service.create_article(data, current_user["id"])


@router.get("", response_model=list[KmsArticleResponse])
def get_all(category: str | None = Query(None), _=Depends(get_current_user)):
    return kms_service.get_articles(category)


@router.get("/search", response_model=list[KmsArticleResponse])
def search(q: str = Query(..., min_length=2), _=Depends(get_current_user)):
    return kms_service.search_articles(q)


@router.get("/{article_id}", response_model=KmsArticleResponse)
def get_one(article_id: str, _=Depends(get_current_user)):
    return kms_service.get_article(article_id)
