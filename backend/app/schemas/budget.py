from pydantic import BaseModel
from typing import Dict

class BudgetCalculateRequest(BaseModel):
    destination_name: str
    starting_city: str = "Chennai"
    duration_days: int = 5
    travelers_count: int = 2
    transportation: str = "Train"  # Flight, Train, Bus, Car, Bike, Public transport
    accommodation: str = "3-star"  # Budget hotel, Hostel, Homestay, 3-star, 4-star, 5-star, Resort
    trip_pace: str = "Balanced"

class BudgetCategoryItem(BaseModel):
    amount: int
    percentage: float
    description: str

class BudgetBreakdownResponse(BaseModel):
    destination_name: str
    duration_days: int
    travelers_count: int
    transportation: BudgetCategoryItem
    accommodation: BudgetCategoryItem
    food: BudgetCategoryItem
    activities: BudgetCategoryItem
    local_transport: BudgetCategoryItem
    miscellaneous: BudgetCategoryItem
    total_budget: int
    per_person_budget: int
