import React from 'react';
import { Filter, RotateCcw, IndianRupee, MapPin, Sparkles } from 'lucide-react';

interface FilterPanelProps {
  states: string[];
  selectedState: string;
  onStateChange: (s: string) => void;
  selectedStyle: string;
  onStyleChange: (s: string) => void;
  selectedMood: string;
  onMoodChange: (m: string) => void;
  maxBudget: number;
  onMaxBudgetChange: (b: number) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  states,
  selectedState,
  onStateChange,
  selectedStyle,
  onStyleChange,
  selectedMood,
  onMoodChange,
  maxBudget,
  onMaxBudgetChange,
  onReset,
}) => {
  const styles = [
    'All Styles',
    'Nature',
    'Adventure',
    'Relaxed',
    'Romantic',
    'Heritage',
    'Cultural',
    'Spiritual',
    'Food',
    'Backpacking'
  ];

  const moods = [
    'All Moods',
    'Mountain Escape',
    'Beach Holiday',
    'Heritage Trail',
    'Nature Retreat',
    'Spiritual Journey',
    'Food & Culture',
    'Adventure Trip',
    'Romantic Getaway'
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2 font-display font-bold text-slate-900 text-base">
          <Filter className="w-4 h-4 text-amber-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-amber-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* State Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Indian State
        </label>
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All States</option>
          {states.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Trip Mood Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Trip Mood
        </label>
        <select
          value={selectedMood}
          onChange={(e) => onMoodChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {moods.map((m) => (
            <option key={m} value={m === 'All Moods' ? '' : m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Travel Style Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Travel Style
        </label>
        <select
          value={selectedStyle}
          onChange={(e) => onStyleChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {styles.map((s) => (
            <option key={s} value={s === 'All Styles' ? '' : s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Max Budget Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          <span>Max Budget</span>
          <span className="text-amber-600 font-extrabold text-sm">
            {maxBudget >= 45000 ? 'Any Budget' : `₹${maxBudget.toLocaleString()}`}
          </span>
        </div>
        <input
          type="range"
          min={10000}
          max={45000}
          step={2500}
          value={maxBudget}
          onChange={(e) => onMaxBudgetChange(Number(e.target.value))}
          className="w-full accent-amber-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>₹10,000</span>
          <span>₹25,000</span>
          <span>₹45,000+</span>
        </div>
      </div>
    </div>
  );
};
