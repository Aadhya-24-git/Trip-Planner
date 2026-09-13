import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

def create_app_engine():
    raw_url = (settings.DATABASE_URL or "").strip()
    
    # If the user has a placeholder or empty url, use local SQLite fallback
    if not raw_url or "ep-xyz" in raw_url:
        db_url = "sqlite:///./yatraplan.db"
    elif raw_url.startswith("postgres://"):
        db_url = raw_url.replace("postgres://", "postgresql://", 1)
    else:
        db_url = raw_url

    connect_args = {}
    if db_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
    elif db_url.startswith("postgresql"):
        if "sslmode" not in db_url:
            connect_args["sslmode"] = "require"

    try:
        eng = create_engine(db_url, connect_args=connect_args, pool_pre_ping=True)
        # Test connection immediately
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        return eng, db_url
    except Exception as e:
        print(f"[WARNING] Database connection to '{db_url}' failed ({e}). Falling back to SQLite.")
        fallback_url = "sqlite:///./yatraplan.db"
        eng = create_engine(fallback_url, connect_args={"check_same_thread": False}, pool_pre_ping=True)
        return eng, fallback_url

engine, active_db_url = create_app_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
