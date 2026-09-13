import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TripWizard } from '../components/TripWizard';
import { TripPreferences } from '../types';
import * as recApi from '../api/recommendations';
import * as itinApi from '../api/itinerary';
import { useToast } from '../context/ToastContext';
import { Sparkles } from 'lucide-react';

export const PlanWizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialCity = searchParams.get('from') || 'Chennai';
  const initialDest = searchParams.get('dest') || '';
  const initialDays = Number(searchParams.get('days')) || 5;
  const initialBudget = Number(searchParams.get('budget')) || 25000;
  const initialStyle = searchParams.get('style') || 'Nature';

  const handleWizardSubmit = async (preferences: TripPreferences) => {
    setIsSubmitting(true);
    try {
      if (preferences.known_destination) {
        // Direct itinerary generation
        showToast(`Generating custom itinerary for ${preferences.known_destination}...`, 'info');
        const itin = await itinApi.generateItinerary({
          destination_name: preferences.known_destination,
          starting_city: preferences.starting_city,
          duration_days: preferences.duration_days,
          travelers_count: preferences.travelers_count,
          travel_style: preferences.travel_styles[0] || 'Nature',
          interests: preferences.interests,
          trip_pace: preferences.trip_pace,
          accommodation_type: preferences.accommodation,
          transportation: preferences.transportation,
          budget: preferences.budget,
        });
        showToast(`Itinerary for ${preferences.known_destination} generated successfully!`, 'success');
        navigate('/itinerary/view', { state: { itinerary: itin, preferences } });
      } else {
        // Recommendation scoring engine
        showToast('Calculating smart recommendations based on your preferences...', 'info');
        const recs = await recApi.getRecommendations(preferences);
        showToast('Found your top 5 matched Indian destinations!', 'success');
        navigate('/recommendations', { state: { recommendations: recs, preferences } });
      }
    } catch (err: any) {
      console.error('Wizard error:', err);
      showToast(err.message || 'Something went wrong while planning your trip. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Interactive Journey Builder</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Trip Planning Wizard
        </h1>
        <p className="text-sm text-slate-500">
          Answer a few quick questions to receive a realistic, personalized Indian travel experience.
        </p>
      </div>

      <TripWizard
        initialCity={initialCity}
        initialDest={initialDest}
        initialDays={initialDays}
        initialBudget={initialBudget}
        initialStyle={initialStyle}
        onSubmit={handleWizardSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
