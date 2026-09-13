from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.destination import Destination
from app.models.attraction import Attraction
from app.schemas.destination import AttractionResponse

router = APIRouter(prefix="/api/attractions", tags=["Attractions"])

@router.get("/{destination}", response_model=List[AttractionResponse])
def get_destination_attractions(destination: str, db: Session = Depends(get_db)):
    dest = db.query(Destination).filter(Destination.name.ilike(f"%{destination}%")).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return db.query(Attraction).filter(Attraction.destination_id == dest.id).all()
