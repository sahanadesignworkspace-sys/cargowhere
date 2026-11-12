import React, { useState } from 'react';
import { Carpark, UserLocation } from '../types/carpark';
import { generateHourlyOccupancy, estimateParkingCost, calculateDistanceKm } from '../services/dataGovSgApi';
import {
  X,
  Navigation,
  ExternalLink,
  Bookmark,
  Zap,
  ShieldCheck,
  Clock,
  CircleAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface CarparkDetailProps {
  carpark: Carpark;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onStartNavigation: (carpark: Carpark) => void;
  isNavigating: boolean;
  userLocation: UserLocation | null;
}

export const CarparkDetail: React.FC<CarparkDetailProps> = ({
  carpark,
  onClose,
  isFavorite,
  onToggleFavorite,
  onStartNavigation,
  isNavigating,
  userLocation,
}) => {
  const [estimateMinutes, setEstimateMinutes] = useState<number>(120); // default 2 hours

  const hourlyOccupancy = generateHourlyOccupancy(carpark);
  const costEstimate = estimateParkingCost(carpark, estimateMinutes);
  const currentHour = new Date().getHours();

  let distanceKm: number | null = null;
  if (userLocation) {
    distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, carpark.lat, carpark.lng);
  }

  const occupancyRate = carpark.totalLots > 0
    ? Math.round(((carpark.totalLots - carpark.availableLots) / carpark.totalLots) * 100)
    : 0;

  let availabilityTheme = {
    text: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
    label: 'High Availability',
  };
  if (carpark.availableLots === 0) {
    availabilityTheme = {
      text: 'text-slate-400 dark:text-slate-500',
      bar: 'bg-slate-400',
      label: 'Completely Full',
    };
  } else if (carpark.availableLots < 15) {
    availabilityTheme = {
      text: 'text-rose-600 dark:text-rose-400',
      bar: 'bg-rose-500',
      label: 'Almost Full',
    };
  } else if (carpark.availableLots < 40) {
    availabilityTheme = {
      text: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-amber-500',
      label: 'Moderate Availability',
    };
  }

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${carpark.lat},${carpark.lng}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-4 sm:p-5 text-left transition-colors space-y-4">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              {carpark.id}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {carpark.type} · {carpark.district}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
            {carpark.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {carpark.address}
          </p>
          {distanceKm !== null && (
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
              📍 ~{distanceKm} km from current GPS location
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(carpark.id)}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Save Carpark"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Lots Availability Highlight Box */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Real-Time Available Lots
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-3xl font-extrabold font-mono tabular-nums ${availabilityTheme.text}`}>
                {carpark.availableLots}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                out of {carpark.totalLots} total lots
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {availabilityTheme.label}
            </span>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums mt-0.5">
              {100 - occupancyRate}% Vacancy
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full ${availabilityTheme.bar} rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(100, Math.max(4, 100 - occupancyRate))}%` }}
          />
        </div>

        {/* Breakdown by vehicle type */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
          {carpark.lots.map((lot) => (
            <div key={lot.type} className="flex flex-col">
              <span className="text-slate-500 dark:text-slate-400">{lot.typeName}</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                {lot.available} / {lot.total} open
              </span>
            </div>
          ))}
          <div className="flex flex-col">
            <span className="text-slate-500 dark:text-slate-400">Grace Period</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {carpark.rates.gracePeriodMins} mins
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Navigate & Google Maps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          onClick={() => onStartNavigation(carpark)}
          className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            isNavigating
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{isNavigating ? 'Re-center Route' : 'Simulate Route Preview'}</span>
        </button>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open in Google Maps</span>
        </a>
      </div>

      {/* Parking Rates Information */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Parking Tariff & Schedule</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
          <div>
            <span className="font-medium text-slate-800 dark:text-slate-300">Weekday Daytime:</span>{' '}
            {carpark.rates.weekdayDay}
          </div>
          <div>
            <span className="font-medium text-slate-800 dark:text-slate-300">Weekday Evening:</span>{' '}
            {carpark.rates.weekdayEve}
          </div>
          <div>
            <span className="font-medium text-slate-800 dark:text-slate-300">Saturday:</span>{' '}
            {carpark.rates.saturday}
          </div>
          <div>
            <span className="font-medium text-slate-800 dark:text-slate-300">Sunday / PH:</span>{' '}
            {carpark.rates.sundayPH}
          </div>
        </div>
      </div>

      {/* Parking Fee Calculator Slider */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Estimated Parking Cost
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm tabular-nums">
            {costEstimate.isWithinGrace ? 'FREE' : `~$${costEstimate.cost.toFixed(2)} SGD`}
          </span>
        </div>

        {/* Quick duration buttons */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {[10, 30, 60, 120, 180, 240, 480].map((mins) => (
            <button
              key={mins}
              onClick={() => setEstimateMinutes(mins)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                estimateMinutes === mins
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {mins < 60 ? `${mins}m` : `${mins / 60}h`}
            </button>
          ))}
        </div>

        {/* Slider */}
        <input
          type="range"
          min="10"
          max="600"
          step="15"
          value={estimateMinutes}
          onChange={(e) => setEstimateMinutes(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Duration: <strong className="font-semibold text-slate-700 dark:text-slate-300">{Math.floor(estimateMinutes / 60)}h {estimateMinutes % 60}m</strong>. {costEstimate.breakdown}
        </p>
      </div>

      {/* 24-Hour Occupancy Trend Graph */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Typical 24h Occupancy Pattern</span>
          </div>
          <span className="text-[10px] text-slate-400">Current hour: {currentHour}:00</span>
        </div>

        {/* Visual Bar chart */}
        <div className="h-20 flex items-end gap-1 pt-3 pb-1 px-1 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
          {hourlyOccupancy.map((item) => {
            const isNow = item.hour === currentHour;
            return (
              <div
                key={item.hour}
                className="flex-1 flex flex-col items-center h-full justify-end group relative"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                  <div className="bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded shadow-md whitespace-nowrap tabular-nums">
                    {item.label}: {item.occupancyPct}%
                  </div>
                </div>

                <div
                  className={`w-full rounded-t-xs transition-all ${
                    isNow
                      ? 'bg-blue-600 dark:bg-blue-400'
                      : item.occupancyPct > 80
                      ? 'bg-rose-400 dark:bg-rose-500'
                      : item.occupancyPct > 50
                      ? 'bg-amber-400 dark:bg-amber-500'
                      : 'bg-emerald-400 dark:bg-emerald-500'
                  }`}
                  style={{ height: `${item.occupancyPct}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 tabular-nums px-1">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </div>

      {/* Facilities & Amenities */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs space-y-2">
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          Carpark Features & Clearance
        </span>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${carpark.hasEVCharging ? 'text-amber-500' : 'text-slate-300'}`} />
            <span>EV Charging: {carpark.hasEVCharging ? `${carpark.evChargersCount || 4} Points` : 'None'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Clearance: {carpark.maxHeightMeters ? `${carpark.maxHeightMeters}m` : 'Open Air'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-mono text-[10px] font-bold">EPS</span>
            <span>System: {carpark.electronicParkingSystem}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CircleAlert className="w-3.5 h-3.5 text-emerald-500" />
            <span>Structure: {carpark.isSheltered ? 'Multi-Storey Sheltered' : 'Surface'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
