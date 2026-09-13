import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add backend to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("🚀 Starting Backend Integration Tests...")

    # 1. Health check
    resp = client.get("/api/health")
    assert resp.status_code == 200, f"Health check failed: {resp.text}"
    print("✅ 1. Health check passed")

    # 2. Destinations list
    resp = client.get("/api/destinations")
    assert resp.status_code == 200
    dests = resp.json()
    assert len(dests) >= 30, f"Expected >= 30 destinations, got {len(dests)}"
    print(f"✅ 2. Destinations endpoint returned {len(dests)} destinations")

    # Filter test
    resp_filtered = client.get("/api/destinations?state=Kerala")
    assert resp_filtered.status_code == 200
    kerala_dests = resp_filtered.json()
    assert len(kerala_dests) >= 4
    print(f"✅ 3. State filter returned {len(kerala_dests)} destinations for Kerala")

    # Destination detail
    munnar_id = next(d["id"] for d in dests if d["name"] == "Munnar")
    resp_detail = client.get(f"/api/destinations/{munnar_id}")
    assert resp_detail.status_code == 200
    munnar_data = resp_detail.json()
    assert len(munnar_data["attractions"]) > 0
    assert len(munnar_data["food_items"]) > 0
    print(f"✅ 4. Destination detail for Munnar loaded with {len(munnar_data['attractions'])} attractions and {len(munnar_data['food_items'])} food items")

    # 5. Recommendation Engine Test (Prompt's exact demo flow)
    rec_payload = {
        "starting_city": "Chennai",
        "starting_state": "Tamil Nadu",
        "duration_days": 5,
        "budget": 25000,
        "budget_is_per_person": False,
        "traveler_type": "Couple",
        "travelers_count": 2,
        "travel_styles": ["Nature", "Adventure"],
        "interests": ["Mountains", "Food", "Photography"],
        "transportation": "Train",
        "accommodation": "3-star",
        "trip_pace": "Balanced",
        "travel_month": "Oct"
    }
    resp_rec = client.post("/api/recommendations", json=rec_payload)
    assert resp_rec.status_code == 200, f"Recommendation failed: {resp_rec.text}"
    rec_data = resp_rec.json()
    top_destinations = rec_data["destinations"]
    assert len(top_destinations) >= 5, f"Expected top 5 destinations, got {len(top_destinations)}"
    
    top_names = [d["name"] for d in top_destinations]
    print(f"✅ 5. Top recommendations generated: {top_names}")
    for d in top_destinations:
        print(f"   - {d['name']}: {d['match_score']}% Match | {d['why_recommended']}")
        assert d["match_score"] > 50
        assert len(d["match_reasons"]) > 0
        assert d["why_recommended"]

    # 6. Itinerary Generator Test
    itinerary_payload = {
        "destination_name": "Munnar",
        "starting_city": "Chennai",
        "duration_days": 5,
        "travelers_count": 2,
        "travel_style": "Nature",
        "interests": ["Mountains", "Food", "Photography"],
        "trip_pace": "Balanced",
        "accommodation_type": "3-star",
        "transportation": "Train",
        "budget": 25000
    }
    resp_itin = client.post("/api/itinerary/generate", json=itinerary_payload)
    assert resp_itin.status_code == 200, f"Itinerary failed: {resp_itin.text}"
    itin_data = resp_itin.json()
    assert itin_data["duration_days"] == 5
    assert len(itin_data["days"]) == 5
    day1_activities = itin_data["days"][0]["activities"]
    assert len(day1_activities) >= 4, f"Expected at least 4 activities for Balanced pace, got {len(day1_activities)}"
    print(f"✅ 6. Generated 5-day itinerary for Munnar with {len(itin_data['days'])} days and {len(day1_activities)} activities on Day 1")

    # 7. Budget Calculator Test
    budget_payload = {
        "destination_name": "Munnar",
        "starting_city": "Chennai",
        "duration_days": 5,
        "travelers_count": 2,
        "transportation": "Train",
        "accommodation": "3-star",
        "trip_pace": "Balanced"
    }
    resp_budget = client.post("/api/budget/calculate", json=budget_payload)
    assert resp_budget.status_code == 200
    budget_data = resp_budget.json()
    assert budget_data["total_budget"] > 0
    assert budget_data["per_person_budget"] == int(budget_data["total_budget"] / 2)
    print(f"✅ 7. Budget breakdown: Total ₹{budget_data['total_budget']:,} (Per person: ₹{budget_data['per_person_budget']:,})")

    # 8. Weather & Food Test
    resp_w = client.get("/api/weather/Munnar")
    assert resp_w.status_code == 200
    w_data = resp_w.json()
    assert "temperature" in w_data
    assert len(w_data["forecast"]) == 5
    print(f"✅ 8. Weather endpoint: {w_data['temperature']}°C, {w_data['condition']}")

    resp_f = client.get("/api/foods/Munnar")
    assert resp_f.status_code == 200
    f_data = resp_f.json()
    assert len(f_data) > 0
    print(f"✅ 9. Food endpoint: {len(f_data)} dishes found for Munnar")

    # 10. Auth & Saved Trips Test
    user_payload = {
        "email": "traveler.test@example.com",
        "password": "password123",
        "full_name": "Priya Patel",
        "home_city": "Bengaluru"
    }
    resp_reg = client.post("/api/auth/register", json=user_payload)
    if resp_reg.status_code == 400:  # already registered in previous test
        resp_login = client.post("/api/auth/login", json={"email": user_payload["email"], "password": user_payload["password"]})
        assert resp_login.status_code == 200
        token = resp_login.json()["access_token"]
    else:
        assert resp_reg.status_code == 201
        token = resp_reg.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    resp_me = client.get("/api/auth/me", headers=headers)
    assert resp_me.status_code == 200
    print(f"✅ 10. Auth flow verified for user {resp_me.json()['full_name']}")

    # Save trip test
    save_payload = {
        "destination_name": "Munnar",
        "destination_id": munnar_id,
        "title": "Our Magical Munnar Escape",
        "starting_city": "Chennai",
        "duration_days": 5,
        "travelers_count": 2,
        "travel_style": "Nature",
        "trip_pace": "Balanced",
        "total_budget": budget_data["total_budget"],
        "per_person_budget": budget_data["per_person_budget"],
        "status": "Planned",
        "itinerary_data": itin_data["days"],
        "budget_breakdown": budget_data,
        "weather_info": w_data,
        "notes": "Book tea factory tour early morning"
    }
    resp_save = client.post("/api/trips", json=save_payload, headers=headers)
    assert resp_save.status_code == 201
    saved_trip = resp_save.json()
    trip_id = saved_trip["id"]
    print(f"✅ 11. Saved trip created with ID {trip_id}: '{saved_trip['title']}'")

    # Retrieve saved trips
    resp_trips = client.get("/api/trips", headers=headers)
    assert resp_trips.status_code == 200
    assert len(resp_trips.json()) >= 1

    # Duplicate trip
    resp_dup = client.post(f"/api/trips/{trip_id}/duplicate", headers=headers)
    assert resp_dup.status_code == 201
    assert "Copy" in resp_dup.json()["title"]
    print("✅ 12. Trip duplication verified")

    print("\n🎉 ALL BACKEND API & INTEGRATION TESTS PASSED PERFECTLY!\n")

if __name__ == "__main__":
    run_tests()
