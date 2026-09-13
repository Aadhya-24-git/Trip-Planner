import React, { useState } from 'react';
import { ItineraryActivity } from '../types';
import { Clock, MapPin, IndianRupee, Navigation, Edit2, Trash2, Check, X } from 'lucide-react';

interface ActivityCardProps {
  activity: ItineraryActivity;
  onUpdate: (updated: ItineraryActivity) => void;
  onDelete: (id: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [actName, setActName] = useState(activity.activity);
  const [locName, setLocName] = useState(activity.location);
  const [cost, setCost] = useState(activity.estimated_cost);
  const [time, setTime] = useState(activity.time);
  const [desc, setDesc] = useState(activity.description);

  const handleSave = () => {
    onUpdate({
      ...activity,
      activity: actName,
      location: locName,
      estimated_cost: Number(cost),
      time: time,
      description: desc,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setActName(activity.activity);
    setLocName(activity.location);
    setCost(activity.estimated_cost);
    setTime(activity.time);
    setDesc(activity.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">Time</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-bold"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">Activity Name</label>
            <input
              type="text"
              value={actName}
              onChange={(e) => setActName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">Location</label>
            <input
              type="text"
              value={locName}
              onChange={(e) => setLocName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">Cost (₹)</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
            className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-slate-700 text-xs font-bold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-soft hover:shadow-card hover:border-amber-300 transition-all duration-200">
      
      {/* Top Row: Time, Category Pill, and Action Buttons */}
      <div className="flex items-center justify-between gap-2 pb-2.5">
        <div className="flex items-center gap-2">
          {/* Time Badge */}
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-extrabold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            {activity.time}
          </span>

          <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-slate-600 text-[11px] font-semibold">
            {activity.category || 'Sightseeing'}
          </span>

          <span className="text-[11px] text-slate-400 font-medium">
            · {activity.duration_minutes} mins
          </span>
        </div>

        {/* Quick Edit & Delete */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            title="Edit activity"
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            title="Remove activity"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Activity Title & Location */}
      <div className="space-y-1">
        <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
          {activity.activity}
        </h4>
        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="truncate">{activity.location}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-2">
        {activity.description}
      </p>

      {/* Bottom Metadata: Travel Time & Cost */}
      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <Navigation className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>{activity.travel_time}</span>
        </div>

        <div className="font-extrabold text-slate-800 flex items-center">
          {activity.estimated_cost > 0 ? (
            <>
              <IndianRupee className="w-3 h-3 text-amber-600" />
              <span>₹{activity.estimated_cost.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-emerald-600 font-bold">Free Entry</span>
          )}
        </div>
      </div>

    </div>
  );
};
