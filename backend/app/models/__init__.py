from app.database import Base
from app.models.user import User
from app.models.destination import Destination
from app.models.attraction import Attraction
from app.models.food import FoodItem
from app.models.trip import SavedTrip
from app.models.weather import WeatherCache

__all__ = [
    "Base",
    "User",
    "Destination",
    "Attraction",
    "FoodItem",
    "SavedTrip",
    "WeatherCache",
]
