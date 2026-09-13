import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.destination import Destination
from app.models.attraction import Attraction
from app.schemas.itinerary import (
    GenerateItineraryRequest, ItineraryResponse,
    ItineraryDay, ItineraryActivity
)
from app.services.budget_calculator import calculate_detailed_budget
from app.services.weather_service import get_destination_weather

DAILY_SCHEDULE_SLOTS = {
    "Relaxed": [
        ("09:30", 90, "Morning Explorer"),
        ("13:00", 75, "Authentic Lunch & Rest"),
        ("16:00", 120, "Afternoon Highlight"),
        ("19:30", 90, "Evening Leisure & Dinner")
    ],
    "Balanced": [
        ("08:30", 60, "Breakfast & Departure"),
        ("10:00", 120, "Morning Sightseeing"),
        ("13:00", 75, "Local Lunch"),
        ("15:00", 120, "Afternoon Exploration"),
        ("18:00", 90, "Sunset Point & Local Bazaar"),
        ("20:30", 75, "Dinner & Culture")
    ],
    "Packed": [
        ("07:00", 60, "Early Sunrise & Breakfast"),
        ("08:30", 90, "Morning Sightseeing 1"),
        ("10:30", 90, "Morning Sightseeing 2"),
        ("12:30", 60, "Quick Traditional Lunch"),
        ("14:00", 120, "Afternoon Landmark"),
        ("16:30", 90, "Scenic Activity / Viewpoint"),
        ("18:30", 90, "Evening Market & Street Food"),
        ("20:30", 75, "Dinner & Night Vibes")
    ]
}

