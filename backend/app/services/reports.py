from app.database import get_supabase
from datetime import datetime


def get_summary(date_from: str | None, date_to: str | None) -> dict:
    db = get_supabase()
    query = db.table("consultations").select("status, category, priority, created_at, updated_at")

    if date_from:
        query = query.gte("created_at", date_from)
    if date_to:
        query = query.lte("created_at", date_to)

    data = query.execute().data

    by_status: dict[str, int] = {}
    by_category: dict[str, int] = {}
    by_priority: dict[str, int] = {}
    by_month: dict[str, int] = {}

    resolution_times = []

    for row in data:
        by_status[row["status"]] = by_status.get(row["status"], 0) + 1
        by_category[row["category"]] = by_category.get(row["category"], 0) + 1
        by_priority[row["priority"]] = by_priority.get(row["priority"], 0) + 1

        created = row.get("created_at", "")
        if created:
            month_key = created[:7]
            by_month[month_key] = by_month.get(month_key, 0) + 1

        if row["status"] == "resuelto" and row.get("updated_at"):
            try:
                t_create = datetime.fromisoformat(created.replace("Z", "+00:00"))
                t_update = datetime.fromisoformat(row["updated_at"].replace("Z", "+00:00"))
                diff_days = (t_update - t_create).total_seconds() / 86400
                resolution_times.append(diff_days)
            except (ValueError, TypeError):
                pass

    avg_resolution_days = round(sum(resolution_times) / len(resolution_times), 1) if resolution_times else None

    return {
        "total": len(data),
        "by_status": by_status,
        "by_category": by_category,
        "by_priority": by_priority,
        "by_month": dict(sorted(by_month.items())),
        "avg_resolution_days": avg_resolution_days,
    }
