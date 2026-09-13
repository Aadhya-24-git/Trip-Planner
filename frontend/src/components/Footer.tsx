import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, MapPin, Sparkles, Shield, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-2xl text-white">
                Yatra<span className="text-amber-500">Plan</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Smart India Trip Planner designed to craft realistic, personalized journeys across the subcontinent. From serene Kerala backwaters to snow-clad Himalayan passes.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Rule-based realistic recommendations · Zero fake itineraries</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-display">
              Explore India
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore?state=Kerala" className="hover:text-amber-400 transition-colors">
                  Kerala Escapes
                </Link>
              </li>
              <li>
                <Link to="/explore?state=Rajasthan" className="hover:text-amber-400 transition-colors">
                  Royal Rajasthan
                </Link>
              </li>
              <li>
                <Link to="/explore?state=Himachal+Pradesh" className="hover:text-amber-400 transition-colors">
                  Himachal Highlands
                </Link>
              </li>
              <li>
                <Link to="/explore?state=Karnataka" className="hover:text-amber-400 transition-colors">
                  Karnataka Heritage
                </Link>
              </li>
              <li>
                <Link to="/explore?style=Adventure" className="hover:text-amber-400 transition-colors">
                  Adventure Trips
                </Link>
              </li>
            </ul>
          </div>

          {/* Planner Moods */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-display">
              Trips by Mood
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore?mood=Mountain+Escape" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>🏔️</span> Mountain Escapes
                </Link>
              </li>
              <li>
                <Link to="/explore?mood=Beach+Holiday" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>🏖️</span> Beach Holidays
                </Link>
              </li>
              <li>
                <Link to="/explore?mood=Heritage+Trail" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>🏛️</span> Heritage Trails
                </Link>
              </li>
              <li>
                <Link to="/explore?mood=Spiritual+Journey" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>🛕</span> Spiritual Journeys
                </Link>
              </li>
              <li>
                <Link to="/explore?mood=Food+%26+Culture" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>🍛</span> Food & Culture
                </Link>
              </li>
            </ul>
          </div>

          {/* Planning Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-display">
              Trip Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/plan" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Trip Planning Wizard <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-amber-400 transition-colors">
                  Destination Directory
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-amber-400 transition-colors">
                  Travel Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="hover:text-amber-400 transition-colors">
                  Saved Trips
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} YatraPlan India. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Indian explorers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