def generate_smart_itinerary(req: GenerateItineraryRequest, db: Session) -> ItineraryResponse:
    # 1. Fetch destination
    dest = db.query(Destination).filter(Destination.name.ilike(f"%{req.destination_name}%")).first()
    if not dest:
        dest = db.query(Destination).first()
    
    # 2. Fetch destination attractions
    attractions = db.query(Attraction).filter(Attraction.destination_id == dest.id).all()
    
    # Group attractions by region_cluster
    cluster_map: Dict[str, List[Attraction]] = {
        "central": [],
        "north": [],
        "south": [],
        "east": [],
        "west": []
    }
    for att in attractions:
        cluster = (att.region_cluster or "central").lower()
        if cluster in cluster_map:
            cluster_map[cluster].append(att)
        else:
            cluster_map["central"].append(att)

    # Available clusters that have attractions
    active_clusters = [c for c, atts in cluster_map.items() if atts]
    if not active_clusters:
        active_clusters = ["central"]

    # Activity count and schedule slots based on pace
    slots = DAILY_SCHEDULE_SLOTS.get(req.trip_pace, DAILY_SCHEDULE_SLOTS["Balanced"])
    
    days: List[ItineraryDay] = []
    used_attraction_ids = set()

    for day_idx in range(1, req.duration_days + 1):
        # Pick cluster for the day to avoid criss-crossing
        cluster_for_day = active_clusters[(day_idx - 1) % len(active_clusters)]
        avail_in_cluster = [a for a in cluster_map[cluster_for_day] if a.id not in used_attraction_ids]
        
        # Fallback to any remaining attraction if cluster exhausted
        if not avail_in_cluster:
            avail_in_cluster = [a for a in attractions if a.id not in used_attraction_ids]
        if not avail_in_cluster:
            # If all used, recycle gracefully
            avail_in_cluster = attractions[:]

        day_activities: List[ItineraryActivity] = []
        
        # Determine theme and title
        if day_idx == 1:
            day_title = f"Day 1: Arrival in {dest.name} & Local Exploration"
            day_theme = f"Orientation, Settling In & {cluster_for_day.capitalize()} Sights"
        elif day_idx == req.duration_days:
            day_title = f"Day {day_idx}: Highlights & Departure"
            day_theme = "Scenic Farewell, Souvenirs & Relaxed Journey"
        else:
            day_title = f"Day {day_idx}: Discovering {cluster_for_day.capitalize()} {dest.name}"
            day_theme = f"Deep Dive into {cluster_for_day.capitalize()} Region Wonders"

        # Build activities for each slot in the day
        attraction_cursor = 0
        for slot_idx, (slot_time, default_duration, slot_desc) in enumerate(slots):
            activity_id = f"act-{day_idx}-{slot_idx + 1}-{str(uuid.uuid4())[:4]}"
            
            # Special logic for Day 1 start
            if day_idx == 1 and slot_idx == 0:
                act = ItineraryActivity(
                    id=activity_id,
                    time=slot_time,
                    activity=f"Arrive in {dest.name} & Check-in",
                    location=f"{dest.name} Main Hub / Hotel",
                    estimated_cost=0,
                    duration_minutes=default_duration,
                    description=f"Scenic arrival from {req.starting_city}. Check into accommodation, freshen up, and enjoy welcoming refreshments.",
                    travel_time="N/A",
                    category="Arrival",
                    region_cluster=cluster_for_day,
                    latitude=dest.latitude,
                    longitude=dest.longitude
                )
            # Special logic for Lunch slot
            elif "lunch" in slot_desc.lower():
                act = ItineraryActivity(
                    id=activity_id,
                    time=slot_time,
                    activity=f"Traditional {dest.name} Lunch Experience",
                    location=f"Local Authentic Eatery ({cluster_for_day.capitalize()})",
                    estimated_cost=350 * req.travelers_count,
                    duration_minutes=default_duration,
                    description=f"Savor authentic regional flavors and seasonal specials known to {dest.state}.",
                    travel_time="10 mins walk/drive",
                    category="Food",
                    region_cluster=cluster_for_day,
                    latitude=dest.latitude,
                    longitude=dest.longitude
                )
            # Special logic for Dinner slot
            elif "dinner" in slot_desc.lower():
                act = ItineraryActivity(
                    id=activity_id,
                    time=slot_time,
                    activity=f"Dinner & Evening Stroll",
                    location=f"{dest.name} Promenade / Restaurant",
                    estimated_cost=450 * req.travelers_count,
                    duration_minutes=default_duration,
                    description=f"Relax over a delicious evening meal, recap the day's adventures, and soak in {dest.name}'s evening ambiance.",
                    travel_time="15 mins walk/transit",
                    category="Food & Leisure",
                    region_cluster=cluster_for_day,
                    latitude=dest.latitude,
                    longitude=dest.longitude
                )
            # Departure on final day last slot
            elif day_idx == req.duration_days and slot_idx == len(slots) - 1:
                act = ItineraryActivity(
                    id=activity_id,
                    time=slot_time,
                    activity=f"Souvenir Shopping & Departure",
                    location=f"{dest.name} Market / Station / Airport",
                    estimated_cost=500,
                    duration_minutes=default_duration,
                    description=f"Pick up handmade tea, handicrafts, and spices. Head out with wonderful memories towards {req.starting_city}.",
                    travel_time="25 mins drive",
                    category="Departure",
                    region_cluster=cluster_for_day,
                    latitude=dest.latitude,
                    longitude=dest.longitude
                )
            else:
                # Assign a real attraction from the day's cluster
                if attraction_cursor < len(avail_in_cluster):
                    att = avail_in_cluster[attraction_cursor]
                    attraction_cursor += 1
                    used_attraction_ids.add(att.id)
                    act_name = att.name
                    act_loc = f"{att.name}, {cluster_for_day.capitalize()} {dest.name}"
                    act_cost = (att.entry_fee or 50) * req.travelers_count
                    act_dur = att.duration_minutes or default_duration
                    act_desc = att.description or f"Marvel at the scenic and cultural wonder of {att.name}."
                    act_cat = att.category or "Sightseeing"
                    lat = att.latitude or dest.latitude
                    lng = att.longitude or dest.longitude
                else:
                    act_name = f"{dest.name} Scenic Walk & Photo Point"
                    act_loc = f"{cluster_for_day.capitalize()} Viewpoint"
                    act_cost = 50 * req.travelers_count
                    act_dur = default_duration
                    act_desc = f"Enjoy panoramic vistas and peaceful surrounding vistas in {dest.name}."
                    act_cat = "Nature"
                    lat = dest.latitude
                    lng = dest.longitude

                prev_dist_desc = "15 mins drive within cluster" if slot_idx > 0 else "Start of morning route"
                act = ItineraryActivity(
                    id=activity_id,
                    time=slot_time,
                    activity=act_name,
                    location=act_loc,
                    estimated_cost=act_cost,
                    duration_minutes=act_dur,
                    description=act_desc,
                    travel_time=prev_dist_desc,
                    category=act_cat,
                    region_cluster=cluster_for_day,
                    latitude=lat,
                    longitude=lng
                )

            day_activities.append(act)

        days.append(ItineraryDay(
            day_number=day_idx,
            title=day_title,
            theme=day_theme,
            region_cluster=cluster_for_day,
            activities=day_activities
        ))

    # Calculate realistic budget breakdown
    budget_breakdown = calculate_detailed_budget(
        destination_name=dest.name,
        starting_city=req.starting_city,
        duration_days=req.duration_days,
        travelers_count=req.travelers_count,
        transportation=req.transportation,
        accommodation=req.accommodation_type,
        trip_pace=req.trip_pace
    )

    # Weather info
    weather = get_destination_weather(dest.name, dest.climate)

    return ItineraryResponse(
        destination_name=dest.name,
        destination_id=dest.id,
        state=dest.state,
        hero_image=dest.hero_image,
        starting_city=req.starting_city,
        duration_days=req.duration_days,
        travelers_count=req.travelers_count,
        trip_pace=req.trip_pace,
        total_estimated_budget=budget_breakdown.total_budget,
        per_person_budget=budget_breakdown.per_person_budget,
        days=days,
        budget_breakdown=budget_breakdown.model_dump(),
        weather_info=weather
    )
