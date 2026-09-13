import requests
from typing import Dict, Any, List
from app.config import settings

# Seasonal realistic profiles for destinations
DESTINATION_WEATHER_PROFILES = {
    "munnar": {"temp": 20.5, "condition": "Mist & Partly Cloudy", "humidity": 78, "rain_prob": 20, "sightseeing_day": "Tuesday"},
    "alleppey": {"temp": 28.0, "condition": "Tropical Breeze", "humidity": 82, "rain_prob": 15, "sightseeing_day": "Wednesday"},
    "coorg": {"temp": 21.0, "condition": "Pleasant & Breezy", "humidity": 72, "rain_prob": 10, "sightseeing_day": "Thursday"},
    "manali": {"temp": 14.0, "condition": "Crisp Mountain Air", "humidity": 55, "rain_prob": 12, "sightseeing_day": "Monday"},
    "jaipur": {"temp": 26.5, "condition": "Sunny & Clear", "humidity": 42, "rain_prob": 5, "sightseeing_day": "Friday"},
    "goa": {"temp": 29.0, "condition": "Sunny & Coastal Warmth", "humidity": 75, "rain_prob": 8, "sightseeing_day": "Saturday"},
    "varanasi": {"temp": 27.0, "condition": "Hazy Sunshine", "humidity": 60, "rain_prob": 10, "sightseeing_day": "Sunday"},
    "rishikesh": {"temp": 22.0, "condition": "Clear Sky & Gentle Breeze", "humidity": 58, "rain_prob": 10, "sightseeing_day": "Wednesday"},
    "srinagar": {"temp": 16.0, "condition": "Cool & Clear Valleys", "humidity": 62, "rain_prob": 14, "sightseeing_day": "Tuesday"},
    "shillong": {"temp": 18.5, "condition": "Gentle Showers & Clouds", "humidity": 85, "rain_prob": 30, "sightseeing_day": "Thursday"},
    "udaipur": {"temp": 25.0, "condition": "Pleasant & Sunny", "humidity": 45, "rain_prob": 5, "sightseeing_day": "Monday"},
    "ooty": {"temp": 17.5, "condition": "Chilly & Misty", "humidity": 80, "rain_prob": 18, "sightseeing_day": "Wednesday"}
}

def get_destination_weather(destination_name: str, climate: str = "Pleasant") -> Dict[str, Any]:
    dest_key = destination_name.lower().strip()
    
    # 1. Try OpenWeather API if key provided
    if settings.WEATHER_API_KEY:
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?q={destination_name},IN&units=metric&appid={settings.WEATHER_API_KEY}"
            resp = requests.get(url, timeout=3)
            if resp.status_code == 200:
                data = resp.json()
                temp = round(data["main"]["temp"], 1)
                condition = data["weather"][0]["main"]
                humidity = data["main"]["humidity"]
                return {
                    "destination": destination_name,
                    "temperature": temp,
                    "condition": condition,
                    "humidity": humidity,
                    "rain_probability": 15,
                    "best_sightseeing_day": "Tomorrow",
                    "forecast": generate_5day_forecast(temp, condition)
                }
        except Exception:
            pass

    # 2. Database/seasonal fallback
    profile = DESTINATION_WEATHER_PROFILES.get(dest_key, {
        "temp": 24.0,
        "condition": "Pleasant & Clear",
        "humidity": 65,
        "rain_prob": 12,
        "sightseeing_day": "Tuesday"
    })

    return {
        "destination": destination_name,
        "temperature": profile["temp"],
        "condition": profile["condition"],
        "humidity": profile["humidity"],
        "rain_probability": profile["rain_prob"],
        "best_sightseeing_day": profile["sightseeing_day"],
        "forecast": generate_5day_forecast(profile["temp"], profile["condition"])
    }

def generate_5day_forecast(base_temp: float, condition: str) -> List[Dict[str, Any]]:
    days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]
    temp_offsets = [0.0, 1.2, -0.8, 0.5, -1.0]
    forecast = []
    for i in range(5):
        t = round(base_temp + temp_offsets[i], 1)
        cond = condition if i % 2 == 0 else "Partly Cloudy"
        forecast.append({
            "day": days[i],
            "temp_high": round(t + 2.5, 1),
            "temp_low": round(t - 3.5, 1),
            "condition": cond,
            "rain_prob": (10 + (i * 4)) % 35
        })
    return forecast
