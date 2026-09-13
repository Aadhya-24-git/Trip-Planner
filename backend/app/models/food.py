from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(120), nullable=False)
    food_type = Column(String(50), default="veg")  # veg, non-veg, sweet, beverage, street-food
    description = Column(Text, default="")
    image_url = Column(String(500), default="")
    famous_spots = Column(String(255), default="")
    price_range = Column(String(50), default="₹100 - ₹300")

    destination = relationship("Destination", back_populates="food_items")
