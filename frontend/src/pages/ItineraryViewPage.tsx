import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { ItineraryResponse, TripPreferences, SavedTrip, ItineraryDay } from '../types';
import { ItineraryTimeline } from '../components/ItineraryTimeline';
import { BudgetBreakdown } from '../components/BudgetBreakdown';
import { WeatherCard } from '../components/WeatherCard';
import { MapView } from '../components/MapView';
import { ShareModal } from '../components/ShareModal';
import * as tripsApi from '../api/trips';
import * as itinApi from '../api/itinerary';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles, Share2, Bookmark, BookmarkCheck, Printer,
  MapPin, Calendar, IndianRupee, Users, ArrowLeft, RefreshCw, Compass
} from 'lucide-react';

export const ItineraryViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(location.state?.itinerary || null);
  const [preferences, setPreferences] = useState<TripPreferences | null>(location.state?.preferences || null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [savedTripId, setSavedTripId] = useState<number | null>(null);

  // If page is loaded with an ID from Saved Trips
  useEffect(() => {
    const fetchSavedTrip = async () => {
      if (id && id !== 'view') {
        try {
          const trip = await tripsApi.getTripById(Number(id));
          setSavedTripId(trip.id);
          setIsSaved(true);
          setItinerary({
            destination_name: trip.destination_name,
            destination_id: trip.destination_id,
            state: 'India',
            hero_image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
            starting_city: trip.starting_city,
            duration_days: trip.duration_days,
            travelers_count: trip.travelers_count,
            trip_pace: trip.trip_pace,
            total_estimated_budget: trip.total_budget,
            per_person_budget: trip.per_person_budget,
            days: trip.itinerary_data,
            budget_breakdown: trip.budget_breakdown,
            weather_info: trip.weather_info,
          });
        } catch (err) {
          console.error('Error fetching saved trip:', err);
          showToast('Could not load saved trip.', 'error');
        }
      }
    };
    fetchSavedTrip();
  }, [id]);

  if (!itinerary) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-slate-900">No Itinerary Loaded</h2>
        <p className="text-slate-500 text-sm">Please build an itinerary using our Trip Planning Wizard.</p>
        <Link to="/plan" className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs inline-block">
          Plan My Trip
        </Link>
      </div>
    );
  }

  // Update days when user adds, edits, or deletes activities
  const handleUpdateDays = (updatedDays: ItineraryDay[]) => {
    setItinerary({
      ...itinerary,
      days: updatedDays,
    });
    showToast('Itinerary updated!', 'info');
  };

  // Save Trip to Database
  const handleSaveTrip = async () => {
    setIsSaving(true);
    try {
      const payload: Partial<SavedTrip> = {
        destination_name: itinerary.destination_name,
        destination_id: itinerary.destination_id,
        title: `Trip to ${itinerary.destination_name}`,
        starting_city: itinerary.starting_city,
        duration_days: itinerary.duration_days,
        travelers_count: itinerary.travelers_count,
        travel_style: preferences?.travel_styles[0] || 'Nature',
        trip_pace: itinerary.trip_pace,
        total_budget: itinerary.total_estimated_budget,
        per_person_budget: itinerary.per_person_budget,
        status: 'Planned',
        itinerary_data: itinerary.days,
        budget_breakdown: itinerary.budget_breakdown,
        weather_info: itinerary.weather_info,
        notes: `Customized ${itinerary.duration_days}-day trip to ${itinerary.destination_name}`,
      };

      const saved = await tripsApi.saveTrip(payload);
      setSavedTripId(saved.id);
      setIsSaved(true);
      showToast(`Trip to ${itinerary.destination_name} saved to My Trips!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error saving trip.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Regenerate Entire Itinerary
  const handleRegenerateAll = async () => {
    setIsRegenerating(true);
    try {
      showToast(`Regenerating fresh itinerary for ${itinerary.destination_name}...`, 'info');
      const fresh = await itinApi.generateItinerary({
        destination_name: itinerary.destination_name,
        starting_city: itinerary.starting_city,
        duration_days: itinerary.duration_days,
        travelers_count: itinerary.travelers_count,
        travel_style: preferences?.travel_styles[0] || 'Nature',
        interests: preferences?.interests || ['Mountains', 'Food'],
        trip_pace: itinerary.trip_pace,
        accommodation_type: preferences?.accommodation || '3-star',
        transportation: preferences?.transportation || 'Train',
        budget: itinerary.total_estimated_budget,
      });
      setItinerary(fresh);
      showToast('Itinerary regenerated with new schedule!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error regenerating plan.', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Flatten markers for MapView
  const allMarkers = itinerary.days.flatMap((day) =>
    day.activities
      .filter((a) => a.latitude && a.longitude)
      .map((a) => ({
        id: a.id,
        title: a.activity,
        latitude: a.latitude!,
        longitude: a.longitude!,
        category: a.category,
        day: day.day_number,
      }))
  );

  const defaultCenter: [number, number] =
    allMarkers.length > 0 ? [allMarkers[0].latitude, allMarkers[0].longitude] : [10.0889, 77.0595];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Destination & Key Metadata */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {itinerary.destination_name}, {itinerary.state || 'India'}
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-100 text-slate-700 text-xs font-semibold">
              {itinerary.trip_pace} Pace
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
            {itinerary.destination_name} Itinerary
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-amber-600" />
              {itinerary.duration_days} Days
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-amber-600" />
              {itinerary.travelers_count} Traveler{itinerary.travelers_count > 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-900 font-extrabold">
              <IndianRupee className="w-4 h-4 text-amber-600" />
              ₹{itinerary.total_estimated_budget.toLocaleString()} Estimated Total
            </span>
          </div>
        </div>

        {/* Action Buttons: Save, Share, Print/Export */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 font-bold text-xs text-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 font-bold text-xs text-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Export / Print</span>
          </button>

          <button
            onClick={handleSaveTrip}
            disabled={isSaving}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : isSaved ? 'Saved in My Trips' : 'Save Trip'}</span>
          </button>
        </div>

      </div>

      {/* Main Grid: Left Timeline Activities, Right Budget, Weather & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Timeline Activities Column */}
        <div className="lg:col-span-8 space-y-8">
          <ItineraryTimeline
            days={itinerary.days}
            onUpdateDays={handleUpdateDays}
            onRegenerateAll={handleRegenerateAll}
            isRegenerating={isRegenerating}
          />

          {/* Interactive Map Section */}
          <MapView
            center={defaultCenter}
            zoom={11}
            destinationName={itinerary.destination_name}
            startingCity={itinerary.starting_city}
            markers={allMarkers}
          />
        </div>

        {/* Right Sidebar: Budget Breakdown & Weather Widget */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          
          {/* Budget Breakdown */}
          {itinerary.budget_breakdown && (
            <BudgetBreakdown budget={itinerary.budget_breakdown} />
          )}

          {/* Weather Widget */}
          {itinerary.weather_info && (
            <WeatherCard weather={itinerary.weather_info} />
          )}

        </div>

      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        tripTitle={`${itinerary.destination_name} ${itinerary.duration_days}-Day Itinerary`}
        shareUrl={savedTripId ? `${window.location.origin}/my-trips/${savedTripId}` : window.location.href}
      />

    </div>
  );
};
