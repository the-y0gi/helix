// import { amenityIconMap } from "@/components/ui/icons";
// import React from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// type Props = {
//   amenities: string[];
// };

// const AmenitiesValues = ({ amenities }: Props) => {
//   return (
//     <TooltipProvider>
//       <Card className="w-full bg-transparent border-none shadow-none py-2 md:py-6">
//         <CardHeader className="px-0 ">
//           <h3 className="text-xl font-bold">Amenities</h3>
//         </CardHeader>
//         <CardContent className="flex flex-wrap gap-4 p-0 md:px-6 ">
//           {amenities.map((amenity) => {
//             const iconKey = amenity.toLowerCase().replace(/\s+/g, "_");
//             const Icon = amenityIconMap[iconKey] || amenityIconMap["breakfast"];

//             return (
//               <Tooltip key={amenity}>
//                 <TooltipTrigger asChild>
//                   <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-muted px-2 py-1 sm:px-4 sm:py-2 rounded-full cursor-default">
//                     {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4" />}
//                     <span>{amenity}</span>
//                   </div>
//                 </TooltipTrigger>
//                 <TooltipContent className="flex flex-col gap-1 p-3 bg-card text-text">
//                   <div className="flex items-center gap-2 font-semibold">
//                     {Icon && <Icon className="h-4 w-4" />}
//                     <span>{amenity}</span>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     This is very useful
//                   </p>
//                 </TooltipContent>
//               </Tooltip>
//             );
//           })}
//         </CardContent>
//       </Card>
//     </TooltipProvider>
//   );
// };

// export default AmenitiesValues;
import { amenityIconMap } from "@/components/ui/icons";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  amenities: string[];
};

const AmenitiesValues = ({ amenities }: Props) => {
  return (
      <Card className="w-full bg-transparent border-none shadow-none p-0 gap-2 py-2 ">
        <CardHeader className="px-0 ">
          <h3 className="text-xl font-bold dark:text-zinc-400 text-zinc-800">Amenities</h3>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 p-0  ">
          {amenities.map((amenity) => {
            const iconKey = amenity.toLowerCase().replace(/\s+/g, "_");
            const Icon = amenityIconMap[iconKey] || amenityIconMap["breakfast"];

            return (
             
                  <div key={amenity} className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-muted px-2 py-1 sm:px-4 sm:py-2 rounded-full cursor-default">
                    {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4" />}
                    <span>{amenity}</span>
                  </div>
                
            );
          })}
        </CardContent>
      </Card>
  );
};

export default AmenitiesValues;