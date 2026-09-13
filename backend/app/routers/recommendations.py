from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation import generate_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.post("", response_model=RecommendationResponse)
def get_trip_recommendations(
    req: RecommendationRequest,
    db: Session = Depends(get_db)
):
    return generate_recommendations(req, db)
