import React from 'react';
import { BookOpen, AlertTriangle, ShieldCheck, Zap, Info, Clock, DollarSign } from 'lucide-react';

export const ParkingGuideModal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <span>Singapore Driver Parking Guide & Rules</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Essential rules, grace periods, color lot markings, and fee structures across HDB, URA, and shopping malls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lot Markings & Demarcation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Carpark Lot Demarcation Lines</span>
          </h3>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 bg-white shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200">White Lots:</strong>{' '}
                Open for public short-term parking at all times. Hourly parking coupons, EPS, or Parking.sg app applicable.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <div className="w-3.5 h-3.5 rounded-full bg-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Red Lots:</strong>{' '}
                Strictly reserved for Season Parking Ticket (SPT) holders all day, 24/7. Non-season drivers will be penalized.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-red-500 to-white border border-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Bi-Coloured (Red & White) Lots:</strong>{' '}
                Short-term parking allowed on weekdays and Saturdays from 7:00 AM to 7:00 PM. Reserved exclusively for season parking holders from 7:00 PM to 7:00 AM and all day on Sundays/PH.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Yellow Lots:</strong>{' '}
                Located in Central Area (e.g., Tanjong Pagar, Bugis, Chinatown). Charged at a higher daytime rate of $1.20 per 30 mins.
              </div>
            </div>
          </div>
        </div>

        {/* Grace Period & Electronic Parking */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Grace Periods & EPS Electronic Parking</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="font-semibold text-emerald-800 dark:text-emerald-300">
                15-Minute Standard Grace Period
              </div>
              <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                All HDB and URA Electronic Parking System (EPS) car parks provide a 15-minute grace period. If you enter to drop off passengers or search for lots and exit within 15 minutes, no parking charge is levied.
              </p>
            </div>

            <div>
              <strong className="text-slate-800 dark:text-slate-200">Electronic Parking System (EPS):</strong>
              <p className="mt-1">
                Charges are automatically deducted from your CEPAS card (NETS FlashPay, NETS Motoring Card, EZ-Link) inserted in the In-Vehicle Unit (IU) or On-Board Unit (OBU / ERP 2.0). Ensure sufficient balance to avoid barrier delays.
              </p>
            </div>

            <div>
              <strong className="text-slate-800 dark:text-slate-200">Free Parking Scheme (FPS):</strong>
              <p className="mt-1">
                Most HDB residential carparks provide Free Parking on Sundays and Public Holidays from 7:00 AM to 10:30 PM. Look for the bright orange/yellow FPS signage at the gantry.
              </p>
            </div>
          </div>
        </div>

        {/* EV Charging in Singapore */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>EV Charging Networks & Etiquette</span>
          </h3>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <p>
              Singapore is rolling out EV charging points across nearly all HDB multi-storey car parks under the Singapore Green Plan.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li>Major operators include SP Mobility, CDG Engie, Charge+, and Shell Recharge.</li>
              <li>AC Slow Charging (7.4kW - 22kW) is standard for residential multi-storey carparks.</li>
              <li>DC Fast Charging (50kW - 120kW) is available at selected shopping malls and commercial hubs.</li>
              <li><strong>Idle Fee Warning:</strong> Move your EV within 30 minutes of completing charge to avoid idle blocking penalties.</li>
            </ul>
          </div>
        </div>

        {/* Standard HDB / URA Rates Reference */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Standard HDB & URA Rates (2026 Baseline)</span>
          </h3>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Standard Non-Central Carpark</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200 tabular-nums">$0.60 / 30 mins</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Central Area (CBD/Orchard/Chinatown)</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200 tabular-nums">$1.20 / 30 mins (7am-5pm)</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Night Parking (10:30pm - 7am)</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200 tabular-nums">Capped at $5.00 / night</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Motorcycles</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200 tabular-nums">$0.65 / day per session</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
