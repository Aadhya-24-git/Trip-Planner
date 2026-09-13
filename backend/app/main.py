from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.models import *  # Ensure all models are registered
from app.routers import (
    auth, destinations, recommendations,
    itinerary, budget, trips, weather, foods, attractions
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent, rule-based travel recommendation and itinerary generation platform for India.",
    version="1.0.0"
)

# Configure CORS
origins = settings.cors_origins_list
if "*" not in origins:
    origins.append("*")  # Allow development clients comfortably

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

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "database": "connected"
    }

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "docs": "/docs",
        "health": "/api/health"
    }
