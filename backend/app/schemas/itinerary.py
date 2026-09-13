from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ItineraryActivity(BaseModel):
    id: str
    time: str
    activity: str
    location: str
    estimated_cost: int
    duration_minutes: int
    description: str
    travel_time: str
    category: str = "Sightseeing"
    region_cluster: str = "central"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ItineraryDay(BaseModel):
    day_number: int
    title: str
    theme: str
    region_cluster: str
    activities: List[ItineraryActivity]

class GenerateItineraryRequest(BaseModel):
    destination_name: str
    starting_city: str = "Chennai"
    duration_days: int = 5
    travelers_count: int = 2
    travel_style: str = "Nature"
    interests: List[str] = ["Mountains", "Food", "Photography"]
    trip_pace: str = "Balanced"  # Relaxed (3-4/day), Balanced (4-6/day), Packed (6-8/day)
    accommodation_type: str = "3-star"
    transportation: str = "Train"
    budget: Optional[int] = 25000

class ItineraryResponse(BaseModel):
    destination_name: str
    destination_id: Optional[int] = None
    state: str
    hero_image: str
    starting_city: str
    duration_days: int
    travelers_count: int
    trip_pace: str
    total_estimated_budget: int
    per_person_budget: int
    days: List[ItineraryDay]
    budget_breakdown: Dict[str, Any]
    weather_info: Optional[Dict[str, Any]] = None

class ActivityUpdate(BaseModel):
    time: Optional[str] = None
    activity: Optional[str] = None
    location: Optional[str] = None
    estimated_cost: Optional[int] = None
    duration_minutes: Optional[int] = None
    description: Optional[str] = None

class ActivityCreate(BaseModel):
    day_number: int
    time: str
    activity: str
    location: str
    estimated_cost: int = 0
    duration_minutes: int = 60
    description: str = ""
    category: str = "Sightseeing"
