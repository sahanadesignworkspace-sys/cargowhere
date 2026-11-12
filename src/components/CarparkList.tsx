import React from 'react';
import { Carpark, UserLocation } from '../types/carpark';
import { calculateDistanceKm } from '../services/dataGovSgApi';
import { Bookmark, MapPin, Zap, Shield, ArrowUpRight } from 'lucide-react';

interface CarparkListProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  userLocation: UserLocation | null;
  onNavigate: (carpark: Carpark) => void;
  onResetFilters: () => void;
}

export const CarparkList: React.FC<CarparkListProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  favorites,
  onToggleFavorite,
  userLocation,
  onNavigate,
  onResetFilters,
}) => {
  if (carparks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          No carparks found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          No parking locations matched your current search filters. Try broadening your criteria.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-4 px-4 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
      {carparks.map((cp) => {
        const isSelected = selectedCarpark?.id === cp.id;
        const isFav = favorites.includes(cp.id);
        const occupancyRate = cp.totalLots > 0
          ? Math.round(((cp.totalLots - cp.availableLots) / cp.totalLots) * 100)
          : 0;

        let distanceKm: number | null = null;
        if (userLocation) {
          distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, cp.lat, cp.lng);
        }

        // Status styling
        let statusTextColor = 'text-emerald-600 dark:text-emerald-400';
        let barColor = 'bg-emerald-500';
        if (cp.availableLots === 0) {
          statusTextColor = 'text-slate-400 dark:text-slate-500';
          barColor = 'bg-slate-400';
        } else if (cp.availableLots < 15) {
          statusTextColor = 'text-rose-600 dark:text-rose-400';
          barColor = 'bg-rose-500';
        } else if (cp.availableLots < 40) {
          statusTextColor = 'text-amber-600 dark:text-amber-400';
          barColor = 'bg-amber-500';
        }

        return (
          <div
            key={cp.id}
            onClick={() => onSelectCarpark(cp)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
              isSelected
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {/* Header row: Name + Favorite */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {cp.name}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                    {cp.id}
                  </span>
                </div>

                {/* Quiet unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                  <span>{cp.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{cp.district}</span>
                  {distanceKm !== null && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                        {distanceKm} km away
                      </span>
                    </>
                  )}
                  {cp.hasEVCharging && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
                        <Zap className="w-3 h-3" />
                        <span>EV ({cp.evChargersCount || 4})</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Bookmark button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(cp.id);
                }}
                className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 ${
                  isFav
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title={isFav ? 'Remove from saved' : 'Save carpark'}
              >
                <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Occupancy and Lots Row */}
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-bold font-mono tabular-nums ${statusTextColor}`}>
                    {cp.availableLots}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    / {cp.totalLots} lots free
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {occupancyRate}% occupied · {cp.rates.weekdayDay.split('(')[0].trim()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(cp);
                  }}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1 transition-colors"
                  title="Route to carpark"
                >
                  <span>Route</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Occupancy Bar */}
            <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} transition-all duration-300 rounded-full`}
                style={{ width: `${Math.min(100, Math.max(4, 100 - occupancyRate))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
