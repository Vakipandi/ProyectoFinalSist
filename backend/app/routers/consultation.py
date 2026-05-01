from fastapi import APIRouter, Depends
from app.schemas.consultation import ConsultationCreate, ConsultationResponse, StatusUpdate, ResponseUpdate, StatusHistoryResponse
from app.services import consultation as consultation_service
from app.dependencies import get_current_user, require_role

router = APIRouter(prefix="/consultations", tags=["consultations"])


@router.post("", response_model=ConsultationResponse)
def create(data: ConsultationCreate, current_user=Depends(require_role("alumno"))):
    return consultation_service.create_consultation(data, current_user["id"])


@router.get("", response_model=list[ConsultationResponse])
def get_all(_=Depends(require_role("secretaria", "admin"))):
    return consultation_service.get_all_consultations()


@router.get("/me", response_model=list[ConsultationResponse])
def get_mine(current_user=Depends(require_role("alumno"))):
    return consultation_service.get_my_consultations(current_user["id"])


@router.get("/{code}", response_model=ConsultationResponse)
def get_by_code(code: str, _=Depends(get_current_user)):
    return consultation_service.get_by_code(code)


@router.patch("/{code}/status", response_model=ConsultationResponse)
def update_status(code: str, data: StatusUpdate, current_user=Depends(require_role("secretaria", "admin"))):
    return consultation_service.update_status(code, data.status, current_user["id"], data.comment)


@router.patch("/{code}/response", response_model=ConsultationResponse)
def update_response(code: str, data: ResponseUpdate, current_user=Depends(require_role("secretaria", "admin"))):
    return consultation_service.update_response(code, data.response, current_user["id"])


@router.get("/{code}/history", response_model=list[StatusHistoryResponse])
def get_history(code: str, _=Depends(get_current_user)):
    return consultation_service.get_history(code)
