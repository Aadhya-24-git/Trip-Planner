import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SavedTrip } from '../types';
import * as tripsApi from '../api/trips';
import {
  Compass, Sparkles, MapPin, Calendar, IndianRupee,
  BookmarkCheck, Plus, ArrowRight, ShieldCheck, Heart, User as UserIcon
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripsApi.getSavedTrips();
        setTrips(data);
      } catch (err) {
        console.error('Error fetching trips in dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const totalBudgetSpent = trips.reduce((acc, t) => acc + (t.total_budget || 0), 0);
  const estimatedSavings = Math.round(totalBudgetSpent * 0.18); // Rule-based estimate of self-planned savings vs agency commission

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome & Quick Action Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Traveler Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
            Welcome back, {user?.full_name || 'Traveler'}!
          </h1>
          <p className="text-slate-300 text-sm max-w-lg">
            Ready for your next India adventure? Your personalized plans, travel stats, and saved itineraries are ready.
          </p>
        </div>

        <button
          onClick={() => navigate('/plan')}
          className="self-start md:self-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 relative z-10 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Plan a New Trip</span>
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Trips Planned</p>
          <p className="text-3xl font-black font-display text-slate-900 mt-2">{trips.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Saved in your profile</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Destinations Visited</p>
          <p className="text-3xl font-black font-display text-amber-600 mt-2">{Math.min(12, trips.length * 2 + 1)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Across India</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Money Saved</p>
          <p className="text-3xl font-black font-display text-emerald-600 mt-2">
            ₹{estimatedSavings.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Vs agent commission</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">States Explored</p>
          <p className="text-3xl font-black font-display text-blue-600 mt-2">6 / 28</p>
          <p className="text-[11px] text-slate-500 mt-1">Kerala, TN, Karnataka, Goa...</p>
        </div>
      </div>

      {/* Recent Trips & Preferences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Trips List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-display text-slate-900">
              Recent Trip Itineraries
            </h2>
            <Link to="/my-trips" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {trips.length > 0 ? (
            <div className="space-y-4">
              {trips.slice(0, 4).map((trip) => (
                <div
                  key={trip.id}
                  className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-soft hover:shadow-card hover:border-amber-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold">
                        {trip.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        From {trip.starting_city}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-slate-900">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        {trip.destination_name}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        {trip.duration_days} Days
                      </span>
                      <span>•</span>
                      <span className="font-extrabold text-slate-900 flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                        ₹{trip.total_budget.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/my-trips/${trip.id}`}
                    className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-amber-600 hover:text-white text-slate-800 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>View Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
              <Compass className="w-10 h-10 text-amber-600 mx-auto" />
              <h4 className="font-bold text-slate-900">No saved trips yet</h4>
              <p className="text-xs text-slate-500">Plan your first trip to Munnar, Goa, or Jaipur today!</p>
              <Link to="/plan" className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs inline-block">
                Start Planning
              </Link>
            </div>
          )}
        </div>

        {/* User Preferences Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-amber-600" />
                <span>Traveler Profile</span>
              </h3>
              <Link to="/profile" className="text-xs font-bold text-amber-600 hover:underline">
                Edit
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="font-bold uppercase text-slate-400">Home City</p>
                <p className="text-sm font-bold text-slate-900">{user?.home_city || 'Chennai'}</p>
              </div>

              <div>
                <p className="font-bold uppercase text-slate-400">Preferred Styles</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-semibold">
                    Nature
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-semibold">
                    Adventure
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-slate-700 text-[11px] font-semibold">
                    Heritage
                  </span>
                </div>
              </div>

              <div>
                <p className="font-bold uppercase text-slate-400">Budget Style</p>
                <p className="text-sm font-semibold text-slate-800">Moderate (3-Star & Boutique)</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
