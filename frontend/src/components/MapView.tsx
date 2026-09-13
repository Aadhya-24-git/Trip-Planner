import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapMarker {
  id: string | number;
  title: string;
  latitude: number;
  longitude: number;
  category?: string;
  day?: number;
}

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  destinationName: string;
  startingCity?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  center,
  zoom = 11,
  markers = [],
  destinationName,
  startingCity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix standard Leaflet default icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Destroy existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      scrollWheelZoom: false,
    });

    // Add OpenStreetMap tile layer (beautiful and fast with zero API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Custom icons
    const createCustomIcon = (color: string, label: string) => {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transform: translate(-50%, -50%);">${label}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
    };

    const destIcon = L.divIcon({
      className: 'dest-pin',
      html: `<div style="background: linear-gradient(135deg, #E05A3E, #F59E0B); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; border: 3px solid white; box-shadow: 0 6px 16px rgba(224,90,62,0.4); transform: translate(-50%, -50%);">📍</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // Main destination marker
    const mainMarker = L.marker(center, { icon: destIcon }).addTo(map);
    mainMarker.bindPopup(`<b>${destinationName}</b><br/>Primary Destination Hub`).openPopup();

    const polylineCoords: [number, number][] = [center];

    // Additional attraction markers
    markers.forEach((m, idx) => {
      if (m.latitude && m.longitude) {
        const markerIcon = createCustomIcon('#059669', `${idx + 1}`);
        const marker = L.marker([m.latitude, m.longitude], { icon: markerIcon }).addTo(map);
        marker.bindPopup(`<b>${m.title}</b><br/>${m.category || 'Attraction'}`);
        polylineCoords.push([m.latitude, m.longitude]);
      }
    });

    // If multiple points exist, draw connecting route line
    if (polylineCoords.length > 1) {
      L.polyline(polylineCoords, {
        color: '#E05A3E',
        weight: 3.5,
        opacity: 0.75,
        dashArray: '6, 8',
      }).addTo(map);

      // Fit bounds nicely
      const bounds = L.latLngBounds(polylineCoords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center, zoom, markers, destinationName]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Interactive Route Map
          </span>
          <h3 className="font-display font-black text-2xl text-slate-900">
            {destinationName} Exploration Map
          </h3>
          <p className="text-xs text-slate-500">
            {startingCity ? `Travel from ${startingCity} → ` : ''}Geographically grouped sights and daily stops
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
            <span className="font-medium text-slate-700">Hub</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            <span className="font-medium text-slate-700">Daily Sight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-600 inline-block" />
            <span className="font-medium text-slate-700">Route</span>
          </div>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        💡 Pinch or drag to pan the map and inspect daily stop locations
      </p>
    </div>
  );
};
