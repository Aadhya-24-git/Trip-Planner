from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class SavedTrip(Base):
    __tablename__ = "saved_trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id", ondelete="SET NULL"), nullable=True)
    destination_name = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    starting_city = Column(String(100), default="Chennai")
    duration_days = Column(Integer, default=5)
    travelers_count = Column(Integer, default=2)
    travel_style = Column(String(100), default="Nature")
    trip_pace = Column(String(50), default="Balanced")
    total_budget = Column(Integer, default=25000)
    per_person_budget = Column(Integer, default=12500)
    status = Column(String(50), default="Planned")  # Planned, Completed, BucketList
    itinerary_data = Column(JSON, default=list)  # List of days and activities
    budget_breakdown = Column(JSON, default=dict)
    weather_info = Column(JSON, default=dict)
    notes = Column(String(500), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
