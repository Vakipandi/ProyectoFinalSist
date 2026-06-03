from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, consultation, kms, reports, catalog

app = FastAPI(
    title="Sistema de Gestión de Consultas",
    version="1.0.0",
    docs_url="/docs" if settings.app_env != "production" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(consultation.router)
app.include_router(kms.router)
app.include_router(reports.router)
app.include_router(catalog.router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
