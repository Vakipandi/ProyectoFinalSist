from fastapi import APIRouter, Depends, Query
from app.schemas.catalog import ServiceCreate, ServiceResponse
from app.services import catalog as catalog_service
from app.dependencies import get_current_user, require_role

router = APIRouter(prefix="/catalog", tags=["catalog"])


@router.get("", response_model=list[ServiceResponse])
def get_all(category: str | None = Query(None), _=Depends(get_current_user)):
    return catalog_service.get_services(category)


@router.get("/{service_id}", response_model=ServiceResponse)
def get_one(service_id: str, _=Depends(get_current_user)):
    return catalog_service.get_service(service_id)


@router.post("", response_model=ServiceResponse)
def create(data: ServiceCreate, _=Depends(require_role("admin"))):
    return catalog_service.create_service(data)


@router.put("/{service_id}", response_model=ServiceResponse)
def update(service_id: str, data: ServiceCreate, _=Depends(require_role("admin"))):
    return catalog_service.update_service(service_id, data)


@router.delete("/{service_id}")
def delete(service_id: str, _=Depends(require_role("admin"))):
    catalog_service.delete_service(service_id)
    return {"ok": True}
