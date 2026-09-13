import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, MapPin, BookmarkCheck, User as UserIcon, Menu, X, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900">
                Yatra<span className="text-amber-600">Plan</span>
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 -mt-1">
              Smart India Travel
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/explore"
            className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              isActive('/explore') ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Explore Destinations
          </Link>

          <Link
            to="/plan"
            className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              isActive('/plan') ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Plan Trip
          </Link>

          {user && (
            <Link
              to="/my-trips"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/my-trips') ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              My Trips
            </Link>
          )}

          {user && (
            <Link
              to="/dashboard"
              className={`text-sm font-semibold transition-colors ${
                isActive('/dashboard') ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth CTA / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  {user.full_name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-800 max-w-[120px] truncate">
                  {user.full_name}
                </span>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/plan"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-semibold shadow-md shadow-orange-600/20 hover:shadow-orange-600/30 transition-all duration-200 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Plan My Trip
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            to="/plan"
            className="px-3.5 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold shadow-sm"
          >
            Plan
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white border border-stone-200 text-slate-700 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FAF7F2] px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-4">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-700 hover:text-amber-600"
          >
            Explore Destinations
          </Link>
          <Link
            to="/plan"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-700 hover:text-amber-600"
          >
            Plan Trip Wizard
          </Link>
          {user ? (
            <>
              <Link
                to="/my-trips"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-slate-700 hover:text-amber-600"
              >
                My Saved Trips
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-slate-700 hover:text-amber-600"
              >
                User Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-slate-700 hover:text-amber-600"
              >
                Profile & Preferences
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-base font-semibold text-rose-600 pt-2 border-t border-stone-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-stone-200 flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-stone-300 font-semibold text-slate-800 text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-sm shadow-md"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
