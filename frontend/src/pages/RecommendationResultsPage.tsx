import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { RecommendationResponse, TripPreferences, RecommendedDestination } from '../types';
import { RecommendationCard } from '../components/RecommendationCard';
import * as itinApi from '../api/itinerary';
import { useToast } from '../context/ToastContext';
import { Sparkles, ArrowLeft, RotateCcw, MapPin, IndianRupee, Calendar } from 'lucide-react';

export const RecommendationResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const recData = location.state?.recommendations as RecommendationResponse | undefined;
  const preferences = location.state?.preferences as TripPreferences | undefined;

  const [generatingDest, setGeneratingDest] = useState<string | null>(null);

  if (!recData || !preferences) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-slate-900">No Recommendations Available</h2>
        <p className="text-slate-500 text-sm">Please launch the Trip Planning Wizard to generate recommendations.</p>
        <Link to="/plan" className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs inline-block">
          Start Trip Planner
        </Link>
      </div>
    );
  }

  const handleSelectDestination = async (dest: RecommendedDestination) => {
    setGeneratingDest(dest.name);
    try {
      showToast(`Generating custom ${preferences.duration_days}-day itinerary for ${dest.name}...`, 'info');
      const itin = await itinApi.generateItinerary({
        destination_name: dest.name,
        starting_city: preferences.starting_city,
        duration_days: preferences.duration_days,
        travelers_count: preferences.travelers_count,
        travel_style: preferences.travel_styles[0] || 'Nature',
        interests: preferences.interests,
        trip_pace: preferences.trip_pace,
        accommodation_type: preferences.accommodation,
        transportation: preferences.transportation,
        budget: preferences.budget,
      });

      showToast(`Itinerary for ${dest.name} ready!`, 'success');
      navigate('/itinerary/view', {
        state: {
          itinerary: itin,
          preferences: { ...preferences, known_destination: dest.name },
        },
      });
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error generating itinerary. Please try again.', 'error');
    } finally {
      setGeneratingDest(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header & Query Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deterministic Scoring Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
            Your Perfect Destinations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Based on your budget, interests, pace, and starting location.
          </p>
        </div>

        <button
          onClick={() => navigate('/plan')}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refine Preferences</span>
        </button>
      </div>

      {/* Query Profile Summary Pill Bar */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-wrap items-center gap-4 text-xs font-semibold text-amber-950">
        <span className="font-extrabold uppercase tracking-wider text-amber-800 text-[10px]">Your Criteria:</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-amber-600" /> From {preferences.starting_city}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-amber-600" /> {preferences.duration_days} Days
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <IndianRupee className="w-3.5 h-3.5 text-amber-600" /> ₹{preferences.budget.toLocaleString()}
        </span>
        <span>•</span>
        <span>{preferences.travelers_count} Traveler{preferences.travelers_count > 1 ? 's' : ''} ({preferences.traveler_type})</span>
        <span>•</span>
        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
          {preferences.trip_pace} Pace
        </span>
      </div>

      {/* Top 5 Destination Cards */}
      <div className="space-y-6">
        {recData.destinations.map((dest) => (
          <RecommendationCard
            key={dest.id}
            destination={dest}
            onSelect={handleSelectDestination}
            isGenerating={generatingDest === dest.name}
          />
        ))}
      </div>

    </div>
  );
};
