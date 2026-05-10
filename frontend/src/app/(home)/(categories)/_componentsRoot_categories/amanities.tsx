
import { amenityIconMap } from "@/components/ui/icons";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
  amenities: string[];
  title?: string
};

const AmenitiesValues = ({ amenities, title = "Amenities" }: Props) => {
  return (
    <Card className="w-full bg-transparent border-none shadow-none p-0 gap-2 py-2 ">
      <CardHeader className="px-0 ">
        <h3 className="text-xl font-bold dark:text-zinc-400 text-zinc-800">{title}</h3>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4 p-0  ">
        {amenities.map((amenity) => {
          const iconKey = amenity.toLowerCase().replace(/\s+/g, "_");
          const Icon = amenityIconMap[iconKey] || amenityIconMap["breakfast"];

          return (

            <div key={amenity} className="inline-flex items-center gap-1.5 text-xs sm:text-sm dark:bg-muted bg-gray-200 px-2 py-1 sm:px-4 sm:py-2 rounded-full cursor-default">
              {Icon && title === "Amenities" && <Icon className="h-3 w-3 sm:h-4 sm:w-4" />}
              <span>{amenity}</span>
            </div>

          );
        })}
      </CardContent>
    </Card>
  );
};

export default AmenitiesValues;