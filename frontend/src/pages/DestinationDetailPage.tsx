import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Destination, WeatherInfo } from '../types';
import * as destApi from '../api/destinations';
import * as weatherApi from '../api/weather';
import { MapView } from '../components/MapView';
import { WeatherCard } from '../components/WeatherCard';
import { FoodCard } from '../components/FoodCard';
import {
  Star, MapPin, Calendar, IndianRupee, Sparkles, Plane,
  Train, ArrowRight, Compass, ShieldCheck, Clock, Lightbulb
} from 'lucide-react';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const d = await destApi.getDestinationById(Number(id));
        setDestination(d);

        // Fetch weather
        try {
          const w = await weatherApi.getWeather(d.name);
          setWeather(w);
        } catch {
          // Weather optional
        }
      } catch (err) {
        console.error('Error fetching destination detail:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-amber-600 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-500 font-semibold mt-4">Loading destination details...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-slate-900">Destination Not Found</h2>
        <p className="text-slate-500 text-sm">We couldn't locate this destination in our catalog.</p>
        <Link to="/explore" className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs inline-block">
          Explore All Destinations
        </Link>
      </div>
    );
  }

  // Format markers for MapView
  const mapMarkers = (destination.attractions || []).map((att) => ({
    id: att.id,
    title: att.name,
    latitude: att.latitude || destination.latitude,
    longitude: att.longitude || destination.longitude,
    category: att.category,
  }));

  return (
    <div className="space-y-12 pb-24">
      
      {/* Hero Section with Large Image */}
      <div className="relative h-[420px] sm:h-[500px] w-full overflow-hidden bg-slate-900">
        <img
          src={destination.hero_image}
          alt={destination.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 font-extrabold text-xs flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {destination.state}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {destination.average_rating.toFixed(1)} / 5.0 Rating
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white drop-shadow-md">
            {destination.name}
          </h1>

          <p className="text-base sm:text-xl text-stone-200 font-normal max-w-2xl drop-shadow">
            {destination.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Quick Stats Banner & CTA */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-card flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-auto">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Budget</p>
              <div className="text-lg font-black text-slate-900 flex items-center mt-1">
                <IndianRupee className="w-4 h-4 text-amber-600" />
                <span>₹{destination.budget_min.toLocaleString()} – ₹{destination.budget_max.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ideal Duration</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {destination.ideal_days_min}–{destination.ideal_days_max} Days
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Best Season</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {destination.best_months?.slice(0, 4).join(', ') || 'Oct – Mar'}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Climate</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {destination.climate}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/plan?dest=${encodeURIComponent(destination.name)}`)}
            className="w-full lg:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-orange-600/25 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Sparkles className="w-5 h-5" />
            <span>Plan Trip to {destination.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Overview & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft space-y-4">
              <h2 className="font-display font-black text-2xl text-slate-900">
                About {destination.name}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                {destination.description}
              </p>

              {/* Highlights pills */}
              {destination.highlights && destination.highlights.length > 0 && (
                <div className="pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Key Highlights & Experiences
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((hl, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 font-semibold text-xs border border-amber-200/60 flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Top Attractions Section */}
            {destination.attractions && destination.attractions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-black text-2xl text-slate-900">
                    Top Attractions & Sights
                  </h2>
                  <span className="text-xs font-bold text-slate-500">
                    {destination.attractions.length} Attractions
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.attractions.map((att) => (
                    <div
                      key={att.id}
                      className="p-5 rounded-2xl bg-white border border-stone-200 shadow-soft hover:shadow-card transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                          {att.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                          {att.region_cluster.toUpperCase()} CLUSTER
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-lg text-slate-900 leading-snug">
                        {att.name}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {att.description}
                      </p>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          {att.duration_minutes} mins
                        </span>
                        <span className="font-extrabold text-slate-800">
                          {att.entry_fee > 0 ? `Entry: ₹${att.entry_fee}` : 'Free Entry'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local Food Specialties */}
            {destination.food_items && destination.food_items.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-display font-black text-2xl text-slate-900">
                  Must-Try Regional Food
                </h2>
                <p className="text-xs text-slate-500">
                  Authentic dishes and culinary traditions unique to {destination.name}, {destination.state}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.food_items.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Weather, Transit, Map & Travel Tips */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Weather Widget */}
            {weather && <WeatherCard weather={weather} />}

            {/* Travel Logistics / Nearest Ports */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Transportation & Access
              </h3>

              <div className="space-y-3 text-xs">
                {destination.airport_nearest && (
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                    <Plane className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Nearest Airport</span>
                      <span className="text-slate-600">{destination.airport_nearest}</span>
                    </div>
                  </div>
                )}

                {destination.railway_nearest && (
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                    <Train className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Nearest Railway</span>
                      <span className="text-slate-600">{destination.railway_nearest}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Travel Tips */}
            {destination.travel_tips && destination.travel_tips.length > 0 && (
              <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200/80 shadow-soft space-y-3">
                <div className="flex items-center gap-2 font-display font-bold text-amber-950 text-base">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span>Traveler Pro Tips</span>
                </div>
                <ul className="space-y-2 text-xs text-amber-950/80">
                  {destination.travel_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-amber-700 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* Interactive Map View */}
        <MapView
          center={[destination.latitude, destination.longitude]}
          zoom={12}
          destinationName={destination.name}
          markers={mapMarkers}
        />

      </div>

    </div>
  );
};
