export type CarparkType = 'HDB' | 'URA' | 'Commercial' | 'Mall' | 'LTA';

export type VehicleType = 'C' | 'H' | 'Y'; // Car, Heavy vehicle, Motorcycle

export interface LotDetail {
  type: VehicleType;
  typeName: string;
  total: number;
  available: number;
}

export interface ParkingRate {
  weekdayDay: string; // e.g., "$1.20 per 30 mins"
  weekdayEve: string; // e.g., "$1.20 per 30 mins" or "$3.00 per entry"
  saturday: string;
  sundayPH: string;
  gracePeriodMins: number;
  hourlyRateEstimate: number; // for calculation
}

export interface Carpark {
  id: string; // Carpark code, e.g. "ACB", "BL19", "C23"
  name: string;
  address: string;
  district: string; // e.g. "Orchard", "Marina Bay", "CBD / Tanjong Pagar", "Jurong East", "Tampines", etc.
  region: 'Central' | 'East' | 'West' | 'North' | 'North-East';
  lat: number;
  lng: number;
  type: CarparkType;
  lots: LotDetail[];
  totalLots: number;
  availableLots: number;
  lastUpdated: string;
  rates: ParkingRate;
  hasEVCharging: boolean;
  evChargersCount?: number;
  isSheltered: boolean;
  maxHeightMeters?: number;
  hasCCTV: boolean;
  hasAccessibleLots: boolean;
  electronicParkingSystem: 'Full EPS' | 'Semi-EPS' | 'Coupon';
  popularityScore?: number; // 1-10
}

export interface FilterState {
  searchQuery: string;
  district: string;
  region: string;
  type: CarparkType | 'ALL';
  vehicleType: VehicleType;
  onlyAvailable: boolean;
  onlyEV: boolean;
  onlySheltered: boolean;
  sortBy: 'lots_desc' | 'lots_asc' | 'rate_asc' | 'distance' | 'name';
}

export interface UserLocation {
  lat: number;
  lng: number;
  addressName?: string;
}
