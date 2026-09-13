from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Attraction(Base):
    __tablename__ = "attractions"

    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), default="Sightseeing")  # Nature, Heritage, Adventure, Temple, Viewpoint, Museum
    region_cluster = Column(String(50), default="central")  # north, south, central, east, west
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    duration_minutes = Column(Integer, default=90)
    entry_fee = Column(Integer, default=0)
    description = Column(Text, default="")
    image_url = Column(String(500), default="")
    best_time_of_day = Column(String(50), default="morning")  # morning, afternoon, evening

    destination = relationship("Destination", back_populates="attractions")
