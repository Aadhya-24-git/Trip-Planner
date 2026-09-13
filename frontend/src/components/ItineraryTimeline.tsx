import React, { useState } from 'react';
import { ItineraryDay, ItineraryActivity } from '../types';
import { ActivityCard } from './ActivityCard';
import { Calendar, Plus, RefreshCw, ChevronDown, ChevronUp, Sparkles, MapPin } from 'lucide-react';

interface ItineraryTimelineProps {
  days: ItineraryDay[];
  onUpdateDays: (updatedDays: ItineraryDay[]) => void;
  onRegenerateDay?: (dayNumber: number) => void;
  onRegenerateAll?: () => void;
  isRegenerating?: boolean;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  days,
  onUpdateDays,
  onRegenerateDay,
  onRegenerateAll,
  isRegenerating = false,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [showAddModalForDay, setShowAddModalForDay] = useState<number | null>(null);

  // New activity form states
  const [newTime, setNewTime] = useState('11:00');
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCost, setNewCost] = useState(100);
  const [newDesc, setNewDesc] = useState('');

  const handleUpdateActivity = (dayIndex: number, updatedAct: ItineraryActivity) => {
    const updatedDays = [...days];
    const day = updatedDays[dayIndex];
    day.activities = day.activities.map((a) => (a.id === updatedAct.id ? updatedAct : a));
    onUpdateDays(updatedDays);
  };

  const handleDeleteActivity = (dayIndex: number, actId: string) => {
    const updatedDays = [...days];
    const day = updatedDays[dayIndex];
    day.activities = day.activities.filter((a) => a.id !== actId);
    onUpdateDays(updatedDays);
  };

  const handleAddActivity = (dayIndex: number) => {
    if (!newTitle.trim()) return;
    const newAct: ItineraryActivity = {
      id: `custom-act-${Date.now()}`,
      time: newTime,
      activity: newTitle,
      location: newLocation || 'Local Sight',
      estimated_cost: Number(newCost),
      duration_minutes: 60,
      description: newDesc || 'Personalized experience.',
      travel_time: '15 mins transit',
      category: 'Sightseeing',
      region_cluster: days[dayIndex].region_cluster || 'central',
    };

    const updatedDays = [...days];
    updatedDays[dayIndex].activities.push(newAct);
    // Sort activities by time
    updatedDays[dayIndex].activities.sort((a, b) => a.time.localeCompare(b.time));
    onUpdateDays(updatedDays);

    // Reset form
    setNewTitle('');
    setNewLocation('');
    setNewCost(100);
    setNewDesc('');
    setShowAddModalForDay(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Day Selector Tabs with Region Clusters */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-stone-200 overflow-x-auto">
        <div className="flex items-center gap-2">
          {days.map((day, idx) => (
            <button
              key={day.day_number}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeDayIndex === idx
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                  : 'bg-white hover:bg-stone-100 text-slate-700 border border-stone-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Day {day.day_number}</span>
            </button>
          ))}
        </div>

        {onRegenerateAll && (
          <button
            onClick={onRegenerateAll}
            disabled={isRegenerating}
            className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Entire Plan</span>
          </button>
        )}
      </div>

      {/* Active Day Card Content */}
      {days[activeDayIndex] && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft space-y-6">
          
          {/* Day Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  Day {days[activeDayIndex].day_number} Focus
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {days[activeDayIndex].region_cluster?.toUpperCase()} Cluster
                </span>
              </div>
              <h3 className="font-display font-black text-2xl text-slate-900 mt-2">
                {days[activeDayIndex].title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Theme: {days[activeDayIndex].theme}
              </p>
            </div>

            {/* Day Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModalForDay(activeDayIndex)}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-amber-200/70"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Activity
              </button>

              {onRegenerateDay && (
                <button
                  onClick={() => onRegenerateDay(days[activeDayIndex].day_number)}
                  disabled={isRegenerating}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-600 transition-colors"
                  title="Regenerate Day"
                >
                  <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Add Activity Modal/Inline Form */}
          {showAddModalForDay === activeDayIndex && (
            <div className="p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Add Custom Activity to Day {days[activeDayIndex].day_number}
                </h4>
                <button
                  onClick={() => setShowAddModalForDay(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Activity Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Traditional Kathakali Dance Show"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Est. Cost (₹)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Punarjani Traditional Village"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Notes / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 1-hour evening performance of martial arts & dance"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowAddModalForDay(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-300 font-bold text-xs text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddActivity(activeDayIndex)}
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md"
                >
                  Confirm & Add
                </button>
              </div>
            </div>
          )}

          {/* Sequential Timeline of Activities */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2.5 sm:before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-orange-400 before:to-amber-200">
            {days[activeDayIndex].activities.map((act, actIdx) => (
              <div key={act.id} className="relative">
                {/* Timeline Dot Marker */}
                <div className="absolute -left-6 sm:-left-8 top-5 w-5 h-5 rounded-full bg-white border-4 border-amber-600 shadow-md flex items-center justify-center -translate-x-1/2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                </div>

                <ActivityCard
                  activity={act}
                  onUpdate={(updated) => handleUpdateActivity(activeDayIndex, updated)}
                  onDelete={(id) => handleDeleteActivity(activeDayIndex, id)}
                />
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
