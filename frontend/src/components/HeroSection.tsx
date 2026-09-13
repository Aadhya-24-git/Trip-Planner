import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, IndianRupee, Compass, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const [fromCity, setFromCity] = useState('Chennai');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(25000);
  const [style, setStyle] = useState('Nature');

  const handleQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: fromCity,
      dest: destination,
      days: days.toString(),
      budget: budget.toString(),
      style: style,
    });
    navigate(`/plan?${params.toString()}`);
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-100/40 via-orange-50/20 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Smart Rule-Based Travel Engine
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] font-display">
              Plan Your Perfect Trip <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                Across India
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Tell us where you're starting, how much you want to spend, and what you love. We'll build the realistic day-by-day journey.
            </p>

            {/* CTAs and trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate('/plan')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-base shadow-xl shadow-orange-600/25 hover:shadow-orange-600/35 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-5 h-5" />
                Plan My Trip
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => navigate('/explore')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-stone-50 text-slate-800 font-bold text-base border border-stone-300 shadow-sm hover:border-amber-400 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5 text-amber-600" />
                Explore 30+ Destinations
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 border-t border-stone-200/80">
              <div>
                <p className="text-2xl font-black text-slate-900 font-display">32+</p>
                <p className="text-xs text-slate-500 font-medium">Curated Destinations</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 font-display">120+</p>
                <p className="text-xs text-slate-500 font-medium">Clustered Sights</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-600 font-display">100%</p>
                <p className="text-xs text-slate-500 font-medium">Realistic & Rule-Based</p>
              </div>
            </div>
          </div>

          {/* Right Quick Trip Planner Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Decorative Card Badge */}
              <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                ⚡ Instant Plan
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-stone-200/90 relative">
                <div className="flex items-center gap-3 pb-6 border-b border-stone-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      Quick Trip Builder
                    </h3>
                    <p className="text-xs text-slate-500">
                      Get matched with top India getaways in seconds
                    </p>
                  </div>
                </div>

                <form onSubmit={handleQuickPlan} className="space-y-4 pt-5">
                  {/* From City */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Travelling From
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                        placeholder="e.g. Chennai, Bangalore, Delhi"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Going To
                    </label>
                    <div className="relative">
                      <Compass className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Anywhere in India (or leave blank)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Days & Budget Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Duration
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <select
                          value={days}
                          onChange={(e) => setDays(Number(e.target.value))}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all appearance-none"
                        >
                          <option value={2}>2 Days (Weekend)</option>
                          <option value={3}>3 Days</option>
                          <option value={5}>5 Days</option>
                          <option value={7}>7 Days (1 Week)</option>
                          <option value={10}>10 Days</option>
                          <option value={14}>14 Days</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Est. Budget
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <select
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all appearance-none"
                        >
                          <option value={10000}>₹10,000</option>
                          <option value={20000}>₹20,000</option>
                          <option value={25000}>₹25,000</option>
                          <option value={35000}>₹35,000</option>
                          <option value={50000}>₹50,000</option>
                          <option value={75000}>₹75,000+</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Travel Style */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Travel Style
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    >
                      <option value="Nature">🌿 Nature & Scenic</option>
                      <option value="Adventure">🏕️ Adventure & Treks</option>
                      <option value="Relaxed">🧘 Relaxed & Peaceful</option>
                      <option value="Romantic">💑 Romantic Getaway</option>
                      <option value="Heritage">🏛️ Heritage & Culture</option>
                      <option value="Food">🍛 Food & Delicacies</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Build My Trip</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
