import React from 'react';
import { FilterState, VehicleType, CarparkType } from '../types/carpark';
import { SINGAPORE_DISTRICTS } from '../data/singaporeCarparks';
import { Search, X, SlidersHorizontal, Zap, ShieldCheck } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalResultsCount: number;
  hasUserLocation: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  totalResultsCount,
  hasUserLocation,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const clearSearch = () => {
    onFilterChange({ ...filters, searchQuery: '' });
  };

  const handleVehicleTypeChange = (type: VehicleType) => {
    onFilterChange({ ...filters, vehicleType: type });
  };

  const handleTypeChange = (type: CarparkType | 'ALL') => {
    onFilterChange({ ...filters, type });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, district: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm transition-colors space-y-3">
      {/* Top Search & Primary Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by carpark name, address, code (e.g. ION, ACB)..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {filters.searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Vehicle Type Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => handleVehicleTypeChange('C')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              filters.vehicleType === 'C'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🚗 Cars
          </button>
          <button
            onClick={() => handleVehicleTypeChange('Y')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              filters.vehicleType === 'Y'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🏍️ Bikes
          </button>
          <button
            onClick={() => handleVehicleTypeChange('H')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              filters.vehicleType === 'H'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🚛 Heavy
          </button>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors shrink-0 ${
            showAdvanced || filters.onlyAvailable || filters.onlyEV || filters.onlySheltered
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Carpark Type Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none border-t border-slate-100 dark:border-slate-800 pt-2.5">
        {(['ALL', 'HDB', 'URA', 'Mall', 'Commercial'] as const).map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              filters.type === type
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {type === 'ALL' ? 'All Types' : type === 'Mall' ? 'Shopping Malls' : type}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums pl-2">
          <span>{totalResultsCount} carparks found</span>
        </div>
      </div>

      {/* Collapsible Advanced Filters Drawer */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* District Selector */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">
              Area / District
            </label>
            <select
              value={filters.district}
              onChange={handleDistrictChange}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {SINGAPORE_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="lots_desc">Available Lots (Most First)</option>
              <option value="lots_asc">Available Lots (Least First)</option>
              {hasUserLocation && <option value="distance">Distance (Nearest First)</option>}
              <option value="rate_asc">Parking Rates (Lowest First)</option>
              <option value="name">Carpark Name (A-Z)</option>
            </select>
          </div>

          {/* Checkbox Quick Toggles */}
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-5">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={filters.onlyAvailable}
                onChange={(e) => onFilterChange({ ...filters, onlyAvailable: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Available Lots &gt; 0</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={filters.onlyEV}
                onChange={(e) => onFilterChange({ ...filters, onlyEV: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>EV Charging</span>
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={filters.onlySheltered}
                onChange={(e) => onFilterChange({ ...filters, onlySheltered: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Sheltered Only</span>
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
