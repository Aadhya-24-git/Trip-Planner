from pydantic import BaseModel
from typing import List, Optional, Dict

class RecommendationRequest(BaseModel):
    starting_city: str = "Chennai"
    starting_state: Optional[str] = "Tamil Nadu"
    known_destination: Optional[str] = None  # None if "Help me choose"
    duration_days: int = 5
    budget: int = 25000  # Total or per-person
    budget_is_per_person: bool = False
    traveler_type: str = "Couple"  # Solo, Couple, Family, Friends, Group
    travelers_count: int = 2
    travel_styles: List[str] = ["Nature", "Adventure"]
    interests: List[str] = ["Mountains", "Food", "Photography"]
    transportation: str = "Train"
    accommodation: str = "3-star"
    trip_pace: str = "Balanced"  # Relaxed, Balanced, Packed
    travel_month: Optional[str] = "Oct"

class ScoreBreakdown(BaseModel):
    budget_score: float
    duration_score: float
    interest_score: float
    style_score: float
    season_score: float
    traveler_score: float
    rating_score: float
    total_score: float

class RecommendedDestination(BaseModel):
    id: int
    name: str
    state: str
    tagline: str
    hero_image: str
    match_score: int  # 0 - 100
    estimated_cost: int
    ideal_days: str
    best_season: str
    why_recommended: str
    match_reasons: List[str]
    score_breakdown: ScoreBreakdown
    highlights: List[str]
    average_rating: float
    climate: str

class RecommendationResponse(BaseModel):
    query_summary: Dict[str, str]
    destinations: List[RecommendedDestination]
