from fastapi import HTTPException, status
from app.database import get_supabase
from app.schemas.kms import KmsArticleCreate


def create_article(data: KmsArticleCreate, user_id: str) -> dict:
    db = get_supabase()
    result = db.table("kms_articles").insert({
        "title": data.title,
        "content": data.content,
        "category": data.category,
        "keywords": data.keywords,
        "created_by": user_id,
    }).execute()
    return result.data[0]


def get_articles(category: str | None = None) -> list:
    db = get_supabase()
    query = db.table("kms_articles").select("*").eq("is_published", True)
    if category:
        query = query.eq("category", category)
    return query.order("view_count", desc=True).execute().data


def search_articles(q: str) -> list:
    db = get_supabase()
    terms = q.lower().split()
    result = db.table("kms_articles").select("*").eq("is_published", True).execute()

    def score(article):
        text = f"{article['title']} {article['content']} {' '.join(article['keywords'])}".lower()
        return sum(1 for term in terms if term in text)

    matches = [a for a in result.data if score(a) > 0]
    matches.sort(key=score, reverse=True)
    return matches


def get_article(article_id: str) -> dict:
    db = get_supabase()
    result = db.table("kms_articles").select("*").eq("id", article_id).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artículo no encontrado")

    db.table("kms_articles").update({"view_count": result.data[0]["view_count"] + 1}).eq("id", article_id).execute()
    return result.data[0]
