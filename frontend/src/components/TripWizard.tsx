import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TripPreferences } from '../types';
import {
  MapPin, Compass, Calendar, IndianRupee, Users, Sparkles,
  Plane, Train, Bus, Car, Home, Zap, ArrowLeft, ArrowRight, Check
} from 'lucide-react';

interface TripWizardProps {
  initialCity?: string;
  initialDest?: string;
  initialDays?: number;
  initialBudget?: number;
  initialStyle?: string;
  onSubmit: (preferences: TripPreferences) => void;
  isSubmitting?: boolean;
}

export const TripWizard: React.FC<TripWizardProps> = ({
  initialCity = 'Chennai',
  initialDest = '',
  initialDays = 5,
  initialBudget = 25000,
  initialStyle = 'Nature',
  onSubmit,
  isSubmitting = false,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 11;

  // Wizard state
  const [startingCity, setStartingCity] = useState(initialCity);
  const [startingState, setStartingState] = useState('Tamil Nadu');
  const [knowsDestination, setKnowsDestination] = useState<boolean>(Boolean(initialDest));
  const [destinationName, setDestinationName] = useState(initialDest);
  const [days, setDays] = useState(initialDays);
  const [budget, setBudget] = useState(initialBudget);
  const [travelerType, setTravelerType] = useState('Couple');
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelStyles, setTravelStyles] = useState<string[]>([initialStyle, 'Adventure']);
  const [interests, setInterests] = useState<string[]>(['Mountains', 'Food', 'Photography']);
  const [transportation, setTransportation] = useState('Train');
  const [accommodation, setAccommodation] = useState('3-star');
  const [tripPace, setTripPace] = useState('Balanced');

  // Multi-select toggles
  const toggleStyle = (style: string) => {
    if (travelStyles.includes(style)) {
      if (travelStyles.length > 1) {
        setTravelStyles(travelStyles.filter((s) => s !== style));
      }
    } else {
      setTravelStyles([...travelStyles, style]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      if (interests.length > 1) {
        setInterests(interests.filter((i) => i !== interest));
      }
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = () => {
    const prefs: TripPreferences = {
      starting_city: startingCity,
      starting_state: startingState,
      known_destination: knowsDestination && destinationName ? destinationName : null,
      duration_days: days,
      budget: budget,
      budget_is_per_person: false,
      traveler_type: travelerType,
      travelers_count: travelersCount,
      travel_styles: travelStyles,
      interests: interests,
      transportation: transportation,
      accommodation: accommodation,
      trip_pace: tripPace,
      travel_month: 'Oct',
    };
    onSubmit(prefs);
  };

  const styleOptions = [
    { label: 'Relaxed', emoji: '🧘' },
    { label: 'Adventure', emoji: '🏕️' },
    { label: 'Nature', emoji: '🌿' },
    { label: 'Romantic', emoji: '💑' },
    { label: 'Cultural', emoji: '🏛️' },
    { label: 'Spiritual', emoji: '🛕' },
    { label: 'Food', emoji: '🍛' },
    { label: 'Luxury', emoji: '✨' },
    { label: 'Backpacking', emoji: '🎒' },
    { label: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { label: 'Photography', emoji: '📸' },
    { label: 'Budget', emoji: '💰' },
  ];

  const interestOptions = [
    { label: 'Mountains', emoji: '🏔️' },
    { label: 'Beaches', emoji: '🏖️' },
    { label: 'Temples', emoji: '🛕' },
    { label: 'Forts', emoji: '🏰' },
    { label: 'Wildlife', emoji: '🐅' },
    { label: 'Food', emoji: '🍛' },
    { label: 'Waterfalls', emoji: '🌊' },
    { label: 'Trekking', emoji: '🥾' },
    { label: 'Photography', emoji: '📷' },
    { label: 'Shopping', emoji: '🛍️' },
    { label: 'Local Culture', emoji: '🎭' },
    { label: 'Nightlife', emoji: '🎉' },
  ];

  const progressPct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-card">
      
      {/* Progress Bar & Header */}
      <div className="space-y-3 pb-8 border-b border-stone-100">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span className="text-amber-600">Step {currentStep} of {totalSteps}</span>
          <span>{progressPct}% Completed</span>
        </div>
        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Starting Location */}
      {currentStep === 1 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Origin</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Where are you travelling from?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              We calculate travel routes, tickets, and travel logistics from your starting city.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">City</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  placeholder="e.g. Chennai, Bangalore, Mumbai"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">State</label>
              <input
                type="text"
                value={startingState}
                onChange={(e) => setStartingState(e.target.value)}
                placeholder="e.g. Tamil Nadu, Karnataka"
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Quick city suggestions */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Common Origins</p>
            <div className="flex flex-wrap gap-2">
              {['Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Kolkata', 'Kochi'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setStartingCity(city)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    startingCity === city
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Destination Choice */}
      {currentStep === 2 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Destination</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Do you already know where you want to go?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Choose a specific Indian destination or let our smart engine recommend top destinations based on your preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setKnowsDestination(false)}
              className={`p-6 rounded-3xl border-2 text-left transition-all ${
                !knowsDestination
                  ? 'border-amber-600 bg-amber-50/50 shadow-md'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="text-3xl mb-3">🧭</div>
              <h3 className="font-display font-bold text-lg text-slate-900">Help Me Choose</h3>
              <p className="text-xs text-slate-500 mt-1">
                Score 32+ Indian destinations against your budget, pace, and interests with match reasons.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setKnowsDestination(true)}
              className={`p-6 rounded-3xl border-2 text-left transition-all ${
                knowsDestination
                  ? 'border-amber-600 bg-amber-50/50 shadow-md'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-display font-bold text-lg text-slate-900">I Know My Destination</h3>
              <p className="text-xs text-slate-500 mt-1">
                Plan a custom itinerary for a specific place (e.g. Munnar, Jaipur, Manali, Goa).
              </p>
            </button>
          </div>

          {knowsDestination && (
            <div className="pt-2 animate-in fade-in">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Enter Destination Name
              </label>
              <input
                type="text"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                placeholder="e.g. Munnar, Coorg, Jaipur, Manali, Alleppey"
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                autoFocus
              />
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Duration */}
      {currentStep === 3 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Duration</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              How many days are you travelling for?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select ideal length of your Indian vacation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[2, 3, 5, 7, 10, 14].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`p-5 rounded-2xl border-2 text-center transition-all ${
                  days === d
                    ? 'border-amber-600 bg-amber-50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="text-2xl font-black text-slate-900">{d}</span>
                <span className="text-xs font-bold text-slate-500 block mt-0.5">
                  {d === 2 ? 'Days (Weekend)' : d === 7 ? 'Days (1 Week)' : 'Days'}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Or Custom Days
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-32 px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-slate-900 text-center"
            />
          </div>
        </div>
      )}

      {/* STEP 4: Budget */}
      {currentStep === 4 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Budget</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              What is your approximate budget?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Total budget for all travelers including stays, transit, meals, and tickets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { val: 10000, label: '₹5k – ₹10k', desc: 'Backpacker / Budget friendly' },
              { val: 20000, label: '₹10k – ₹20k', desc: 'Comfortable budget explorer' },
              { val: 25000, label: '₹20k – ₹40k', desc: 'Standard 3-star comfort (Recommended)' },
              { val: 50000, label: '₹40k – ₹75k', desc: 'Premium 4-star experience' },
              { val: 80000, label: '₹75k+', desc: 'Luxury heritage & 5-star resorts' },
            ].map((tier) => (
              <button
                key={tier.val}
                type="button"
                onClick={() => setBudget(tier.val)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  budget === tier.val
                    ? 'border-amber-600 bg-amber-50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-display font-extrabold text-lg text-slate-900">
                  {tier.label}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{tier.desc}</p>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Or Custom Budget (₹)
            </label>
            <div className="relative max-w-xs">
              <IndianRupee className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="number"
                step={1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Travelers */}
      {currentStep === 5 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Companions</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Who is joining this journey?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Helps us tailor room sizes and activities to your travel party.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { type: 'Solo', count: 1, emoji: '🎒' },
              { type: 'Couple', count: 2, emoji: '💑' },
              { type: 'Family', count: 3, emoji: '👨‍👩‍👧' },
              { type: 'Friends', count: 4, emoji: '🍻' },
              { type: 'Group', count: 6, emoji: '🚌' },
            ].map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => {
                  setTravelerType(item.type);
                  setTravelersCount(item.count);
                }}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  travelerType === item.type
                    ? 'border-amber-600 bg-amber-50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="text-3xl block mb-2">{item.emoji}</span>
                <span className="font-display font-bold text-base text-slate-900 block">{item.type}</span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Exact Number of Travelers
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-lg"
              >
                -
              </button>
              <span className="text-xl font-black text-slate-900 w-12 text-center">
                {travelersCount}
              </span>
              <button
                type="button"
                onClick={() => setTravelersCount(travelersCount + 1)}
                className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Travel Style */}
      {currentStep === 6 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Style</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Select your travel styles
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Choose one or more vibes that reflect how you love to explore.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {styleOptions.map((opt) => {
              const selected = travelStyles.includes(opt.label);
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => toggleStyle(opt.label)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selected
                      ? 'border-amber-600 bg-amber-50 shadow-sm text-amber-950 font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 7: Interests */}
      {currentStep === 7 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Interests</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              What attractions excite you most?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Pick the experiences you want in your daily activities.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {interestOptions.map((opt) => {
              const selected = interests.includes(opt.label);
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => toggleInterest(opt.label)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selected
                      ? 'border-amber-600 bg-amber-50 shadow-sm text-amber-950 font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 8: Transportation */}
      {currentStep === 8 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Transit</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Preferred mode of transportation?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              How do you plan to travel between your origin and destination?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { mode: 'Flight', icon: Plane, desc: 'Fastest long-distance travel' },
              { mode: 'Train', icon: Train, desc: 'Scenic Indian Railways journey' },
              { mode: 'Bus', icon: Bus, desc: 'Overnight Volvo / Sleeper' },
              { mode: 'Car', icon: Car, desc: 'Road trip / Self drive' },
              { mode: 'Bike', icon: Compass, desc: 'Motorcycle adventure' },
              { mode: 'Public transport', icon: Bus, desc: 'Economical local transit' },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setTransportation(item.mode)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    transportation === item.mode
                      ? 'border-amber-600 bg-amber-50 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <IconComp className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="font-display font-bold text-base text-slate-900 block">{item.mode}</span>
                  <span className="text-[11px] text-slate-500">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 9: Accommodation */}
      {currentStep === 9 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Stay</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Where would you like to stay?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select your preferred accommodation style and comfort tier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { type: 'Hostel', desc: 'Social & backpacker friendly (₹800/night)' },
              { type: 'Budget hotel', desc: 'Clean basic private rooms (₹1,600/night)' },
              { type: 'Homestay', desc: 'Authentic local family estates (₹2,400/night)' },
              { type: '3-star', desc: 'Comfortable hotel with amenities (₹3,200/night)' },
              { type: '4-star', desc: 'Premium hotels & curated properties (₹5,500/night)' },
              { type: '5-star', desc: 'Luxury heritage palaces (₹10,500/night)' },
              { type: 'Resort', desc: 'Scenic nature retreats & spas (₹7,500/night)' },
            ].map((stay) => (
              <button
                key={stay.type}
                type="button"
                onClick={() => setAccommodation(stay.type)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  accommodation === stay.type
                    ? 'border-amber-600 bg-amber-50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="font-display font-bold text-sm text-slate-900 block">{stay.type}</span>
                <span className="text-xs text-slate-500">{stay.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 10: Trip Pace */}
      {currentStep === 10 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pace</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              What pace do you prefer?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Determines the density of activities scheduled each day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { pace: 'Relaxed', count: '3–4 activities / day', desc: 'Slow mornings, long lunches, plenty of leisure time.' },
              { pace: 'Balanced', count: '4–6 activities / day', desc: 'Optimal blend of sightseeing, culture, and rest.' },
              { pace: 'Packed', count: '6–8 activities / day', desc: 'Early mornings to late nights, see as much as possible.' },
            ].map((p) => (
              <button
                key={p.pace}
                type="button"
                onClick={() => setTripPace(p.pace)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  tripPace === p.pace
                    ? 'border-amber-600 bg-amber-50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="font-display font-extrabold text-lg text-slate-900 block">{p.pace}</span>
                <span className="text-xs font-bold text-amber-700 block mt-0.5">{p.count}</span>
                <p className="text-xs text-slate-500 mt-2">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 11: Summary & Generate */}
      {currentStep === 11 && (
        <div className="py-8 space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Ready</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Your Trip Profile Summary
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Review your customized travel preferences before generating your trip.
            </p>
          </div>

          {/* Profile Card */}
          <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-bold uppercase text-slate-400">Starting From</p>
                <p className="text-base font-extrabold text-slate-900">{startingCity}</p>
              </div>

              <div>
                <p className="font-bold uppercase text-slate-400">Destination</p>
                <p className="text-base font-extrabold text-slate-900">
                  {knowsDestination && destinationName ? destinationName : 'Smart Recommended'}
                </p>
              </div>

              <div>
                <p className="font-bold uppercase text-slate-400">Duration</p>
                <p className="text-base font-extrabold text-slate-900">{days} Days</p>
              </div>

              <div>
                <p className="font-bold uppercase text-slate-400">Estimated Budget</p>
                <p className="text-base font-extrabold text-slate-900">₹{budget.toLocaleString()}</p>
              </div>

              <div>
                <p className="font-bold uppercase text-slate-400">Travelers</p>
                <p className="text-base font-extrabold text-slate-900">
                  {travelersCount} ({travelerType})
                </p>
              </div>

              <div>
                <p className="font-bold uppercase text-slate-400">Trip Pace</p>
                <p className="text-base font-extrabold text-slate-900">{tripPace}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200">
              <p className="text-xs font-bold uppercase text-slate-400 mb-1.5">Styles & Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {travelStyles.map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold">
                    {s}
                  </span>
                ))}
                {interests.map((i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons (Back / Next / Generate) */}
      <div className="pt-6 border-t border-stone-100 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 font-bold text-xs text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-orange-600/25 transition-all flex items-center gap-2.5"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isSubmitting ? 'Generating Itinerary...' : 'Generate My Trip'}</span>
          </button>
        )}
      </div>

    </div>
  );
};
