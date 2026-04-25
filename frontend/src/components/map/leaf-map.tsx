'use client';

import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


type Props = {
  className?: string;
  height?: string;
  width?: string
  cordinates?: [number, number];
};

const customIcon = new L.Icon({
  iconUrl: '/map-icons/map_marker2.png',
  iconRetinaUrl: '/map-icons/map_marker2.png',
  iconSize: [38, 45],
  iconAnchor: [19, 45],
  popupAnchor: [0, -45],
});

const MapLeaf = ({ className, width, height = '400px', cordinates }: Props) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div
      // 1. Use 'relative' and a specific z-index lower than your Navbar (e.g., 0 or 10)
      // 2. 'mt-20' provides the gap from the top of the screen/navbar
      className={cn('w-full  relative z-0', className)}
      style={{ height, width }}
    >
      <style>{`
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          margin-top: 16px !important;
          margin-left: 16px !important;
          display: flex !important;
          flex-direction: column !important;
          backdrop-filter: blur(8px) !important;
        }
        .leaflet-control-zoom a {
          background-color: rgba(255, 255, 255, 0.95) !important;
          color: #3f3f46 !important;
          border-bottom: 1px solid rgba(0,0,0,0.06) !important;
          transition: all 0.2s ease !important;
          width: 36px !important;
          height: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 18px !important;
          font-weight: 500 !important;
          text-decoration: none !important;
        }
        .leaflet-control-zoom a:last-child {
          border-bottom: none !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        .leaflet-control-zoom a:active {
          background-color: #f4f4f5 !important;
        }
        .leaflet-control-zoom a.leaflet-disabled {
          background-color: rgba(255, 255, 255, 0.7) !important;
          color: #d4d4d8 !important;
          cursor: not-allowed !important;
        }
        
        /* Dark Mode Overrides */
        .dark .leaflet-control-zoom {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1) !important;
        }
        .dark .leaflet-control-zoom a {
          background-color: rgba(39, 39, 42, 0.95) !important;
          color: #e4e4e7 !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
        }
        .dark .leaflet-control-zoom a:hover {
          background-color: #3f3f46 !important;
          color: #ffffff !important;
        }
        .dark .leaflet-control-zoom a:active {
          background-color: #52525b !important;
        }
        .dark .leaflet-control-zoom a.leaflet-disabled {
          background-color: rgba(24, 24, 27, 0.8) !important;
          color: #52525b !important;
        }
      `}</style>
      <MapContainer
        center={cordinates ? [cordinates[1], cordinates[0]] : [19.0760, 72.8777]}
        zoom={11}
        scrollWheelZoom={true}
        // REMOVE 'z-0' from here. Let Leaflet handle its internal layering.
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          key={isDarkMode ? "dark" : "light"}   // Important: force re-render when switching
          className={isDarkMode ? "invert hue-rotate-180 brightness-95 contrast-90" : ""}
          attribution={tileAttribution}
          url={tileUrl}
        />
        <Marker position={cordinates ? [cordinates[1], cordinates[0]] : [19.0760, 72.8777]} icon={customIcon} />
      </MapContainer>
    </div>
  );
};

export default MapLeaf;