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
        <div className="overflow-hidden rounded-md sm:rounded-2xl aspect-video w-full relative cursor-pointer ">
          <HotelFilterBar
            content={
              <MapLeaf cordinates={cordinates} className="w-full " height="100%" width="100%" />
            }
          >
            <div className="w-full h-[400px]">
              <Suspense
                fallback={
                  <div className="h-full w-full bg-muted animate-pulse" />
                }
              >
                <MapLeaf cordinates={cordinates} height="100%" />
              </Suspense>
            </div>
          </HotelFilterBar>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapLocation;
