import React from 'react';
import { BudgetBreakdown as BudgetBreakdownType } from '../types';
import { IndianRupee, Plane, Home, Utensils, Compass, Car, HelpCircle, Users } from 'lucide-react';

interface BudgetBreakdownProps {
  budget: BudgetBreakdownType;
}

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ budget }) => {
  const categories = [
    {
      key: 'transportation',
      label: 'Transportation',
      icon: Plane,
      data: budget.transportation,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      key: 'accommodation',
      label: 'Stay & Accommodation',
      icon: Home,
      data: budget.accommodation,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50'
    },
    {
      key: 'food',
      label: 'Food & Dining',
      icon: Utensils,
      data: budget.food,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50'
    },
    {
      key: 'activities',
      label: 'Activities & Sights',
      icon: Compass,
      data: budget.activities,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50'
    },
    {
      key: 'local_transport',
      label: 'Local Transit (Cabs/Autos)',
      icon: Car,
      data: budget.local_transport,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50'
    },
    {
      key: 'miscellaneous',
      label: 'Buffer & Miscellaneous',
      icon: HelpCircle,
      data: budget.miscellaneous,
      color: 'bg-slate-400',
      textColor: 'text-slate-600',
      bgLight: 'bg-slate-100'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft space-y-6">
      
      {/* Header with Totals */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Cost Projection
          </span>
          <h3 className="font-display font-black text-2xl text-slate-900">
            Estimated Trip Budget
          </h3>
          <p className="text-xs text-slate-500">
            Based on {budget.duration_days} days for {budget.travelers_count} traveler{budget.travelers_count > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70">
          <div>
            <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider">
              Total Budget
            </span>
            <div className="text-2xl font-black text-slate-900 flex items-center">
              <IndianRupee className="w-5 h-5 text-amber-600" />
              <span>{budget.total_budget.toLocaleString()}</span>
            </div>
          </div>

          <div className="h-10 w-px bg-amber-200" />

          <div>
            <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-amber-600" /> Per Person
            </span>
            <div className="text-lg font-extrabold text-amber-900 flex items-center">
              <IndianRupee className="w-4 h-4 text-amber-600" />
              <span>{budget.per_person_budget.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-segmented Visual Bar */}
      <div>
        <div className="h-4 w-full rounded-full overflow-hidden flex bg-stone-100 p-0.5 border border-stone-200">
          {categories.map((cat) => (
            <div
              key={cat.key}
              style={{ width: `${cat.data.percentage}%` }}
              className={`${cat.color} h-full first:rounded-l-full last:rounded-r-full transition-all duration-500`}
              title={`${cat.label}: ${cat.data.percentage}%`}
            />
          ))}
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <div
              key={cat.key}
              className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 hover:bg-stone-50 transition-colors flex items-start gap-3.5"
            >
              <div className={`p-2.5 rounded-xl ${cat.bgLight} ${cat.textColor} shrink-0 mt-0.5`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {cat.label}
                  </h4>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center shrink-0">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                    <span>{cat.data.amount.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  {cat.data.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full`}
                      style={{ width: `${Math.min(100, cat.data.percentage * 2)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {cat.data.percentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
