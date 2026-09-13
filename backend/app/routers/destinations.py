from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.destination import Destination
from app.schemas.destination import DestinationListItem, DestinationDetailResponse

router = APIRouter(prefix="/api/destinations", tags=["Destinations"])

@router.get("", response_model=List[DestinationListItem])
def list_destinations(
    state: Optional[str] = Query(None, description="Filter by state"),
    search: Optional[str] = Query(None, description="Search query in name, state or tagline"),
    style: Optional[str] = Query(None, description="Filter by travel style"),
    mood: Optional[str] = Query(None, description="Filter by mood"),
    max_budget: Optional[int] = Query(None, description="Maximum budget limit"),
    db: Session = Depends(get_db)
):
    query = db.query(Destination)

    if state:
        query = query.filter(Destination.state.ilike(f"%{state}%"))
    if search:
        query = query.filter(
            (Destination.name.ilike(f"%{search}%")) |
            (Destination.state.ilike(f"%{search}%")) |
            (Destination.tagline.ilike(f"%{search}%"))
        )
    if max_budget:
        query = query.filter(Destination.budget_min <= max_budget)

    destinations = query.all()

    # Filter in Python for JSON list columns if requested
    if style:
        style_lower = style.lower()
        destinations = [d for d in destinations if any(style_lower in s.lower() for s in (d.travel_styles or []))]

    if mood:
        mood_lower = mood.lower()
        destinations = [d for d in destinations if any(mood_lower in m.lower() for m in (d.mood_tags or []))]

    return destinations

@router.get("/states", response_model=List[str])
def get_unique_states(db: Session = Depends(get_db)):
    states = db.query(Destination.state).distinct().all()
    return sorted([s[0] for s in states if s[0]])

@router.get("/{id}", response_model=DestinationDetailResponse)
def get_destination_detail(id: int, db: Session = Depends(get_db)):
    dest = db.query(Destination).filter(Destination.id == id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest
