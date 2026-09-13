from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.trip import SavedTrip
from app.models.user import User
from app.schemas.trip import SaveTripRequest, UpdateTripRequest, SavedTripResponse
from app.auth import get_optional_current_user, get_current_user

router = APIRouter(prefix="/api/trips", tags=["Saved Trips"])

@router.post("", response_model=SavedTripResponse, status_code=status.HTTP_201_CREATED)
def save_trip(
    trip_in: SaveTripRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None

    trip = SavedTrip(
        user_id=user_id,
        destination_id=trip_in.destination_id,
        destination_name=trip_in.destination_name,
        title=trip_in.title,
        starting_city=trip_in.starting_city,
        duration_days=trip_in.duration_days,
        travelers_count=trip_in.travelers_count,
        travel_style=trip_in.travel_style,
        trip_pace=trip_in.trip_pace,
        total_budget=trip_in.total_budget,
        per_person_budget=trip_in.per_person_budget,
        status=trip_in.status or "Planned",
        itinerary_data=trip_in.itinerary_data,
        budget_breakdown=trip_in.budget_breakdown,
        weather_info=trip_in.weather_info or {},
        notes=trip_in.notes or ""
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip

@router.get("", response_model=List[SavedTripResponse])
def get_saved_trips(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    if current_user:
        return db.query(SavedTrip).filter(SavedTrip.user_id == current_user.id).order_by(SavedTrip.created_at.desc()).all()
    # For demo without immediate login, return latest trips
    return db.query(SavedTrip).order_by(SavedTrip.created_at.desc()).limit(10).all()

@router.get("/{id}", response_model=SavedTripResponse)
def get_trip_by_id(id: int, db: Session = Depends(get_db)):
    trip = db.query(SavedTrip).filter(SavedTrip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.put("/{id}", response_model=SavedTripResponse)
def update_trip(
    id: int,
    trip_in: UpdateTripRequest,
    db: Session = Depends(get_db)
):
    trip = db.query(SavedTrip).filter(SavedTrip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip_in.title is not None:
        trip.title = trip_in.title
    if trip_in.status is not None:
        trip.status = trip_in.status
    if trip_in.notes is not None:
        trip.notes = trip_in.notes
    if trip_in.itinerary_data is not None:
        trip.itinerary_data = trip_in.itinerary_data

    db.commit()
    db.refresh(trip)
    return trip

@router.post("/{id}/duplicate", response_model=SavedTripResponse, status_code=status.HTTP_201_CREATED)
def duplicate_trip(id: int, db: Session = Depends(get_db)):
    original = db.query(SavedTrip).filter(SavedTrip.id == id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Original trip not found")
    
    copy_trip = SavedTrip(
        user_id=original.user_id,
        destination_id=original.destination_id,
        destination_name=original.destination_name,
        title=f"{original.title} (Copy)",
        starting_city=original.starting_city,
        duration_days=original.duration_days,
        travelers_count=original.travelers_count,
        travel_style=original.travel_style,
        trip_pace=original.trip_pace,
        total_budget=original.total_budget,
        per_person_budget=original.per_person_budget,
        status="Planned",
        itinerary_data=original.itinerary_data,
        budget_breakdown=original.budget_breakdown,
        weather_info=original.weather_info,
        notes=original.notes
    )
    db.add(copy_trip)
    db.commit()
    db.refresh(copy_trip)
    return copy_trip

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(id: int, db: Session = Depends(get_db)):
    trip = db.query(SavedTrip).filter(SavedTrip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return None
