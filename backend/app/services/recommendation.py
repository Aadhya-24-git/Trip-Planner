from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.destination import Destination
from app.schemas.recommendation import (
    RecommendationRequest, RecommendationResponse,
    RecommendedDestination, ScoreBreakdown
)

def calculate_budget_score(user_budget: int, min_budget: int, max_budget: int) -> float:
    # 25 points maximum
    if min_budget <= user_budget <= max_budget:
        return 25.0
    elif user_budget < min_budget:
        ratio = max(0.0, user_budget / min_budget)
        return round(25.0 * ratio, 1)
    else:
        # Budget is higher than max budget, user can afford it comfortably
        return 24.0

def calculate_duration_score(user_days: int, min_days: int, max_days: int) -> float:
    # 15 points maximum
    if min_days <= user_days <= max_days:
        return 15.0
    elif user_days < min_days:
        return round(15.0 * max(0.3, user_days / min_days), 1)
    else:
        # Extra days can easily be spent exploring or relaxing
        diff = user_days - max_days
        return max(8.0, round(15.0 - (diff * 1.5), 1))

def calculate_interest_score(user_interests: List[str], dest_interests: List[str]) -> float:
    # 25 points maximum
    if not user_interests:
        return 18.0
    user_set = {i.lower().strip() for i in user_interests}
    dest_set = {i.lower().strip() for i in dest_interests}
    common = user_set.intersection(dest_set)
    if not common:
        return 5.0
    ratio = len(common) / len(user_set)
    return min(25.0, round(25.0 * ratio + 3.0, 1))

def calculate_style_score(user_styles: List[str], dest_styles: List[str]) -> float:
    # 15 points maximum
    if not user_styles:
        return 12.0
    user_set = {s.lower().strip() for s in user_styles}
    dest_set = {s.lower().strip() for s in dest_styles}
    common = user_set.intersection(dest_set)
    if not common:
        return 4.0
    ratio = len(common) / len(user_set)
    return min(15.0, round(15.0 * ratio + 2.0, 1))

def calculate_season_score(travel_month: str, best_months: List[str]) -> float:
    # 10 points maximum
    if not travel_month or not best_months:
        return 8.0
    month_clean = travel_month.strip()[:3].capitalize()
    if any(month_clean in m for m in best_months):
        return 10.0
    return 5.0

def calculate_traveler_score(traveler_type: str, dest: Destination) -> float:
    # 5 points maximum
    traveler = traveler_type.lower()
    styles = [s.lower() for s in (dest.travel_styles or [])]
    interests = [i.lower() for i in (dest.interests or [])]
    
    if traveler == "solo" and ("backpacking" in styles or "adventure" in styles or "culture" in styles):
        return 5.0
    elif traveler == "couple" and ("romantic" in styles or "nature" in styles or "relaxed" in styles):
        return 5.0
    elif traveler == "family" and ("heritage" in styles or "relaxed" in styles or "family" in styles):
        return 5.0
    elif traveler == "friends" and ("adventure" in styles or "nightlife" in interests or "beaches" in interests):
        return 5.0
    return 4.0

def calculate_rating_score(rating: float) -> float:
    # 5 points maximum
    return round((rating / 5.0) * 5.0, 1)

