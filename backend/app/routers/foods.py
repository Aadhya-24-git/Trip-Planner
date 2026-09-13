from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.destination import Destination
from app.models.food import FoodItem
from app.schemas.destination import FoodItemResponse

router = APIRouter(prefix="/api/foods", tags=["Food Discovery"])

@router.get("/{destination}", response_model=List[FoodItemResponse])
def get_destination_foods(destination: str, db: Session = Depends(get_db)):
    dest = db.query(Destination).filter(Destination.name.ilike(f"%{destination}%")).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return db.query(FoodItem).filter(FoodItem.destination_id == dest.id).all()
