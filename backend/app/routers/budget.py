from fastapi import APIRouter
from app.schemas.budget import BudgetCalculateRequest, BudgetBreakdownResponse
from app.services.budget_calculator import calculate_detailed_budget

router = APIRouter(prefix="/api/budget", tags=["Budget"])

@router.post("/calculate", response_model=BudgetBreakdownResponse)
def calculate_budget(req: BudgetCalculateRequest):
    return calculate_detailed_budget(
        destination_name=req.destination_name,
        starting_city=req.starting_city,
        duration_days=req.duration_days,
        travelers_count=req.travelers_count,
        transportation=req.transportation,
        accommodation=req.accommodation,
        trip_pace=req.trip_pace
    )
