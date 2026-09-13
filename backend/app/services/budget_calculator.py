import math
from app.schemas.budget import BudgetBreakdownResponse, BudgetCategoryItem

# Base transit cost estimates per person (round trip baseline from origin to destination)
TRANSIT_COSTS = {
    "flight": 7500,
    "train": 1800,
    "bus": 1200,
    "car": 3500,
    "bike": 1500,
    "public transport": 900
}

# Daily room rate per night
ACCOMMODATION_RATES = {
    "hostel": 800,
    "budget hotel": 1600,
    "homestay": 2400,
    "3-star": 3200,
    "4-star": 5500,
    "5-star": 10500,
    "resort": 7500
}

# Daily food allowance per person based on pace
DAILY_FOOD_RATES = {
    "relaxed": 800,
    "balanced": 1000,
    "packed": 1200
}

# Daily local transport allowance
DAILY_LOCAL_TRANSIT = {
    "relaxed": 500,
    "balanced": 700,
    "packed": 900
}

def calculate_detailed_budget(
    destination_name: str,
    starting_city: str,
    duration_days: int,
    travelers_count: int,
    transportation: str = "Train",
    accommodation: str = "3-star",
    trip_pace: str = "Balanced"
) -> BudgetBreakdownResponse:
    # 1. Transportation cost
    transit_key = transportation.lower().strip()
    per_person_transit = TRANSIT_COSTS.get(transit_key, 2000)
    # If starting city is very close (e.g. within state), slight adjustment
    transport_total = per_person_transit * travelers_count

    # 2. Accommodation cost (number of rooms needed: ceil(travelers / 2))
    hotel_key = accommodation.lower().strip()
    nightly_room_rate = ACCOMMODATION_RATES.get(hotel_key, 3000)
    rooms_needed = max(1, math.ceil(travelers_count / 2))
    nights = max(1, duration_days - 1)
    # If hostel, it's per bed
    if "hostel" in hotel_key:
        accom_total = nightly_room_rate * travelers_count * nights
    else:
        accom_total = nightly_room_rate * rooms_needed * nights

    # 3. Food cost
    food_rate = DAILY_FOOD_RATES.get(trip_pace.lower(), 1000)
    food_total = food_rate * travelers_count * duration_days

    # 4. Activities cost (tickets, national parks, experiences)
    activities_per_day = 450 if trip_pace.lower() == "relaxed" else (650 if trip_pace.lower() == "balanced" else 850)
    activities_total = activities_per_day * travelers_count * duration_days

    # 5. Local transport (auto rickshaws, cabs, scooters)
    local_rate = DAILY_LOCAL_TRANSIT.get(trip_pace.lower(), 700)
    local_transport_total = local_rate * duration_days * max(1, math.ceil(travelers_count / 2))

    # 6. Miscellaneous (shopping buffer, bottled water, tips)
    misc_total = int(350 * travelers_count * duration_days)

    grand_total = (
        transport_total + accom_total + food_total +
        activities_total + local_transport_total + misc_total
    )

    per_person = int(round(grand_total / max(1, travelers_count)))

    def make_item(amount: int, desc: str) -> BudgetCategoryItem:
        pct = round((amount / max(1, grand_total)) * 100, 1)
        return BudgetCategoryItem(amount=amount, percentage=pct, description=desc)

    return BudgetBreakdownResponse(
        destination_name=destination_name,
        duration_days=duration_days,
        travelers_count=travelers_count,
        transportation=make_item(transport_total, f"Roundtrip {transportation} from {starting_city} for {travelers_count} travelers"),
        accommodation=make_item(accom_total, f"{nights} nights in {accommodation} ({rooms_needed} room{'s' if rooms_needed > 1 else ''})"),
        food=make_item(food_total, f"3 authentic meals/day + refreshments for {travelers_count} travelers"),
        activities=make_item(activities_total, f"Entry tickets, viewpoint fees & experiences"),
        local_transport=make_item(local_transport_total, f"Local cabs, autos and transfers across sights"),
        miscellaneous=make_item(misc_total, f"Emergency buffer, souvenir shopping & tips"),
        total_budget=grand_total,
        per_person_budget=per_person
    )
