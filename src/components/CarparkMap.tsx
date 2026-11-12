import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Carpark, UserLocation } from '../types/carpark';
import { DISTRICT_COORDINATES } from '../data/singaporeCarparks';
import { Navigation, Locate, Layers, Zap } from 'lucide-react';

interface CarparkMapProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  userLocation: UserLocation | null;
  onLocateUser: () => void;
  isLocating: boolean;
  navigatingTo: Carpark | null;
  onStopNavigation: () => void;
  isDarkMode: boolean;
}

export const CarparkMap: React.FC<CarparkMapProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  userLocation,
  onLocateUser,
  isLocating,
  navigatingTo,
  onStopNavigation,
  isDarkMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [mapStyle, setMapStyle] = React.useState<'carto' | 'voyager' | 'osm'>('carto');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = [1.325, 103.835]; // Singapore center
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false,
    });

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when Dark Mode or Style changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap';

    if (mapStyle === 'carto') {
      tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    } else if (mapStyle === 'osm') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
    }

    // Remove existing tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrl, {
      attribution,
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
  }, [isDarkMode, mapStyle]);

  // Update Carpark Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    carparks.forEach((cp) => {
      const isSelected = selectedCarpark?.id === cp.id;
      const isNavTarget = navigatingTo?.id === cp.id;

      // Color coding logic
      let badgeBg = 'bg-emerald-600 text-white';
      let borderStyle = isSelected
        ? 'ring-4 ring-emerald-400 ring-offset-2 scale-110 z-30'
        : 'ring-1 ring-black/10';

      if (cp.availableLots === 0) {
        badgeBg = 'bg-slate-700 text-slate-300';
      } else if (cp.availableLots < 15) {
        badgeBg = 'bg-rose-600 text-white';
      } else if (cp.availableLots < 40) {
        badgeBg = 'bg-amber-600 text-white';
      }

      if (isNavTarget) {
        borderStyle = 'ring-4 ring-blue-500 ring-offset-2 animate-bounce z-40';
      }

      const iconHtml = `
        <div class="flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110 ${borderStyle} rounded-full shadow-lg ${badgeBg} px-2.5 py-1 text-xs font-bold font-mono">
          ${cp.hasEVCharging ? '<span class="mr-1 text-[10px]">⚡</span>' : ''}
          <span>${cp.availableLots}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-carpark-pin',
        html: iconHtml,
        iconSize: [46, 26],
        iconAnchor: [23, 13],
      });

      const marker = L.marker([cp.lat, cp.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectCarpark(cp);
        map.flyTo([cp.lat, cp.lng], Math.max(map.getZoom(), 14), {
          duration: 0.6,
        });
      });

      markersLayer.addLayer(marker);
    });
  }, [carparks, selectedCarpark, navigatingTo, onSelectCarpark]);

  // Handle Selected Carpark flyTo
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCarpark) return;

    map.flyTo([selectedCarpark.lat, selectedCarpark.lng], Math.max(map.getZoom(), 15), {
      duration: 0.8,
    });
  }, [selectedCarpark]);

  // Handle User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLocation) {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
      }

      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md z-10"></div>
            <div class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      userMarkerRef.current = marker;
    }
  }, [userLocation]);

  // Handle Route preview when navigatingTo is set
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (navigatingTo && userLocation) {
      // Draw simulated route polyline
      const latlngs: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        // mid point waypoint for natural curve
        [(userLocation.lat + navigatingTo.lat) / 2 + 0.003, (userLocation.lng + navigatingTo.lng) / 2],
        [navigatingTo.lat, navigatingTo.lng],
      ];

      const polyline = L.polyline(latlngs, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);

      routeLayerRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
    }
  }, [navigatingTo, userLocation]);

  const handleQuickJump = (coords: [number, number]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo(coords, 14, { duration: 0.7 });
  };

  return (
    <div className="relative w-full h-full min-h-[450px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Top District Quick-Jump Strip */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg shadow-md border border-slate-200/80 dark:border-slate-700/80 pointer-events-auto scrollbar-none max-w-full text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300 px-2 shrink-0">
            Jump to:
          </span>
          {Object.entries(DISTRICT_COORDINATES).slice(0, 6).map(([district, coords]) => (
            <button
              key={district}
              onClick={() => handleQuickJump(coords)}
              className="px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              {district}
            </button>
          ))}
        </div>

        {/* Map Style Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg shadow-md border border-slate-200/80 dark:border-slate-700/80 p-1 pointer-events-auto">
          <button
            onClick={() => setMapStyle(mapStyle === 'carto' ? 'voyager' : 'carto')}
            className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
            title="Toggle Map Style"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="capitalize">{mapStyle}</span>
          </button>
        </div>
      </div>

      {/* Map Floating Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-lg p-2.5 shadow-md border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 pointer-events-auto hidden sm:block">
        <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
          Available Lots
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>&gt; 40 lots (High)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <span>15-40 lots (Fair)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>&lt; 15 lots (Low)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span>0 lots (Full)</span>
          </div>
        </div>
      </div>

      {/* Locate Me Floating Action Button */}
      <div className="absolute bottom-16 right-3 sm:bottom-20 z-10 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={onLocateUser}
          disabled={isLocating}
          className="p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Find carparks near my location"
        >
          <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {/* Navigation Active Bar */}
      {navigatingTo && (
        <div className="absolute top-14 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-20 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between gap-4 pointer-events-auto">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Navigation className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="font-medium">
              Simulating route to <strong className="font-bold">{navigatingTo.name}</strong>
            </span>
            <span className="hidden sm:inline opacity-80 tabular-nums">
              · {navigatingTo.availableLots} lots open
            </span>
          </div>
          <button
            onClick={onStopNavigation}
            className="px-2.5 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-md font-semibold transition-colors"
          >
            End Route
          </button>
        </div>
      )}
    </div>
  );
};
