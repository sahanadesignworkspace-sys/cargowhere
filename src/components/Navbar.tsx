import React from 'react';
import { RefreshCw, Moon, Sun, Bookmark } from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'list' | 'calculator' | 'guide';
  setActiveTab: (tab: 'map' | 'list' | 'calculator' | 'guide') => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastUpdatedTime: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  toggleFavoritesOnly: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isRefreshing,
  onRefresh,
  lastUpdatedTime,
  isDarkMode,
  toggleDarkMode,
  favoritesCount,
  showFavoritesOnly,
  toggleFavoritesOnly,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Brand Wordmark (Single line, single element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveTab('map');
            }}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
              P
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                ParkSG
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 ml-2">
                Singapore Live Availability
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'map' && !showFavoritesOnly
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Live Map
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'list' && !showFavoritesOnly
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Carpark Directory
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'calculator'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Fee Calculator
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'guide'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Parking Guide
          </button>
          <button
            onClick={toggleFavoritesOnly}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 ${
              showFavoritesOnly
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-emerald-600 dark:fill-emerald-400' : ''}`} />
            <span>Saved ({favoritesCount})</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action + Dark Mode */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden lg:inline text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Updated {lastUpdatedTime}
          </span>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm active:scale-95 disabled:opacity-70 whitespace-nowrap"
            title="Fetch latest lots from Data.gov.sg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 px-2 py-2 bg-slate-50 dark:bg-slate-900 text-xs font-medium">
        <button
          onClick={() => setActiveTab('map')}
          className={`py-1 px-2.5 rounded-md ${
            activeTab === 'map' && !showFavoritesOnly
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Map View
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`py-1 px-2.5 rounded-md ${
            activeTab === 'list' && !showFavoritesOnly
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`py-1 px-2.5 rounded-md ${
            activeTab === 'calculator'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Calculator
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`py-1 px-2.5 rounded-md ${
            activeTab === 'guide'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Guide
        </button>
        <button
          onClick={toggleFavoritesOnly}
          className={`py-1 px-2.5 rounded-md flex items-center gap-1 ${
            showFavoritesOnly
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <Bookmark className="w-3 h-3" />
          <span>({favoritesCount})</span>
        </button>
      </div>
    </header>
  );
};
