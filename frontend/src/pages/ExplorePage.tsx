import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Destination } from '../types';
import * as destApi from '../api/destinations';
import { DestinationCard } from '../components/DestinationCard';
import { FilterPanel } from '../components/FilterPanel';
import { DestinationCardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Search, Compass, Sparkles, SlidersHorizontal, X } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedStyle, setSelectedStyle] = useState(searchParams.get('style') || '');
  const [selectedMood, setSelectedMood] = useState(searchParams.get('mood') || '');
  const [maxBudget, setMaxBudget] = useState(Number(searchParams.get('max_budget')) || 45000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch unique states once
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const s = await destApi.getStates();
        setStates(s);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, []);

  // Fetch destinations on filter change
  useEffect(() => {
    const fetchFiltered = async () => {
      setIsLoading(true);
      try {
        const params: destApi.DestinationFilterParams = {};
        if (selectedState) params.state = selectedState;
        if (searchQuery) params.search = searchQuery;
        if (selectedStyle && selectedStyle !== 'All Styles') params.style = selectedStyle;
        if (selectedMood && selectedMood !== 'All Moods') params.mood = selectedMood;
        if (maxBudget < 45000) params.max_budget = maxBudget;

        const data = await destApi.getDestinations(params);
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiltered();
  }, [selectedState, selectedStyle, selectedMood, maxBudget, searchQuery]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedStyle('');
    setSelectedMood('');
    setMaxBudget(45000);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600">
          <Compass className="w-4 h-4" />
          <span>Incredible India Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Explore Indian Destinations
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Discover hand-curated hill stations, royal palaces, tranquil backwaters, tropical coastlines, and sacred ghats across India.
        </p>
      </div>

      {/* Search Bar & Mobile Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by destination name, state, sights, or highlights (e.g. Munnar, Kerala, Tea, Forts)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-stone-200 shadow-soft text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden px-4 py-3.5 rounded-2xl bg-white border border-stone-200 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-soft"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-600" />
          <span>Filters</span>
        </button>
      </div>

      {/* Active filters pill list */}
      {(selectedState || selectedMood || selectedStyle || searchQuery || maxBudget < 45000) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400 uppercase text-[10px]">Active Filters:</span>
          {selectedState && (
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold flex items-center gap-1">
              State: {selectedState}
              <button onClick={() => setSelectedState('')} className="hover:text-rose-600">✕</button>
            </span>
          )}
          {selectedMood && (
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold flex items-center gap-1">
              Mood: {selectedMood}
              <button onClick={() => setSelectedMood('')} className="hover:text-rose-600">✕</button>
            </span>
          )}
          {selectedStyle && (
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 font-semibold flex items-center gap-1">
              Style: {selectedStyle}
              <button onClick={() => setSelectedStyle('')} className="hover:text-rose-600">✕</button>
            </span>
          )}
          {maxBudget < 45000 && (
            <span className="px-3 py-1 rounded-full bg-stone-100 text-slate-800 font-semibold flex items-center gap-1">
              Max: ₹{maxBudget.toLocaleString()}
              <button onClick={() => setMaxBudget(45000)} className="hover:text-rose-600">✕</button>
            </span>
          )}
          <button
            onClick={handleReset}
            className="text-amber-700 hover:text-amber-800 font-bold underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid with Sidebar Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterPanel
            states={states}
            selectedState={selectedState}
            onStateChange={setSelectedState}
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
            selectedMood={selectedMood}
            onMoodChange={setSelectedMood}
            maxBudget={maxBudget}
            onMaxBudgetChange={setMaxBudget}
            onReset={handleReset}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-900">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-slate-400">✕</button>
              </div>
              <FilterPanel
                states={states}
                selectedState={selectedState}
                onStateChange={(s) => { setSelectedState(s); setShowMobileFilters(false); }}
                selectedStyle={selectedStyle}
                onStyleChange={(st) => { setSelectedStyle(st); setShowMobileFilters(false); }}
                selectedMood={selectedMood}
                onMoodChange={(m) => { setSelectedMood(m); setShowMobileFilters(false); }}
                maxBudget={maxBudget}
                onMaxBudgetChange={setMaxBudget}
                onReset={handleReset}
              />
            </div>
          </div>
        )}

        {/* Destination Cards Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing <strong className="text-slate-900">{destinations.length}</strong> Indian destinations
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <DestinationCardSkeleton key={i} />
              ))}
            </div>
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No destinations match your filters"
              description="Try relaxing your filters or search terms to discover more Indian destinations."
              actionText="Reset All Filters"
              onAction={handleReset}
            />
          )}
        </div>

      </div>

    </div>
  );
};
