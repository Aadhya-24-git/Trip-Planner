import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, IndianRupee, Sparkles, ArrowRight } from 'lucide-react';
import { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-soft hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative h-56 sm:h-60 overflow-hidden bg-stone-100">
        <img
          src={destination.hero_image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* State Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-sm flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-600" />
            {destination.state}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {destination.average_rating.toFixed(1)}
          </span>
        </div>

        {/* Title over image */}
        <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
          <h3 className="font-display font-bold text-2xl tracking-tight leading-snug drop-shadow-sm">
            {destination.name}
          </h3>
          <p className="text-xs text-stone-200 line-clamp-1 mt-0.5">
            {destination.tagline}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs border-b border-stone-100 pb-3.5">
          <div className="flex items-center gap-1.5 text-slate-700">
            <IndianRupee className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-bold">
              ₹{destination.budget_min.toLocaleString()} – ₹{destination.budget_max.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700 justify-end">
            <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">
              {destination.ideal_days_min}–{destination.ideal_days_max} Days
            </span>
          </div>
        </div>

        {/* Best Season & Climate */}
        <div className="text-xs text-slate-600 space-y-1">
          <p>
            <strong className="text-slate-900">Best Season:</strong>{' '}
            {destination.best_months?.slice(0, 4).join(', ') || 'Oct – Mar'}
          </p>
          <p className="text-slate-500 line-clamp-2">
            {destination.climate} · {destination.description}
          </p>
        </div>

        {/* Tags / Activities */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {destination.interests?.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-slate-700 text-[11px] font-semibold"
            >
              {tag}
            </span>
          ))}
          {destination.travel_styles?.slice(0, 1).map((style, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-semibold"
            >
              {style}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          <Link
            to={`/destination/${destination.id}`}
            className="py-2.5 px-3 rounded-xl border border-stone-300 hover:border-amber-400 text-center font-bold text-xs text-slate-700 hover:text-slate-900 transition-all flex items-center justify-center gap-1"
          >
            Details
          </Link>
          <button
            onClick={() => navigate(`/plan?dest=${encodeURIComponent(destination.name)}`)}
            className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Plan Trip
          </button>
        </div>
      </div>
    </div>
  );
};
