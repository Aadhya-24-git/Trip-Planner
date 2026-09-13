from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.itinerary import (
    GenerateItineraryRequest, ItineraryResponse,
    ActivityCreate, ActivityUpdate, ItineraryActivity
)
from app.services.itinerary_generator import generate_smart_itinerary

router = APIRouter(prefix="/api/itinerary", tags=["Itinerary"])

@router.post("/generate", response_model=ItineraryResponse)
def generate_itinerary(
    req: GenerateItineraryRequest,
    db: Session = Depends(get_db)
):
    return generate_smart_itinerary(req, db)
