import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

type Props = {
  address: string;
  map: string;
};
const MapLocation = ({ address, map }: Props) => {
  return (
    <Card className="w-full  bg-transparent border-none shadow-none">
      <CardHeader>
        <h3 className="text-xl font-bold">Location</h3>
        <p className="text-sm text-muted-foreground">{address}</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl aspect-video">
          <img
            src={map}
            alt="map image"
            className="w-full h-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapLocation;
