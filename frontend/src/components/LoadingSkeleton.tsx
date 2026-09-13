import React from 'react';

export const DestinationCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-soft animate-pulse">
      <div className="h-56 bg-stone-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-stone-200 rounded-md w-3/4" />
        <div className="h-3 bg-stone-100 rounded-md w-1/2" />
        <div className="h-8 bg-stone-100 rounded-xl mt-4" />
      </div>
    </div>
  );
};

export const ItinerarySkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-stone-200 rounded-2xl w-1/3" />
      <div className="h-64 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
        <div className="h-6 bg-stone-200 rounded-md w-1/2" />
        <div className="h-4 bg-stone-100 rounded-md w-3/4" />
        <div className="h-20 bg-stone-100 rounded-2xl mt-4" />
      </div>
    </div>
  );
};
