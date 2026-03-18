'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

type Props = {
  className?: string;
  height?: string;
  cordinates?: [number, number];
};

const customIcon = new L.Icon({
  iconUrl: '/map_marker.png',
  iconRetinaUrl: '/map_marker.png',
  iconSize: [38, 45],
  iconAnchor: [19, 45],
  popupAnchor: [0, -45],
});

const MapLeaf = ({ className, height = '400px', cordinates }: Props) => {
  return (
    <div 
      // 1. Use 'relative' and a specific z-index lower than your Navbar (e.g., 0 or 10)
      // 2. 'mt-20' provides the gap from the top of the screen/navbar
      className={cn('w-full md:mt-10 relative z-0', className)} 
      style={{ height }}
    >
      <MapContainer
        center={cordinates || [19.0760, 72.8777]} 
        zoom={11}
        scrollWheelZoom={true}
        // REMOVE 'z-0' from here. Let Leaflet handle its internal layering.
        className="h-full w-full rounded-lg" 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={cordinates || [19.0760, 72.8777]} icon={customIcon} />
      </MapContainer>
    </div>
  );
};

export default MapLeaf;