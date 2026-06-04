from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

is_sqlite = settings.DATABASE_URL.startswith("sqlite")

if is_sqlite:
    # Local dev — SQLite needs check_same_thread=False
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    # Production — PostgreSQL (Supabase connection pooler)
    # Use the pooler URL (port 6543) from Supabase settings — it forces IPv4
    # which is required on Render's free tier (no IPv6 outbound).
    db_url = settings.DATABASE_URL

    # Ensure SSL
    if "sslmode" not in db_url:
        separator = "&" if "?" in db_url else "?"
        db_url = f"{db_url}{separator}sslmode=require"

    # Detect pooler (PgBouncer) — disable prepared statements
    is_pooler = "pooler.supabase.com" in db_url or ":6543" in db_url
    connect_args = {"connect_timeout": 10}

    engine = create_engine(
        db_url,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
        pool_recycle=300,
        connect_args=connect_args,
        # PgBouncer (transaction mode) doesn't support prepared statements
        execution_options={"no_parameters": True} if is_pooler else {},
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> bool:
    """Returns True if the database is reachable."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
