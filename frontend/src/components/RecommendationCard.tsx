import React from 'react';
import { RecommendedDestination } from '../types';
import { Star, CheckCircle, IndianRupee, Calendar, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface RecommendationCardProps {
  destination: RecommendedDestination;
  onSelect: (dest: RecommendedDestination) => void;
  isGenerating?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  destination,
  onSelect,
  isGenerating = false,
}) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col md:flex-row group">
      
      {/* Destination Image & Match Score Overlay */}
      <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden bg-stone-100">
        <img
          src={destination.hero_image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        {/* Big Match Score Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-md flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{destination.match_score}% Match</span>
          </div>
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 z-10 md:hidden">
          <div className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white font-bold text-xs flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {destination.average_rating.toFixed(1)}
          </div>
        </div>

        {/* Destination Info on Image for Mobile */}
        <div className="absolute bottom-4 left-4 right-4 z-10 text-white md:hidden">
          <h3 className="font-display font-bold text-2xl drop-shadow">{destination.name}</h3>
          <p className="text-xs text-stone-200">{destination.state}</p>
        </div>
      </div>

      {/* Details & Recommendation Breakdown */}
      <div className="p-6 md:p-8 md:w-7/12 flex-1 flex flex-col justify-between space-y-6">
        <div>
          {/* Header */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                {destination.state}
              </span>
              <h3 className="font-display font-black text-2xl text-slate-900">
                {destination.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-slate-800 text-xs font-bold">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{destination.average_rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">
            "{destination.tagline}"
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs">
            <div>
              <p className="text-[11px] text-slate-500 uppercase font-bold">Est. Cost</p>
              <p className="font-extrabold text-slate-900 text-sm flex items-center">
                <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                ₹{destination.estimated_cost.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase font-bold">Ideal Duration</p>
              <p className="font-bold text-slate-800 text-sm">{destination.ideal_days}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] text-slate-500 uppercase font-bold">Best Season</p>
              <p className="font-bold text-slate-800 text-sm truncate">{destination.best_season}</p>
            </div>
          </div>

          {/* Why We Recommend It */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Why we recommend it:
            </h4>
            <div className="space-y-1.5">
              {destination.match_reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 hidden sm:block">
            Score: <span className="font-bold text-slate-800">{destination.score_breakdown.total_score}/100</span>
          </div>

          <button
            onClick={() => onSelect(destination)}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/25 hover:shadow-orange-600/35 transition-all flex items-center justify-center gap-2 group-hover:gap-3"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Building Itinerary...' : 'Plan This Trip'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
