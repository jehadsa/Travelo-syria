/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface MapProps {
  locationQuery: string;
  locationName: string;
  category: 'hotels' | 'restaurants' | 'general';
}

export const MapContainer: React.FC<MapProps> = ({ locationQuery, locationName, category }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);

  // Approximate Syrian coordinates based on destination queries
  const getCoordinates = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('cham') || q.includes('شام') || q.includes('دمشق') || q.includes('damascus')) {
      return { lat: 33.5138, lng: 36.2765 };
    }
    if (q.includes('afamia') || q.includes('روتانا') || q.includes('لاذقية') || q.includes('lattakia')) {
      return { lat: 35.5311, lng: 35.7891 };
    }
    if (q.includes('shahba') || q.includes('شهباء') || q.includes('حلب') || q.includes('aleppo')) {
      return { lat: 36.2021, lng: 37.1343 };
    }
    if (q.includes('bloudan') || q.includes('بلودان') || q.includes('شلال')) {
      return { lat: 33.7291, lng: 36.1283 };
    }
    if (q.includes('homs') || q.includes('حمص') || q.includes('نابل')) {
      return { lat: 34.7324, lng: 36.7137 };
    }
    return { lat: 33.5138, lng: 36.2765 }; // Default to Damascus
  };

  const { lat, lng } = getCoordinates(locationQuery || locationName);
  const color = category === 'hotels' ? '#0d9488' : category === 'restaurants' ? '#f59e0b' : '#6366f1';

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    const safeRemoveMap = (mapInstance: any) => {
      if (!mapInstance) return;
      try {
        // Close open popups to prevent Leaflet from trying to position unmounted popups
        if (typeof mapInstance.closePopup === 'function') {
          mapInstance.closePopup();
        }
        // Remove individual layers gracefully
        if (typeof mapInstance.eachLayer === 'function') {
          mapInstance.eachLayer((layer: any) => {
            try {
              mapInstance.removeLayer(layer);
            } catch (e) {
              // silent catch
            }
          });
        }
        // Finally, destroy the map container
        if (typeof mapInstance.remove === 'function') {
          mapInstance.remove();
        }
      } catch (error) {
        console.warn("Safe map removal warning:", error);
      }
    };

    // Destroy existing instance to avoid duplicate map rendering containers error
    if (leafletInstance.current) {
      safeRemoveMap(leafletInstance.current);
      leafletInstance.current = null;
    }

    try {
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false
      }).setView([lat, lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Create a gorgeous custom circular divIcon marker matching our design palette
      const customIcon = L.divIcon({
        html: `
          <div style="
            background: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(18,24,41,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            animation: pulse-glog 2s infinite ease-in-out;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        className: ''
      });

      L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<strong style="font-family: inherit; font-size: 0.9rem;">${locationName}</strong>`)
        .openPopup();

      leafletInstance.current = map;

      // Handle window redraw trigger to fit containers
      setTimeout(() => {
        if (leafletInstance.current && typeof leafletInstance.current.invalidateSize === 'function') {
          try {
            leafletInstance.current.invalidateSize();
          } catch (e) {}
        }
      }, 300);

    } catch (e) {
      console.warn("Leaflet map failure:", e);
    }

    return () => {
      if (leafletInstance.current) {
        safeRemoveMap(leafletInstance.current);
        leafletInstance.current = null;
      }
    };
  }, [lat, lng, locationName, color]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${locationName} Syria`) || `${lat},${lng}`}`;

  return (
    <div className="w-full space-y-3">
      {/* Map Target Panel */}
      <div 
        ref={mapRef} 
        style={{ height: '220px' }} 
        className="w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-200/80 shadow-inner relative flex flex-col items-center justify-center text-slate-400 group"
      >
        {/* SVG Fallback Render in case Leaflet global fails to initialize */}
        {!(window as any).L && (
          <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <MapPin className="w-8 height-8" />
            </div>
            <h5 className="font-semibold text-slate-800 text-sm">{locationName}</h5>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              شمال {lat.toFixed(4)}° • شرق {lng.toFixed(4)}° (الخريطة التفاعلية متاحة في المتصفح)
            </p>
          </div>
        )}
      </div>

      {/* External Link Direct Connection */}
      <a 
        href={googleMapsUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-semibold transition-all duration-200"
      >
        <ExternalLink className="w-4 h-4" />
        <span>פתח ב-Google Maps / فتح في خرائط جوجل</span>
      </a>
    </div>
  );
};
