from pydantic import BaseModel


class ReportSummary(BaseModel):
    total: int
    by_status: dict[str, int]
    by_category: dict[str, int]
    by_priority: dict[str, int]
    by_month: dict[str, int]
    avg_resolution_days: float | None
