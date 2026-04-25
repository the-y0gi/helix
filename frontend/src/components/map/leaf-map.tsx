// 'use client';

// import { cn } from '@/lib/utils';
// import React, { useState } from 'react';
// import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
// import L from 'leaflet';
// import 'leaflet-routing-machine';

// type Props = {
//   className?: string;
//   height?: string;
//   width?: string;
//   cordinates?: [number, number];
//   showRouting?: boolean;
// };

// const customIcon = new L.Icon({
//   iconUrl: '/map-icons/man.png',
//   iconRetinaUrl: '/map-icons/man.png',
//   iconSize: [38, 45],
//   iconAnchor: [19, 45],
//   popupAnchor: [0, -45],
// });

// const RoutingMachine = ({ userPos, destination }: { userPos: [number, number], destination: [number, number] }) => {
//   const map = useMap();
//   const routingControlRef = React.useRef<any>(null);

//   React.useEffect(() => {
//     if (!map || !userPos || !destination) return;

//     if (!routingControlRef.current) {
//       // Initialize the routing control only once
//       // @ts-ignore
//       routingControlRef.current = (L as any).Routing.control({
//         waypoints: [
//           L.latLng(userPos[0], userPos[1]),
//           L.latLng(destination[0], destination[1])
//         ],
//         lineOptions: {
//           styles: [{ color: '#3b82f6', weight: 4 }], // Blue line
//           extendToWaypoints: true,
//           missingRouteTolerance: 10
//         },
//         routeWhileDragging: false,
//         addWaypoints: false,
//         show: false, // Set to true if you want text instructions
//       }).on('routesfound', function (e: any) {
//         const routes = e.routes;
//         const summary = routes[0].summary;
//         console.log('Shortest road distance: ' + (summary.totalDistance / 1000).toFixed(2) + ' km');
//       }).addTo(map);
//     } else {
//       // If it already exists, just update the waypoints instead of recreating
//       routingControlRef.current.setWaypoints([
//         L.latLng(userPos[0], userPos[1]),
//         L.latLng(destination[0], destination[1])
//       ]);
//     }

//     return () => {
//       // Intentionally do not remove the control here to avoid Leaflet Routing Machine 
//       // async bugs during React 18 Strict Mode mount/unmount cycles.
//       // The map container destruction will naturally clean it up.
//     };
//   }, [map, userPos[0], userPos[1], destination[0], destination[1]]);

//   return null;
// };

// const MapLeaf = ({ className, width, height = '400px', cordinates, showRouting = false }: Props) => {
//   const [isDarkMode, setIsDarkMode] = React.useState(false);
//   const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

//   React.useEffect(() => {
//     if (showRouting && navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         setUserLocation([pos.coords.latitude, pos.coords.longitude]);
//       });
//     }
//   }, [showRouting]);

//   React.useEffect(() => {
//     const updateTheme = () => {
//       setIsDarkMode(document.documentElement.classList.contains("dark"));
//     };

//     updateTheme();

//     const observer = new MutationObserver(updateTheme);
//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
//   const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

//   return (
//     <div
//       className={cn('w-full relative z-0', className)}
//       style={{ height, width }}
//     >
//       <style>{`
//         .leaflet-control-zoom {
//           border: none !important;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05) !important;
//           border-radius: 12px !important;
//           overflow: hidden !important;
//           margin-top: 16px !important;
//           margin-left: 16px !important;
//           display: flex !important;
//           flex-direction: column !important;
//           backdrop-filter: blur(8px) !important;
//         }
//         .leaflet-control-zoom a {
//           background-color: rgba(255, 255, 255, 0.95) !important;
//           color: #3f3f46 !important;
//           border-bottom: 1px solid rgba(0,0,0,0.06) !important;
//           transition: all 0.2s ease !important;
//           width: 36px !important;
//           height: 36px !important;
//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           font-size: 18px !important;
//           font-weight: 500 !important;
//           text-decoration: none !important;
//         }
//         .leaflet-control-zoom a:last-child {
//           border-bottom: none !important;
//         }
//         .leaflet-control-zoom a:hover {
//           background-color: #ffffff !important;
//           color: #000000 !important;
//         }
//         .leaflet-control-zoom a:active {
//           background-color: #f4f4f5 !important;
//         }
//         .leaflet-control-zoom a.leaflet-disabled {
//           background-color: rgba(255, 255, 255, 0.7) !important;
//           color: #d4d4d8 !important;
//           cursor: not-allowed !important;
//         }

//         /* Dark Mode Overrides */
//         .dark .leaflet-control-zoom {
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1) !important;
//         }
//         .dark .leaflet-control-zoom a {
//           background-color: rgba(39, 39, 42, 0.95) !important;
//           color: #e4e4e7 !important;
//           border-bottom: 1px solid rgba(255,255,255,0.08) !important;
//         }
//         .dark .leaflet-control-zoom a:hover {
//           background-color: #3f3f46 !important;
//           color: #ffffff !important;
//         }
//         .dark .leaflet-control-zoom a:active {
//           background-color: #52525b !important;
//         }
//         .dark .leaflet-control-zoom a.leaflet-disabled {
//           background-color: rgba(24, 24, 27, 0.8) !important;
//           color: #52525b !important;
//         }
//       `}</style>
//       <MapContainer
//         center={cordinates ? [cordinates[1], cordinates[0]] : [19.0760, 72.8777]}
//         zoom={11}
//         scrollWheelZoom={true}
//         className="h-full w-full rounded-lg"
//       >
//         <TileLayer
//           key={isDarkMode ? "dark" : "light"}
//           className={isDarkMode ? "invert hue-rotate-180 brightness-95 contrast-90" : ""}
//           attribution={tileAttribution}
//           url={tileUrl}
//         />
//         {showRouting && userLocation && cordinates && (
//           <RoutingMachine
//             userPos={userLocation}
//             destination={[cordinates[1], cordinates[0]]}
//           />
//         )}
//         <Marker position={cordinates ? [cordinates[1], cordinates[0]] : [19.0760, 72.8777]} icon={customIcon} />
//       </MapContainer>
//     </div>
//   );
// };

