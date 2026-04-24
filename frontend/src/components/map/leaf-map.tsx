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
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          margin-top: 16px !important;
          margin-left: 16px !important;
          border-radius: 50%;
        }
        .leaflet-control-zoom a {
        
          background-color: #ffffff !important;
          color: #18181b !important;
          border-bottom: 1px solid #e4e4e7 !important;
          transition: all 0.2s ease-in-out !important;
          width: 36px !important;
          height: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          text-decoration: none !important;
        }
        .leaflet-control-zoom a:last-child {
          border-bottom: none !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #f4f4f5 !important;
        }
        .leaflet-control-zoom a.leaflet-disabled {
          background-color: #fafafa !important;
          color: #a1a1aa !important;
          cursor: not-allowed !important;
        }
        
        /* Dark Mode Overrides */
        .dark .leaflet-control-zoom a {
          background-color: #27272a !important;
          color: #fafafa !important;
          border-bottom: 1px solid #3f3f46 !important;
        }
        .dark .leaflet-control-zoom a:last-child {
          border-bottom: none !important;
        }
        .dark .leaflet-control-zoom a:hover {
          background-color: #3f3f46 !important;
        }
        .dark .leaflet-control-zoom a.leaflet-disabled {
          background-color: #18181b !important;
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