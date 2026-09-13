import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SavedTrip } from '../types';
import * as tripsApi from '../api/trips';
import { useToast } from '../context/ToastContext';
import { ShareModal } from '../components/ShareModal';
import {
  Compass, MapPin, Calendar, IndianRupee, Users, Copy,
  Trash2, Edit3, Share2, Plus, ArrowRight, BookmarkCheck, Check
} from 'lucide-react';

export const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Rename modal / inline state
  const [editingTripId, setEditingTripId] = useState<number | null>(null);
  const [newTripTitle, setNewTripTitle] = useState('');

  // Share modal
  const [shareTrip, setShareTrip] = useState<SavedTrip | null>(null);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const data = await tripsApi.getSavedTrips();
      setTrips(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load trips.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip itinerary?')) return;
    try {
      await tripsApi.deleteTrip(id);
      setTrips(trips.filter((t) => t.id !== id));
      showToast('Trip deleted.', 'info');
    } catch (err) {
      showToast('Failed to delete trip.', 'error');
    }
  };

  const handleDuplicate = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const dup = await tripsApi.duplicateTrip(id);
      setTrips([dup, ...trips]);
      showToast('Trip duplicated successfully!', 'success');
    } catch (err) {
      showToast('Failed to duplicate trip.', 'error');
    }
  };

  const handleRenameSubmit = async (id: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle.trim()) return;
    try {
      const updated = await tripsApi.updateTrip(id, { title: newTripTitle });
      setTrips(trips.map((t) => (t.id === id ? updated : t)));
      setEditingTripId(null);
      showToast('Trip renamed successfully!', 'success');
    } catch (err) {
      showToast('Failed to rename trip.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Personal Travel Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
            My Saved Trips
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your saved itineraries, modify schedules, or duplicate plans for upcoming dates.
          </p>
        </div>

        <button
          onClick={() => navigate('/plan')}
          className="self-start sm:self-auto px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Trips Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-stone-200 animate-pulse p-6" />
          ))}
        </div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                {/* Status Badge & Actions */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider">
                    {trip.status || 'Planned'}
                  </span>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => setShareTrip(trip)}
                      title="Share trip"
                      className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-stone-100 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDuplicate(trip.id, e)}
                      title="Duplicate trip"
                      className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-stone-100 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(trip.id, e)}
                      title="Delete trip"
                      className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title (or Rename form) */}
                {editingTripId === trip.id ? (
                  <form onSubmit={(e) => handleRenameSubmit(trip.id, e)} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTripTitle}
                      onChange={(e) => setNewTripTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm font-bold border border-amber-400 rounded-xl"
                      autoFocus
                    />
                    <button type="submit" className="p-2 bg-amber-600 text-white rounded-xl">
                      <Check className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-xl text-slate-900 leading-snug">
                      {trip.title}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingTripId(trip.id);
                        setNewTripTitle(trip.title);
                      }}
                      title="Rename"
                      className="p-1 text-slate-300 hover:text-slate-600 shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Destination & Origin */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {trip.destination_name} (from {trip.starting_city})
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Duration</span>
                    <p className="font-bold text-slate-800">{trip.duration_days} Days</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Budget</span>
                    <p className="font-extrabold text-slate-900 flex items-center">
                      <IndianRupee className="w-3 h-3 text-amber-600" />
                      ₹{trip.total_budget.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* View/Edit Itinerary Button */}
              <div className="pt-2">
                <Link
                  to={`/itinerary/${trip.id}`}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>Open Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-stone-200 text-center max-w-lg mx-auto space-y-4">
          <Compass className="w-12 h-12 text-amber-600 mx-auto" />
          <h3 className="font-display font-bold text-xl text-slate-900">
            You haven't saved any trips yet
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Use our interactive Trip Planner to generate custom day-by-day itineraries and save them to your account.
          </p>
          <button
            onClick={() => navigate('/plan')}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
          >
            Start Planning
          </button>
        </div>
      )}

      {/* Share Modal Dialog */}
      {shareTrip && (
        <ShareModal
          isOpen={Boolean(shareTrip)}
          onClose={() => setShareTrip(null)}
          tripTitle={shareTrip.title}
          shareUrl={`${window.location.origin}/itinerary/${shareTrip.id}`}
        />
      )}

    </div>
  );
};
