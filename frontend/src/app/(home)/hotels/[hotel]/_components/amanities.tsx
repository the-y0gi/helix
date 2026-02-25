import { amenityIconMap } from "@/components/ui/icons";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
  amenities: string[];
};

const AmenitiesValues = ({ amenities }: Props) => {
  return (
    <Card className="w-full bg-transparent border-none shadow-none">
      <CardHeader className="px-0">
        <h3 className="text-xl font-bold">Amenities</h3>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {amenities.map((amenity) => {
          const iconKey = amenity.toLowerCase().replace(/\s+/g, "_");
          const Icon = amenityIconMap[iconKey] || amenityIconMap["breakfast"]; // Fallback
          return (
            <div
              key={amenity}
              className="inline-flex items-center gap-1.5 text-sm bg-muted px-4 py-2 rounded-full "
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{amenity}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AmenitiesValues;
