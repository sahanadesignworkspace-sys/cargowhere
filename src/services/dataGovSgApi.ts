import { Carpark, VehicleType } from '../types/carpark';

export interface DataGovSgLotInfo {
  total_lots: string;
  lot_type: string;
  lots_available: string;
}

export interface DataGovSgCarparkData {
  carpark_info: DataGovSgLotInfo[];
  carpark_number: string;
  update_datetime: string;
}

export interface DataGovSgResponse {
  items: Array<{
    timestamp: string;
    carpark_data: DataGovSgCarparkData[];
  }>;
}

/**
 * Fetch live carpark availability from Singapore official Data.gov.sg API
 */
export async function fetchLiveSingaporeCarparkAvailability(): Promise<{
  timestamp: string;
  carparkMap: Map<string, { total: number; available: number; lots: Array<{ type: VehicleType; typeName: string; total: number; available: number }> }>;
}> {
  const url = 'https://api.data.gov.sg/v1/transport/carpark-availability';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Data.gov.sg API returned status ${response.status}`);
  }

  const json: DataGovSgResponse = await response.json();
  const latestItem = json.items?.[0];
  if (!latestItem) {
    throw new Error('No items returned from Data.gov.sg');
  }

  const map = new Map<string, { total: number; available: number; lots: Array<{ type: VehicleType; typeName: string; total: number; available: number }> }>();

  for (const item of latestItem.carpark_data) {
    let carparkTotal = 0;
    let carparkAvail = 0;
    const lots: Array<{ type: VehicleType; typeName: string; total: number; available: number }> = [];

    for (const info of item.carpark_info) {
      const tot = parseInt(info.total_lots, 10) || 0;
      const avl = parseInt(info.lots_available, 10) || 0;
      carparkTotal += tot;
      carparkAvail += avl;

      let typeName = 'Cars';
      let typeCode: VehicleType = 'C';
      if (info.lot_type === 'Y') {
        typeCode = 'Y';
        typeName = 'Motorcycles';
      } else if (info.lot_type === 'H') {
        typeCode = 'H';
        typeName = 'Heavy Vehicles';
      }

      lots.push({
        type: typeCode,
        typeName,
        total: tot,
        available: avl,
      });
    }

    map.set(item.carpark_number.toUpperCase(), {
      total: carparkTotal,
      available: carparkAvail,
      lots,
    });
  }

  return {
    timestamp: latestItem.timestamp,
    carparkMap: map,
  };
}

/**
 * Merge live Data.gov.sg availability into our rich carpark database
 */
export function mergeLiveCarparkData(
  baseCarparks: Carpark[],
  liveMap: Map<string, { total: number; available: number; lots: Array<{ type: VehicleType; typeName: string; total: number; available: number }> }>,
  timestampStr?: string
): Carpark[] {
  const formattedTime = timestampStr
    ? new Date(timestampStr).toLocaleTimeString('en-SG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : new Date().toLocaleTimeString('en-SG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

  return baseCarparks.map((cp) => {
    const live = liveMap.get(cp.id.toUpperCase());
    if (live && live.total > 0) {
      return {
        ...cp,
        totalLots: live.total,
        availableLots: Math.min(live.available, live.total),
        lastUpdated: formattedTime,
        lots: live.lots.length > 0 ? live.lots : cp.lots,
      };
    }
    // If not in live HDB feed (e.g. private malls or custom IDs), simulate natural minute-by-minute fluctuation
    const jitter = Math.floor((Math.random() - 0.48) * 4);
    const newAvail = Math.max(0, Math.min(cp.totalLots, cp.availableLots + jitter));
    return {
      ...cp,
      availableLots: newAvail,
      lastUpdated: formattedTime,
    };
  });
}

/**
 * Haversine formula to calculate distance in km between two GPS coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Generate 24-hour occupancy distribution for a carpark based on its district and type
 */
export function generateHourlyOccupancy(carpark: Carpark): Array<{ hour: number; label: string; occupancyPct: number }> {
  const isCBD = carpark.district.includes('CBD') || carpark.district.includes('Marina');
  const isMall = carpark.type === 'Mall';
  const isHDB = carpark.type === 'HDB';

  const result: Array<{ hour: number; label: string; occupancyPct: number }> = [];

  for (let h = 0; h < 24; h++) {
    const label = `${h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}`;
    let basePct = 30;

    if (isCBD) {
      if (h >= 9 && h <= 18) {
        basePct = 85 + Math.sin((h - 9) / 2) * 10; // high workday
      } else if (h >= 7 && h < 9) {
        basePct = 55;
      } else {
        basePct = 20;
      }
    } else if (isMall) {
      if (h >= 12 && h <= 14) {
        basePct = 82; // lunch peak
      } else if (h >= 18 && h <= 21) {
        basePct = 90; // dinner peak
      } else if (h >= 10 && h < 22) {
        basePct = 65;
      } else {
        basePct = 12;
      }
    } else if (isHDB) {
      // HDB residents park overnight
      if (h >= 20 || h <= 7) {
        basePct = 88; // night peak
      } else {
        basePct = 40; // daytime vacant
      }
    }

    const jitter = ((carpark.name.length * (h + 3)) % 11) - 5;
    const finalPct = Math.min(98, Math.max(8, Math.round(basePct + jitter)));

    result.push({
      hour: h,
      label,
      occupancyPct: finalPct,
    });
  }

  return result;
}

/**
 * Estimate parking cost for a duration in minutes
 */
export function estimateParkingCost(carpark: Carpark, durationMinutes: number): {
  cost: number;
  isWithinGrace: boolean;
  breakdown: string;
} {
  const grace = carpark.rates.gracePeriodMins || 10;
  if (durationMinutes <= grace) {
    return {
      cost: 0,
      isWithinGrace: true,
      breakdown: `Within ${grace} mins grace period. Free exit.`,
    };
  }

  const hours = durationMinutes / 60;
  const estimatedCost = Math.max(1.2, Math.round(hours * carpark.rates.hourlyRateEstimate * 100) / 100);

  return {
    cost: estimatedCost,
    isWithinGrace: false,
    breakdown: `Estimated at ~$${carpark.rates.hourlyRateEstimate.toFixed(2)}/hr for ${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m.`,
  };
}

/**
 * Client helper to call our serverless /api/carparkavailability endpoint
 */
export async function fetchLTADataMallCarparks(): Promise<{
  timestamp: string;
  count: number;
  value: Array<{
    CarParkID: string;
    Area: string;
    Development: string;
    Location: string;
    AvailableLots: number;
    LotType: string;
    Agency: string;
  }>;
}> {
  const response = await fetch('/api/carparkavailability?all=true');
  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.message || `LTA API error (Status ${response.status})`);
  }
  return response.json();
}
