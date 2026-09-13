export interface Attraction {
  id: number;
  name: string;
  category: string;
  region_cluster: string;
  latitude?: number;
  longitude?: number;
  duration_minutes: number;
  entry_fee: number;
  description: string;
  image_url: string;
  best_time_of_day: string;
}

export interface FoodItem {
  id: number;
  name: string;
  food_type: 'veg' | 'non-veg' | 'sweet' | 'beverage' | 'street-food' | string;
  description: string;
  image_url: string;
  famous_spots: string;
  price_range: string;
}

export interface Destination {
  id: number;
  name: string;
  state: string;
  tagline: string;
  description: string;
  hero_image: string;
  gallery: string[];
  budget_min: number;
  budget_max: number;
  ideal_days_min: number;
  ideal_days_max: number;
  best_months: string[];
  latitude: number;
  longitude: number;
  travel_styles: string[];
  interests: string[];
  average_rating: number;
  climate: string;
  highlights: string[];
  mood_tags: string[];
  airport_nearest?: string;
  railway_nearest?: string;
  travel_tips?: string[];
  attractions?: Attraction[];
  food_items?: FoodItem[];
}

export interface TripPreferences {
  starting_city: string;
  starting_state?: string;
  known_destination?: string | null;
  duration_days: number;
  budget: number;
  budget_is_per_person: boolean;
  traveler_type: string;
  travelers_count: number;
  travel_styles: string[];
  interests: string[];
  transportation: string;
  accommodation: string;
  trip_pace: string;
  travel_month?: string;
}

export interface ScoreBreakdown {
  budget_score: number;
  duration_score: number;
  interest_score: number;
  style_score: number;
  season_score: number;
  traveler_score: number;
  rating_score: number;
  total_score: number;
}

export interface RecommendedDestination {
  id: number;
  name: string;
  state: string;
  tagline: string;
  hero_image: string;
  match_score: number;
  estimated_cost: number;
  ideal_days: string;
  best_season: string;
  why_recommended: string;
  match_reasons: string[];
  score_breakdown: ScoreBreakdown;
  highlights: string[];
  average_rating: number;
  climate: string;
}

export interface RecommendationResponse {
  query_summary: Record<string, string>;
  destinations: RecommendedDestination[];
}

export interface ItineraryActivity {
  id: string;
  time: string;
  activity: string;
  location: string;
  estimated_cost: number;
  duration_minutes: number;
  description: string;
  travel_time: string;
  category: string;
  region_cluster: string;
  latitude?: number;
  longitude?: number;
}

export interface ItineraryDay {
  day_number: number;
  title: string;
  theme: string;
  region_cluster: string;
  activities: ItineraryActivity[];
}

export interface BudgetCategoryItem {
  amount: number;
  percentage: number;
  description: string;
}

export interface BudgetBreakdown {
  destination_name: string;
  duration_days: number;
  travelers_count: number;
  transportation: BudgetCategoryItem;
  accommodation: BudgetCategoryItem;
  food: BudgetCategoryItem;
  activities: BudgetCategoryItem;
  local_transport: BudgetCategoryItem;
  miscellaneous: BudgetCategoryItem;
  total_budget: number;
  per_person_budget: number;
}

export interface WeatherForecastItem {
  day: string;
  temp_high: number;
  temp_low: number;
  condition: string;
  rain_prob: number;
}

export interface WeatherInfo {
  destination: string;
  temperature: number;
  condition: string;
  humidity: number;
  rain_probability: number;
  best_sightseeing_day: string;
  forecast: WeatherForecastItem[];
}

export interface ItineraryResponse {
  destination_name: string;
  destination_id?: number;
  state: string;
  hero_image: string;
  starting_city: string;
  duration_days: number;
  travelers_count: number;
  trip_pace: string;
  total_estimated_budget: number;
  per_person_budget: number;
  days: ItineraryDay[];
  budget_breakdown: BudgetBreakdown;
  weather_info?: WeatherInfo;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  home_city?: string;
  preferences?: Record<string, any>;
  created_at?: string;
}

export interface SavedTrip {
  id: number;
  user_id?: number;
  destination_id?: number;
  destination_name: string;
  title: string;
  starting_city: string;
  duration_days: number;
  travelers_count: number;
  travel_style: string;
  trip_pace: string;
  total_budget: number;
  per_person_budget: number;
  status: string;
  itinerary_data: ItineraryDay[];
  budget_breakdown: BudgetBreakdown;
  weather_info?: WeatherInfo;
  notes?: string;
  created_at: string;
  updated_at: string;
}
