from app.schemas.user import UserRegister, UserLogin, Token, UserResponse, UserUpdate
from app.schemas.destination import (
    DestinationListItem, DestinationDetailResponse,
    AttractionResponse, FoodItemResponse
)
from app.schemas.recommendation import (
    RecommendationRequest, RecommendationResponse,
    RecommendedDestination, ScoreBreakdown
)
from app.schemas.itinerary import (
    GenerateItineraryRequest, ItineraryResponse,
    ItineraryDay, ItineraryActivity, ActivityUpdate, ActivityCreate
)
from app.schemas.budget import BudgetCalculateRequest, BudgetBreakdownResponse
from app.schemas.trip import SaveTripRequest, UpdateTripRequest, SavedTripResponse

__all__ = [
    "UserRegister", "UserLogin", "Token", "UserResponse", "UserUpdate",
    "DestinationListItem", "DestinationDetailResponse", "AttractionResponse", "FoodItemResponse",
    "RecommendationRequest", "RecommendationResponse", "RecommendedDestination", "ScoreBreakdown",
    "GenerateItineraryRequest", "ItineraryResponse", "ItineraryDay", "ItineraryActivity",
    "ActivityUpdate", "ActivityCreate",
    "BudgetCalculateRequest", "BudgetBreakdownResponse",
    "SaveTripRequest", "UpdateTripRequest", "SavedTripResponse"
]
