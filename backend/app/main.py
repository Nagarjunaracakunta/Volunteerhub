from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base, check_db_connection
from app.routers import auth, admin
# future: from app.routers import host, volunteer, agency

# Auto-create tables (use Alembic migrations in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Volunteer & work-exchange platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow the React frontend
# Note: wildcard patterns like "https://*.vercel.app" don't work in FastAPI's
# CORSMiddleware — use allow_origin_regex for pattern matching instead.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,       # exact production Vercel URL from env var
        "http://localhost:5173",     # Vite dev server
        "http://localhost:3000",     # alternate dev port
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # all Vercel preview deploys
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": f"Welcome to {settings.APP_NAME} API", "docs": "/docs"}


@app.get("/health")
def health():
    db_ok = check_db_connection()
    return {
        "status": "ok" if db_ok else "degraded",
        "app": settings.APP_NAME,
        "database": "connected" if db_ok else "unreachable",
        "environment": settings.ENVIRONMENT,
    }
