from sqlalchemy import Column, Integer, String, Float, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    state = Column(String(100), index=True, nullable=False)
    tagline = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    hero_image = Column(String(500), nullable=False)
    gallery = Column(JSON, default=list)  # list of image URLs
    budget_min = Column(Integer, nullable=False)
    budget_max = Column(Integer, nullable=False)
    ideal_days_min = Column(Integer, default=3)
    ideal_days_max = Column(Integer, default=5)
    best_months = Column(JSON, default=list)  # ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    travel_styles = Column(JSON, default=list)  # ["Nature", "Relaxed", "Adventure", "Romantic"]
    interests = Column(JSON, default=list)  # ["Tea Estates", "Hiking", "Waterfalls", "Wildlife"]
    average_rating = Column(Float, default=4.8)
    climate = Column(String(100), default="Pleasant & Cool")
    highlights = Column(JSON, default=list)
    mood_tags = Column(JSON, default=list)  # ["Mountain Escape", "Nature Retreat"]
    airport_nearest = Column(String(150), default="")
    railway_nearest = Column(String(150), default="")
    travel_tips = Column(JSON, default=list)

    attractions = relationship("Attraction", back_populates="destination", cascade="all, delete-orphan")
    food_items = relationship("FoodItem", back_populates="destination", cascade="all, delete-orphan")
