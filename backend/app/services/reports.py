from app.database import get_supabase


def get_summary(date_from: str | None, date_to: str | None) -> dict:
    db = get_supabase()
    query = db.table("consultations").select("status, category, priority")

    if date_from:
        query = query.gte("created_at", date_from)
    if date_to:
        query = query.lte("created_at", date_to)

    data = query.execute().data

    by_status: dict[str, int] = {}
    by_category: dict[str, int] = {}
    by_priority: dict[str, int] = {}

    for row in data:
        by_status[row["status"]] = by_status.get(row["status"], 0) + 1
        by_category[row["category"]] = by_category.get(row["category"], 0) + 1
        by_priority[row["priority"]] = by_priority.get(row["priority"], 0) + 1

    return {
        "total": len(data),
        "by_status": by_status,
        "by_category": by_category,
        "by_priority": by_priority,
    }
