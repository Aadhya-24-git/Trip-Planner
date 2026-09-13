import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { DestinationCard } from '../components/DestinationCard';
import { Destination } from '../types';
import * as destApi from '../api/destinations';
import { Sparkles, ArrowRight, Compass, ShieldCheck, MapPin, Award, Calendar, Heart } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDests = async () => {
      try {
        const data = await destApi.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDests();
  }, []);

  // Popular destinations specified in prompt: Goa, Manali, Jaipur, Munnar, Srinagar, Coorg, Shillong, Varanasi
  const popularNames = ['Munnar', 'Jaipur', 'Manali', 'North Goa', 'Srinagar', 'Coorg', 'Shillong', 'Varanasi'];
  const popularDests = destinations.filter((d) =>
    popularNames.some((name) => d.name.toLowerCase() === name.toLowerCase())
  ).slice(0, 8);

  // 8 Mood Cards from prompt
  const moodCards = [
    { mood: 'Mountain Escape', emoji: '🏔️', title: 'Mountain Escape', desc: 'Snow peaks, pine air & tranquil valley retreats' },
    { mood: 'Beach Holiday', emoji: '🏖️', title: 'Beach Holiday', desc: 'Golden sands, turquoise waters & coastal sunsets' },
    { mood: 'Heritage Trail', emoji: '🏛️', title: 'Heritage Trail', desc: 'Regal fortresses, ancient palaces & living UNESCO wonders' },
    { mood: 'Nature Retreat', emoji: '🌿', title: 'Nature Retreat', desc: 'Tea plantations, coffee hills & quiet rainforests' },
    { mood: 'Spiritual Journey', emoji: '🛕', title: 'Spiritual Journey', desc: 'Sacred river ghats, ancient temple corridors & inner peace' },
    { mood: 'Food & Culture', emoji: '🍛', title: 'Food & Culture', desc: 'Authentic regional flavors, royal feasts & street food trails' },
    { mood: 'Adventure Trip', emoji: '🏕️', title: 'Adventure Trip', desc: 'White-water rapids, desert dunes, high treks & thrills' },
    { mood: 'Romantic Getaway', emoji: '💑', title: 'Romantic Getaway', desc: 'Candlelit lake cruises, misty viewpoints & luxury villas' },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Find Trips by Mood Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Experiences</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
              Find Trips by Mood
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              How does your heart feel like travelling today? Pick a mood to begin.
            </p>
          </div>

          <Link
            to="/explore"
            className="text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group shrink-0"
          >
            <span>View all 32+ destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {moodCards.map((item) => (
            <button
              key={item.mood}
              onClick={() => navigate(`/explore?mood=${encodeURIComponent(item.mood)}`)}
              className="group p-5 rounded-3xl bg-white border border-stone-200/90 shadow-soft hover:shadow-hover hover:border-amber-400 hover:-translate-y-1.5 transition-all duration-300 text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100/70 text-2xl flex items-center justify-center mb-3 transition-colors">
                  {item.emoji}
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-snug mt-1">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1 text-[11px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Popular Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Trending Across India</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
              Popular Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked travel jewels with rich culture, breathtaking landscapes, and verified itineraries.
            </p>
          </div>

          <Link
            to="/explore"
            className="text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group shrink-0"
          >
            <span>See all destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDests.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* 4. Why YatraPlan / Value Proposition Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              Smart Travel Intelligence
            </span>

            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              Why YatraPlan is Different
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Most travel tools give you hallucinated routes or generic AI dumps that ignore actual geography. YatraPlan uses deterministic geographical clustering and real budget logic:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-200 pt-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>No Zig-Zag Travel:</strong> Sights grouped into north/south/central daily clusters to save fatigue.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <span><strong>Transparent Scoring:</strong> Clear reasons explaining why each destination matches your vibe.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
                <span><strong>Realistic Pace:</strong> Relaxed, Balanced, or Packed itineraries suited to human stamina.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Heart className="w-5 h-5 text-rose-400 shrink-0" />
                <span><strong>Local Culinary Discovery:</strong> Must-try regional foods, veg/non-veg tags, and street food hubs.</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/plan')}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-extrabold text-sm shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                Start Planning Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
