import { amenityIconMap } from "@/components/ui/icons";
import React from "react";

type Props = {};
const amenities = [
  {
    name: "Breakfast",
    icon: "breakfast",
  },
  {
    name: "Free WiFi",
    icon: "wifi",
  },
  {
    name: "Sea View",
    icon: "ac",
  },
  {
    name: "No Smoking",
    icon: "no_smoking",
  },
  {
    name: "Air Conditioner",
    icon: "sea_view",
  },
];
import { Card, CardContent, CardHeader } from '@/components/ui/card'
const AmenitiesValues = (props: Props) => {
  return (
    <Card className='md:w-1/2 flx flex-col gap-10 bg-transparent border-none shadow-none'>
        <CardHeader>
            <h3 className='text-xl font-bold'>Amenities</h3>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-10">
            {amenities.map((amenity) => {
          const Icon = amenityIconMap[amenity.icon];
          return (
            <div
              key={amenity.name}
              className="inline-flex items-center gap-1.5 text-xs bg-card px-2.5 py-1 rounded-full "
            >
              {Icon && <Icon className="h-3 w-3" />}
              <span>{amenity.name}</span>
            </div>
          );
        })}
        </CardContent>
    </Card>
    
  );
};

export default AmenitiesValues;
