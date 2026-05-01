from supabase import create_client, Client
from app.config import settings


def get_supabase() -> Client:
    client = create_client(settings.supabase_url, settings.supabase_key)
    client.postgrest.auth(settings.supabase_key)
    return client
