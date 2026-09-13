import React from 'react';
import { WeatherInfo } from '../types';
import { CloudSun, CloudRain, Droplets, Wind, Sparkles, SunMedium, Cloud } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherInfo;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('shower')) {
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    } else if (c.includes('cloud') || c.includes('mist')) {
      return <Cloud className="w-5 h-5 text-slate-500" />;
    } else {
      return <SunMedium className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Climate & Forecast
          </span>
          <h3 className="font-display font-black text-2xl text-slate-900">
            Weather in {weather.destination}
          </h3>
          <p className="text-xs text-slate-500">
            Real-time conditions & sightseeing recommendations
          </p>
        </div>

        {/* Sightseeing recommendation pill */}
        <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Best Sightseeing Day: {weather.best_sightseeing_day}</span>
        </div>
      </div>

      {/* Current Conditions Block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Main Temperature */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-600">
            <CloudSun className="w-8 h-8" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">
              {weather.temperature}°C
            </span>
            <p className="text-xs font-bold text-slate-600">
              {weather.condition}
            </p>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Humidity</p>
            <span className="text-xl font-black text-slate-900">{weather.humidity}%</span>
            <p className="text-[11px] text-slate-500">Comfortable mountain air</p>
          </div>
        </div>

        {/* Rain Probability */}
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Rain Probability</p>
            <span className="text-xl font-black text-slate-900">{weather.rain_probability}%</span>
            <p className="text-[11px] text-slate-500">Ideal for outdoor trails</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Grid */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            5-Day Trip Forecast
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {weather.forecast.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70 text-center space-y-1.5 hover:bg-stone-50 transition-colors"
              >
                <p className="text-xs font-bold text-slate-700">{item.day}</p>
                <div className="flex justify-center my-1">{getWeatherIcon(item.condition)}</div>
                <p className="text-sm font-black text-slate-900">{item.temp_high}° <span className="text-xs text-slate-400 font-normal">/ {item.temp_low}°</span></p>
                <p className="text-[10px] font-semibold text-slate-500 truncate">{item.condition}</p>
                <div className="text-[10px] font-bold text-blue-600 flex items-center justify-center gap-0.5">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{item.rain_prob}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
