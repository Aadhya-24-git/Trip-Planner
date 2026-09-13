from pydantic import BaseModel
from typing import List, Optional

class AttractionResponse(BaseModel):
    id: int
    name: str
    category: str
    region_cluster: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    duration_minutes: int
    entry_fee: int
    description: str
    image_url: str
    best_time_of_day: str

    class Config:
        from_attributes = True

class FoodItemResponse(BaseModel):
    id: int
    name: str
    food_type: str
    description: str
    image_url: str
    famous_spots: str
    price_range: str

    class Config:
        from_attributes = True

class DestinationListItem(BaseModel):
    id: int
    name: str
    state: str
    tagline: str
    description: str
    hero_image: str
    gallery: List[str] = []
    budget_min: int
    budget_max: int
    ideal_days_min: int
    ideal_days_max: int
    best_months: List[str] = []
    latitude: float
    longitude: float
    travel_styles: List[str] = []
    interests: List[str] = []
    average_rating: float
    climate: str
    highlights: List[str] = []
    mood_tags: List[str] = []
    airport_nearest: Optional[str] = ""
    railway_nearest: Optional[str] = ""

    class Config:
        from_attributes = True

class DestinationDetailResponse(DestinationListItem):
    travel_tips: List[str] = []
    attractions: List[AttractionResponse] = []
    food_items: List[FoodItemResponse] = []

    class Config:
        from_attributes = True
