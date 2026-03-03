import { Card, CardContent, CardHeader } from "@/components/ui/card";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const MapLeaf = dynamic(() => import('../../../../../components/map/leaf-map'), { ssr: false });
export type LocationProps = {
  address: string;
  map: string;
  cordinates?: [number, number];
};
// import customIconUrl from '/map-marker.png'

const MapLocation = ({ address, map, cordinates }: LocationProps) => {
  return (
    <Card className="w-full  bg-transparent border-none shadow-none z-0">
      <CardHeader className="px-0">
        <h3 className="text-xl font-bold">Location</h3>
        <p className="text-sm text-muted-foreground">{address}</p>
      </CardHeader>
      <CardContent className="p-0 -mx-2 sm:mx-0">
        <div className="overflow-hidden sm:rounded-2xl aspect-video">
          <Suspense fallback={<div>Loading...</div>}>
            <MapLeaf cordinates={cordinates} className="-z-20"/>
          </Suspense>
         
        </div>
      </CardContent>
    </Card>
  );
};

export default MapLocation;
