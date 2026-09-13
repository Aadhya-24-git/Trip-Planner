import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "YatraPlan — Smart India Trip Planner"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./yatraplan.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "yatraplan_super_secret_jwt_key_india_travel_2025_secure")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
    MAP_API_KEY: str = os.getenv("MAP_API_KEY", "")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
