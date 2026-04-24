import HotelFilterBar from "@/components/filter-bar/HotelFilterBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const MapLeaf = dynamic(
  () => import("../../../../../../components/map/leaf-map"),
  { ssr: false },
);
export type LocationProps = {
  address: string;
  map: string;
  cordinates?: [number, number];
};
// import customIconUrl from '/map-marker.png'
// MapLocation.tsx

const MapLocation = ({ address, cordinates }: LocationProps) => {
  return (
    <Card className="w-full bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0">
        <h3 className="text-xl font-bold dark:text-zinc-400 text-zinc-800">Location</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{address}</p>
      </CardHeader>
      <CardContent className="p-0 -mx-2 sm:mx-0">
        {/* Ensure this container has a height! aspect-video handles this. */}
        <div className="overflow-hidden rounded-md sm:rounded-2xl aspect-video w-full relative group">
          <div className="w-full h-[400px] relative z-0">
            <Suspense
              fallback={
                <div className="h-full w-full bg-muted animate-pulse" />
              }
            >
              <MapLeaf cordinates={cordinates} height="100%" />
            </Suspense>
          </div>

          <div className="absolute top-4 right-4 ">
            <HotelFilterBar
              content={
                <MapLeaf cordinates={cordinates} className="w-full" height="100%" width="100%" />
              }
            >
              <button className="flex items-center gap-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded-full font-medium shadow-sm border border-zinc-200 dark:border-zinc-700 hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                Show map
              </button>
            </HotelFilterBar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapLocation;