def generate_recommendations(req: RecommendationRequest, db: Session) -> RecommendationResponse:
    destinations = db.query(Destination).all()
    scored_items = []

    user_total_budget = req.budget * req.travelers_count if req.budget_is_per_person else req.budget

    for dest in destinations:
        # If user explicitly specified a destination name, boost it
        if req.known_destination and req.known_destination.lower() in dest.name.lower():
            is_direct_match = True
        else:
            is_direct_match = False

        b_score = calculate_budget_score(user_total_budget, dest.budget_min, dest.budget_max)
        d_score = calculate_duration_score(req.duration_days, dest.ideal_days_min, dest.ideal_days_max)
        i_score = calculate_interest_score(req.interests, dest.interests)
        s_score = calculate_style_score(req.travel_styles, dest.travel_styles)
        season_score = calculate_season_score(req.travel_month or "Oct", dest.best_months)
        t_score = calculate_traveler_score(req.traveler_type, dest)
        r_score = calculate_rating_score(dest.average_rating)

        raw_total = b_score + d_score + i_score + s_score + season_score + t_score + r_score
        if is_direct_match:
            raw_total = 99.0

        final_score = min(98, max(45, int(round(raw_total))))

        # Generate custom human-readable reasons
        match_reasons = []
        if b_score >= 20:
            match_reasons.append(f"Fits your ₹{user_total_budget:,} budget comfortably (est. ₹{dest.budget_min:,}–₹{dest.budget_max:,})")
        if d_score >= 12:
            match_reasons.append(f"Ideal for a {req.duration_days}-day itinerary ({dest.ideal_days_min}–{dest.ideal_days_max} days recommended)")
        
        matched_interests = [i for i in req.interests if any(i.lower() in di.lower() for di in dest.interests)]
        if matched_interests:
            match_reasons.append(f"Excellent for {' & '.join(matched_interests[:2])}")
        
        matched_styles = [s for s in req.travel_styles if any(s.lower() in ds.lower() for ds in dest.travel_styles)]
        if matched_styles:
            match_reasons.append(f"Matches your {', '.join(matched_styles[:2]).lower()} travel vibe")

        if req.traveler_type:
            match_reasons.append(f"Great choice for {req.traveler_type.lower()} travelers")

        if not match_reasons:
            match_reasons = ["Highly rated destination offering diverse cultural and scenic experiences"]

        why = f"{dest.name} matches your budget, {' and '.join(matched_interests[:2]) if matched_interests else 'interests'}, and {req.trip_pace.lower()} {req.duration_days}-day travel pace."

        # Estimated cost scaled to user days
        per_day_est = (dest.budget_min + dest.budget_max) / 2 / max(3, dest.ideal_days_max)
        estimated_cost = int(per_day_est * req.duration_days * max(1, req.travelers_count * 0.75))

        scored_items.append({
            "dest": dest,
            "match_score": final_score,
            "estimated_cost": estimated_cost,
            "why_recommended": why,
            "match_reasons": match_reasons,
            "score_breakdown": ScoreBreakdown(
                budget_score=b_score,
                duration_score=d_score,
                interest_score=i_score,
                style_score=s_score,
                season_score=season_score,
                traveler_score=t_score,
                rating_score=r_score,
                total_score=final_score
            )
        })

    # Sort descending by match score
    scored_items.sort(key=lambda x: x["match_score"], reverse=True)
    top_5 = scored_items[:5]

    results = []
    for item in top_5:
        d = item["dest"]
        results.append(RecommendedDestination(
            id=d.id,
            name=d.name,
            state=d.state,
            tagline=d.tagline,
            hero_image=d.hero_image,
            match_score=item["match_score"],
            estimated_cost=item["estimated_cost"],
            ideal_days=f"{d.ideal_days_min}–{d.ideal_days_max} days",
            best_season=", ".join(d.best_months[:3]) if d.best_months else "All Year",
            why_recommended=item["why_recommended"],
            match_reasons=item["match_reasons"],
            score_breakdown=item["score_breakdown"],
            highlights=d.highlights or [],
            average_rating=d.average_rating or 4.8,
            climate=d.climate or "Pleasant"
        ))

    summary = {
        "starting_city": req.starting_city,
        "duration": f"{req.duration_days} Days",
        "budget": f"₹{user_total_budget:,}",
        "travelers": f"{req.travelers_count} ({req.traveler_type})",
        "style": " + ".join(req.travel_styles),
        "interests": ", ".join(req.interests),
        "pace": req.trip_pace
    }

    return RecommendationResponse(query_summary=summary, destinations=results)
