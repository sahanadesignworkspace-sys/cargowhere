import React, { useState } from 'react';
import { Carpark } from '../types/carpark';
import { SINGAPORE_DISTRICTS } from '../data/singaporeCarparks';
import { estimateParkingCost } from '../services/dataGovSgApi';
import { Calculator, ArrowRight, CheckCircle2, Clock, DollarSign } from 'lucide-react';

interface FeeCalculatorModalProps {
  carparks: Carpark[];
  onSelectCarpark: (carpark: Carpark) => void;
}

export const FeeCalculatorModal: React.FC<FeeCalculatorModalProps> = ({
  carparks,
  onSelectCarpark,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Orchard');
  const [durationHours, setDurationHours] = useState<number>(3);
  const [dayType, setDayType] = useState<'weekday' | 'saturday' | 'sunday'>('weekday');

  // Filter carparks in chosen district
  const districtCarparks = carparks.filter((c) =>
    selectedDistrict === 'All Districts' ? true : c.district === selectedDistrict
  );

  // Compute fees and sort by lowest cost
  const calculatedList = districtCarparks.map((cp) => {
    const durationMins = durationHours * 60;
    const est = estimateParkingCost(cp, durationMins);
    return {
      carpark: cp,
      estimate: est,
    };
  }).sort((a, b) => a.estimate.cost - b.estimate.cost);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & Description */}
      <div className="text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-emerald-600" />
          <span>Singapore Parking Fee & Vacancy Comparison</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Compare total parking costs and available lots across carparks in your destination before driving out.
        </p>
      </div>

      {/* Control Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">
            Destination District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {SINGAPORE_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">
            Estimated Duration: <strong className="text-slate-900 dark:text-white tabular-nums font-bold">{durationHours} Hours</strong>
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 6, 8].map((h) => (
              <button
                key={h}
                onClick={() => setDurationHours(h)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors tabular-nums ${
                  durationHours === h
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">
            Day of Week
          </label>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setDayType('weekday')}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dayType === 'weekday'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Weekday
            </button>
            <button
              onClick={() => setDayType('saturday')}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dayType === 'saturday'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Saturday
            </button>
            <button
              onClick={() => setDayType('sunday')}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dayType === 'sunday'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Sun / PH
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Table / Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing {calculatedList.length} options in <strong className="text-slate-700 dark:text-slate-300">{selectedDistrict}</strong>
          </span>
          <span>Sorted by lowest estimated total fee</span>
        </div>

        {calculatedList.map((item, index) => {
          const cp = item.carpark;
          const isCheapest = index === 0;

          return (
            <div
              key={cp.id}
              onClick={() => onSelectCarpark(cp)}
              className={`bg-white dark:bg-slate-900 border rounded-xl p-4 transition-all hover:border-emerald-500 cursor-pointer text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isCheapest
                  ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                    {cp.name}
                  </h4>
                  {isCheapest && (
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      ★ Best Value
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                  <span>{cp.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{cp.address}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                    {cp.rates.gracePeriodMins} mins grace period
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Rate structure: {dayType === 'weekday' ? cp.rates.weekdayDay : dayType === 'saturday' ? cp.rates.saturday : cp.rates.sundayPH}
                </p>
              </div>

              {/* Price & Lots Summary */}
              <div className="flex items-center gap-6 sm:text-right shrink-0">
                <div>
                  <div className="text-xs text-slate-400">Available Lots</div>
                  <div className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                    {cp.availableLots}{' '}
                    <span className="text-xs font-normal text-slate-400">
                      / {cp.totalLots}
                    </span>
                  </div>
                </div>

                <div className="min-w-[100px]">
                  <div className="text-xs text-slate-400">Est. Total ({durationHours}h)</div>
                  <div className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${item.estimate.cost.toFixed(2)}
                  </div>
                </div>

                <button
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors"
                  title="View on Map"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
