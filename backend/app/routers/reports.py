from fastapi import APIRouter, Depends, Query
from app.schemas.reports import ReportSummary
from app.services import reports as reports_service
from app.dependencies import require_role

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/summary", response_model=ReportSummary)
def summary(
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
    _=Depends(require_role("secretaria", "admin")),
):
    return reports_service.get_summary(date_from, date_to)
