from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from datetime import datetime
from app.database import Base

class WeatherCache(Base):
    __tablename__ = "weather_cache"

    id = Column(Integer, primary_key=True, index=True)
    destination_name = Column(String(100), unique=True, index=True, nullable=False)
    temp_c = Column(Float, default=22.0)
    condition = Column(String(100), default="Partly Cloudy")
    humidity = Column(Integer, default=65)
    rainfall_prob = Column(Integer, default=15)
    best_sightseeing_day = Column(String(50), default="Tuesday")
    forecast_json = Column(JSON, default=list)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
