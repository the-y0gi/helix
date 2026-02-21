// import Map_leaf from "@/components/map/leaf-map";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import L from "leaflet";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const MapLeaf = dynamic(() => import('../../../../../components/map/leaf-map'), { ssr: false });
type Props = {
  address: string;
  map: string;
  cordinates?: [number, number];
};
// import customIconUrl from '/map-marker.png'

const MapLocation = ({ address, map, cordinates }: Props) => {
  return (
    <Card className="w-full  bg-transparent border-none shadow-none">
      <CardHeader>
        <h3 className="text-xl font-bold">Location</h3>
        <p className="text-sm text-muted-foreground">{address}</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl aspect-video">
          <Suspense fallback={<div>Loading...</div>}>
            <MapLeaf cordinates={cordinates}/>
          </Suspense>
          {/* <img
            src={map}
            alt="map image"
            className="w-full h-full object-cover"
          /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapLocation;
