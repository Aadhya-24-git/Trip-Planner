import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
import app.models  # Ensure all SQLAlchemy models are registered
from app.routers import (
    auth, destinations, recommendations,
    itinerary, budget, trips, weather, foods, attractions
)

def init_and_seed_db():
    try:
        # Initialize tables
        Base.metadata.create_all(bind=engine)
        
        # Check if destinations exist; if not, automatically seed
        db = SessionLocal()
        from app.models.destination import Destination
        count = db.query(Destination).count()
        db.close()

        if count == 0:
            print("[INFO] Database is empty. Auto-seeding 32 Indian destinations...")
            backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            if backend_dir not in sys.path:
                sys.path.insert(0, backend_dir)
            from database.seed import seed_database
            seed_database()
            print("[INFO] Auto-seeding completed.")
        else:
            print(f"[INFO] Database ready with {count} destinations.")
    except Exception as e:
        print(f"[WARNING] Startup database warning: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_and_seed_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent, rule-based travel recommendation and itinerary generation platform for India.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
origins = settings.cors_origins_list
if "*" not in origins:
    origins.append("*")  # Allow development clients and Vercel comfortably

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to gracefully handle double /api prefixes (e.g. /api/api/recommendations -> /api/recommendations)
@app.middleware("http")
async def strip_duplicate_api_prefix(request: Request, call_next):
    if request.scope.get("path", "").startswith("/api/api/"):
        request.scope["path"] = request.scope["path"].replace("/api/api/", "/api/", 1)
    return await call_next(request)

# Global exception handler ensures 500 errors include CORS headers and do not get blocked by browser CORS policy
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin")
    headers = {}
    if origin:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"
        headers["Access-Control-Allow-Methods"] = "*"
        headers["Access-Control-Allow-Headers"] = "*"
    else:
        headers["Access-Control-Allow-Origin"] = "*"
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"},
        headers=headers
    )

# Mount API routers
app.include_router(auth.router)
app.include_router(destinations.router)
app.include_router(recommendations.router)
app.include_router(itinerary.router)
app.include_router(budget.router)
app.include_router(trips.router)
app.include_router(weather.router)
app.include_router(foods.router)
app.include_router(attractions.router)

@app.on_event("startup")
def on_startup():
    init_and_seed_db()

@app.get("/api/health")
def health_check():
    db_status = "connected"
    error_msg = None
    count = 0
    try:
        db = SessionLocal()
        from app.models.destination import Destination
        count = db.query(Destination).count()
        db.close()
        db_status = f"connected ({count} destinations)"
    except Exception as e:
        db_status = "error"
        error_msg = str(e)

    return {
        "status": "healthy" if count > 0 else ("unhealthy" if error_msg else "empty"),
        "app": settings.PROJECT_NAME,
        "database": db_status,
        "error": error_msg
    }

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "docs": "/docs",
        "health": "/api/health"
    }