// export default MapLeaf;
'use client';

import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

type Props = {
  className?: string;
  height?: string;
  width?: string;
  cordinates?: [number, number]; // Expected as [lng, lat] based on your usage
  showRouting?: boolean;
};

// --- Icons ---
const destinationIcon = new L.Icon({
  iconUrl: '/map-icons/map_marker2.png',
  iconRetinaUrl: '/map-icons/map_marker2.png',
  iconSize: [38, 45],
  iconAnchor: [19, 45],
  popupAnchor: [0, -45],
});

const userIcon = new L.Icon({
  iconUrl: '/map-icons/man.png',
  iconRetinaUrl: '/map-icons/man.png',
  iconSize: [38, 45],
  iconAnchor: [19, 45],
  popupAnchor: [0, -45],
});

// --- Routing Component ---
const RoutingMachine = ({ userPos, destination, onRouteFound }: { userPos: [number, number], destination: [number, number], onRouteFound?: () => void }) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);
  const onRouteFoundRef = useRef(onRouteFound);

  useEffect(() => {
    onRouteFoundRef.current = onRouteFound;
  }, [onRouteFound]);

  useEffect(() => {
    if (!map || !userPos || !destination) return;

    if (!routingControlRef.current) {
      // @ts-expect-error - L.Routing is dynamically loaded
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(userPos[0], userPos[1]),
          L.latLng(destination[0], destination[1])
        ],
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 5, opacity: 0.7 }],
          extendToWaypoints: true,
          missingRouteTolerance: 10
        },
        createMarker: () => null, // Hides default markers so your custom ones show instead
        routeWhileDragging: false,
        addWaypoints: false,
        show: false,
      }).on('routesfound', function (e: any) {
        const routes = e.routes;
        const summary = routes[0].summary;
        console.log(`Distance: ${(summary.totalDistance / 1000).toFixed(2)} km`);
        if (onRouteFoundRef.current) onRouteFoundRef.current();
      }).on('routingerror', function (e: any) {
        console.error("Routing error:", e);
        if (onRouteFoundRef.current) onRouteFoundRef.current();
      }).addTo(map);
    } else {
      routingControlRef.current.setWaypoints([
        L.latLng(userPos[0], userPos[1]),
        L.latLng(destination[0], destination[1])
      ]);
    }
  }, [map, userPos, destination]);

  return null;
};

// --- Main Map Component ---
const MapLeaf = ({ className, width, height = '400px', cordinates, showRouting = false }: Props) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  // 1. Get User Location
  useEffect(() => {
    if (showRouting && !userLocation) {
      setIsRouteLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          },
          (err) => {
            console.error("Location error:", err);
            setIsRouteLoading(false);
          },
          { enableHighAccuracy: true }
        );
      } else {
        setIsRouteLoading(false);
      }
    }
  }, [showRouting, userLocation]);

  // 2. Dark Mode Observer
  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  // Coordinate check for the destination
  const destLatLng: [number, number] = cordinates ? [cordinates[1], cordinates[0]] : [19.0760, 72.8777];

  return (
    <div className={cn('w-full relative z-0', className)} style={{ height, width }}>
      <style>{`
        .leaflet-control-zoom { border: none !important; border-radius: 12px !important; overflow: hidden !important; margin: 16px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
        .leaflet-control-zoom a { background-color: white !important; color: #3f3f46 !important; width: 36px !important; height: 36px !important; display: flex !important; align-items: center !important; justify-content: center !important; border-bottom: 1px solid #eee !important; }
        .dark .leaflet-control-zoom a { background-color: #27272a !important; color: #e4e4e7 !important; border-bottom: 1px solid #3f3f46 !important; }
      `}</style>

      {/* Loading Overlay */}
      {isRouteLoading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-zinc-900/10 backdrop-blur-[2px] rounded-lg pointer-events-none transition-all duration-300">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-md"></div>
        </div>
      )}

      <MapContainer
        center={destLatLng}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          key={isDarkMode ? "dark" : "light"}
          className={isDarkMode ? "invert hue-rotate-180 brightness-95 contrast-90" : ""}
          attribution={tileAttribution}
          url={tileUrl}
        />

        {/* Current Location Marker & Accuracy Circle */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon} />
            <Circle
              center={userLocation}
              radius={200}
              pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.1, color: 'transparent' }}
            />
          </>
        )}

        {/* Road Routing Logic */}
        {showRouting && userLocation && (
          <RoutingMachine
            userPos={userLocation}
            destination={destLatLng}
            onRouteFound={() => setIsRouteLoading(false)}
          />
        )}

        {/* Destination Marker */}
        <Marker position={destLatLng} icon={destinationIcon} />
      </MapContainer>
    </div>
  );
};

export default MapLeaf;