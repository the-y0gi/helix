'use client'; // ← important if you're using Next.js App Router!

import { cn } from '@/lib/utils';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // ← MUST import Leaflet CSS!
import L from 'leaflet';

type Props = {
  className?: string;
  height?: string; // optional: let parent control height
  cordinates?: [number, number];
};
const customIcon = new L.Icon({
  iconUrl: '/map_marker.png',               // your image path
  iconRetinaUrl: '/map_marker.png',         // same for retina (or separate @2x version)
  iconSize: [38, 45],                   // width, height in pixels
  iconAnchor: [19, 45],                 // point of the icon that corresponds to marker location (center bottom usually)
  popupAnchor: [0, -45],                // where popup appears relative to iconAnchor
//   shadowUrl: '/map_marker.png', // optional shadow (classic Leaflet shadow)
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
  className: ''                         // optional: remove if you get unwanted borders
});
const MapLeaf = ({ className, height = '400px', cordinates }: Props) => {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <MapContainer
        center={cordinates || [19.0760, 72.8777]} 
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg shadow-sm "
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={cordinates || [19.0760, 72.8777]} icon={customIcon}>
          <Popup>Mohit in Mumbai! 🌆</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapLeaf;