from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import Destination
from app.routers import (
    auth, destinations, recommendations,
    itinerary, budget, trips, weather, foods, attractions
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent, rule-based travel recommendation and itinerary generation platform for India.",
    version="1.0.0"
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
    try:
        # Initialize tables
        Base.metadata.create_all(bind=engine)
        
        # Check if destinations exist; if not, automatically seed
        db = SessionLocal()
        count = db.query(Destination).count()
        db.close()

        if count == 0:
            print("🌱 Database is empty. Auto-seeding 32 Indian destinations...")
            from database.seed import seed_database
            seed_database()
            print("✅ Auto-seeding completed.")
    except Exception as e:
        print(f"⚠️ Startup database warning: {e}")

@app.get("/api/health")
def health_check():
    db_status = "connected"
    try:
        db = SessionLocal()
        db.execute(Base.metadata.tables["destinations"].select().limit(1))
        db.close()
    except Exception:
        db_status = "error_or_warming_up"

    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "database": db_status
    }

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "docs": "/docs",
        "health": "/api/health"
    }
