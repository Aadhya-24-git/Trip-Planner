from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class SaveTripRequest(BaseModel):
    destination_name: str
    destination_id: Optional[int] = None
    title: str
    starting_city: str = "Chennai"
    duration_days: int = 5
    travelers_count: int = 2
    travel_style: str = "Nature"
    trip_pace: str = "Balanced"
    total_budget: int
    per_person_budget: int
    status: str = "Planned"
    itinerary_data: List[Dict[str, Any]]
    budget_breakdown: Dict[str, Any]
    weather_info: Optional[Dict[str, Any]] = None
    notes: Optional[str] = ""

class UpdateTripRequest(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    itinerary_data: Optional[List[Dict[str, Any]]] = None

class SavedTripResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    destination_id: Optional[int] = None
    destination_name: str
    title: str
    starting_city: str
    duration_days: int
    travelers_count: int
    travel_style: str
    trip_pace: str
    total_budget: int
    per_person_budget: int
    status: str
    itinerary_data: List[Dict[str, Any]]
    budget_breakdown: Dict[str, Any]
    weather_info: Optional[Dict[str, Any]] = None
    notes: Optional[str] = ""
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
