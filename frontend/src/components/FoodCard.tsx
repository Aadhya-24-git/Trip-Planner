import React from 'react';
import { FoodItem } from '../types';
import { MapPin, Utensils, IndianRupee } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const isVeg = food.food_type.toLowerCase().includes('veg') && !food.food_type.toLowerCase().includes('non');

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all flex flex-col justify-between space-y-3">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          {/* Veg / Non-Veg Symbol */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm ${
                isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {food.food_type}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-extrabold flex items-center">
            {food.price_range}
          </span>
        </div>

        <h4 className="font-display font-bold text-lg text-slate-900 leading-snug">
          {food.name}
        </h4>

        <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-3">
          {food.description}
        </p>
      </div>

      {food.famous_spots && (
        <div className="pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{food.famous_spots}</span>
        </div>
      )}
    </div>
  );
};
