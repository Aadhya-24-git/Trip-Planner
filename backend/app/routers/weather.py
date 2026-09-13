from fastapi import APIRouter
from app.services.weather_service import get_destination_weather

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("/{destination}")
def get_weather(destination: str):
    return get_destination_weather(destination)
