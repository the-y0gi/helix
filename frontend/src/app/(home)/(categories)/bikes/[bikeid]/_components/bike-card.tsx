// "use client";

// import { Card } from "@/components/ui/card";
// import { useRouter } from "next/navigation";
// import { useHotelStore } from "@/store/hotel.store";
// import { cn } from "@/lib/utils";
// import { useSliderIfNotChooseDate } from "../_providers_context/SliderIfNotChooseDate";
// import { motion } from "framer-motion"; // fixed typo: motion/react → framer-motion
// import { useState } from "react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Service } from "../_providers_context/bike-contextProvider";
// import { title } from "process";
// export function HotelRoomCard({
//   serviceId, bikeName, bikeType, features, gearType, mileage, pricePerDay, taxPercentage, thumbnail, totalPriceWithTax
// }: Service) {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { setSelectedRoom, date } = useHotelStore();
//   const { handleClick } = useSliderIfNotChooseDate();
//   const bothdate = !!date?.to && !!date?.from;


//   const rawToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
//   const isAuthenticated = !!rawToken && rawToken !== "null" && rawToken !== "undefined" && rawToken.trim().length > 0 || false;
//   return (
//     <Card
//       className={cn(
//         "w-full overflow-hidden border border-border/60 bg-card",
//         "hover:shadow-lg transition-all duration-300 rounded-2xl mb-4 last:mb-0",
//         "dark:hover:shadow-[0_8px_20px_rgba(255,255,255,0.06)]",
//       )}
//     >
//       <div
//         className={cn(
//           "grid grid-cols-1 md:grid-cols-[minmax(0,280px)_1fr_minmax(0,220px)]",
//           "lg:grid-cols-[minmax(0,320px)_1fr_minmax(0,240px)]",
//           "min-h-[220px] md:min-h-[260px]",
//         )}
//       >
//         {/* IMAGE SECTION – tighter on mobile */}
//         <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-full overflow-hidden flex-shrink-0 px-2 pt-2 md:pt-0 md:px-3">
//           <motion.div
//             layoutId={`image-${id}`}
//             className="w-full h-full"
//             transition={{ type: "spring", damping: 25, stiffness: 200 }}
//           >
//             <img
//               src={validimage(thumbnail)}
//               alt={title}
//               className="w-full h-full object-cover rounded-xl md:rounded-2xl"
//             />
//           </motion.div>

//           {pricePerDay > 0 && (
//             <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md z-10">
//               {pricePerDay}% OFF
//             </div>
//           )}
//         </div>

//         {/* CONTENT SECTION – reduced vertical spacing */}
//         <div className="p-4 md:p-5 lg:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
//           <div className="space-y-3 md:space-y-4">
//             <div className="flex items-start justify-between gap-2 md:gap-3">
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-base md:text-lg lg:text-xl font-bold leading-tight truncate">
//                   {title}
//                 </h3>
//                 {/* {isBookingMode && roomsLeft > 0 && (
//                   <p
//                     className={cn(
//                       "text-[11px] md:text-xs font-semibold mt-0.5",
//                       roomsLeft <= 3 ? "text-destructive" : "text-muted-foreground",
//                     )}
//                   >
//                     {roomsLeft} room{roomsLeft !== 1 ? "s" : ""} left
//                   </p>a
//                 )} */}
//               </div>
//               <div className="flex flex-col items-end flex-shrink-0">
//                 <div className="flex items-center gap-1">
//                   <span className="text-[10px] md:text-[11px] font-bold text-primary uppercase tracking-tight">
//                     Excellent
//                   </span>
//                   <div className="bg-primary text-primary-foreground text-[11px] md:text-xs font-bold px-1.5 py-0.5 rounded">
//                     {/* {rating?.toFixed(1)} */}
//                     4
//                   </div>
//                 </div>
//                 <span className="text-[9px] md:text-[10px] text-muted-foreground mt-0.5">
//                   {/* {reviewCount?.toLocaleString()} */}
//                   123 reviews
//                 </span>
//               </div>
//             </div>



//             <div className="flex flex-wrap gap-1.5 md:gap-2 text-muted-foreground">
//               {features.slice(0, 6).map((amenity) => {
//                 // const Icon = amenityIconMap[amenity.icon];
//                 return (
//                   <div
//                     key={amenity}
//                     className="flex items-center gap-1 text-[10px] md:text-xs font-medium bg-muted/60 px-2.5 py-1 rounded-full border border-border whitespace-nowrap"
//                   >
//                     {/* {Icon && <Icon className="h-3 w-3 shrink-0" />} */}
//                     <span>{amenity}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* PRICING & CTA – smaller button on mobile */}
//         <div className="bg-muted/20 p-4 md:p-5 lg:p-6 flex flex-col justify-between items-end">
//           <div className="text-right space-y-1.5 md:space-y-2">
//             {(
//               <span className="text-xs md:text-sm text-muted-foreground line-through">
//                 ₹{pricePerDay.toLocaleString()}
//               </span>
//             )}
//             <div className="flex items-baseline justify-end gap-1">
//               {
//                 pricePerDay ? (
//                   <span className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">
//                     ₹{pricePerDay?.toLocaleString()}
//                   </span>
//                 ) : (
//                   <span className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">
//                     ₹{pricePerDay.toLocaleString()}
//                   </span>
//                 )
//               }
//               <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase">
//                 / night
//               </span>
//             </div>
//           </div>


//         </div>
//       </div>
//     </Card>
//   );
// }

// export function HotelRoomCardSkeleton() {
//   return (
//     <Card
//       className={cn(
//         "w-full overflow-hidden border border-border/60 bg-card",
//         "rounded-2xl mb-4 last:mb-0",
//       )}
//     >
//       <div
//         className={cn(
//           "grid grid-cols-1 md:grid-cols-[minmax(0,280px)_1fr_minmax(0,220px)]",
//           "lg:grid-cols-[minmax(0,320px)_1fr_minmax(0,240px)]",
//           "min-h-[220px] md:min-h-[260px]",
//         )}
//       >
//         {/* IMAGE SECTION */}
//         <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-full overflow-hidden flex-shrink-0 px-2 pt-2 md:pt-0 md:px-3">
//           <Skeleton className="w-full h-full rounded-xl md:rounded-2xl" />
//         </div>

//         {/* CONTENT SECTION */}
//         <div className="p-4 md:p-5 lg:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
//           <div className="space-y-3 md:space-y-4">
//             <div className="flex items-start justify-between gap-2 md:gap-3">
//               <div className="flex-1 min-w-0">
//                 <Skeleton className="h-6 md:h-7 lg:h-8 w-[80%] max-w-[300px]" />
//                 <Skeleton className="h-4 md:h-5 w-[100px] mt-2" />
//               </div>
//               <div className="flex flex-col items-end flex-shrink-0">
//                 <Skeleton className="h-4 w-12 rounded mb-1" />
//                 <Skeleton className="h-3 w-16" />
//               </div>
//             </div>

//             <div className="flex items-center gap-4 md:gap-6 py-2 md:py-3 border-y border-border">
//               <div className="flex flex-col gap-2 w-full">
//                 <Skeleton className="h-4 w-20" />
//                 <Skeleton className="h-4 w-24" />
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-1.5 md:gap-2 text-muted-foreground mt-2">
//               <Skeleton className="h-6 md:h-7 w-20 rounded-full" />
//               <Skeleton className="h-6 md:h-7 w-24 rounded-full" />
//               <Skeleton className="h-6 md:h-7 w-16 rounded-full" />
//               <Skeleton className="h-6 md:h-7 w-28 rounded-full" />
//               <Skeleton className="h-6 md:h-7 w-20 rounded-full" />
//             </div>
//           </div>
//         </div>

//         {/* PRICING & CTA SECTION */}
//         <div className="bg-muted/20 p-4 md:p-5 lg:p-6 flex flex-col justify-between items-end">
//           <div className="text-right space-y-1.5 md:space-y-2 w-full flex flex-col items-end">
//             <Skeleton className="h-4 md:h-5 w-16" />
//             <Skeleton className="h-8 md:h-10 lg:h-12 w-32 mt-1" />
//           </div>

//           <div className="w-full mt-4 md:mt-5">
//             <Skeleton className="w-full h-9 md:h-11 lg:h-12 rounded-xl" />
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }
// export const validimage = (s:string) => {
//  if(s.length>50){
//   return s
//  } else {
//   return "/hotels/img1.png"
//  }
// }
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHotelStore } from "@/store/hotel.store";
import { cn } from "@/lib/utils";
import { useSliderIfNotChooseDate } from "../_providers_context/SliderIfNotChooseDate";
import { motion } from "framer-motion";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Service } from "../_providers_context/bike-contextProvider";
import {
  Fuel,
  Gauge,
  Settings2,
  ChevronRight,
  Star,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { validimage } from "@/services/dailyfunctions";
import { RouterPush } from "@/components/RouterPush";

export function BikeDetailsageCardComp({
  serviceId,
  bikeName,
  bikeType,
  features,
  gearType,
  mileage,
  pricePerDay,
  taxPercentage,
  thumbnail,
  totalPriceWithTax,
}: Service) {
  const [loading, setLoading] = useState(false);
  const { date } = useHotelStore();
  const { handleClick } = useSliderIfNotChooseDate();

  // Logic helpers
  const bothDateSelected = !!date?.to && !!date?.from;
  const discountLabel = taxPercentage > 0 ? `${taxPercentage}% TAX INCL.` : "BEST PRICE";
  const router = useRouter();
  return (
    <Card
      className={cn(
        "w-full overflow-hidden border border-border/60 bg-card",
        "hover:shadow-lg transition-all duration-300 rounded-2xl mb-4 last:mb-0",
        "dark:hover:shadow-[0_8px_20px_rgba(255,255,255,0.06)]",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-[minmax(0,240px)_1fr_minmax(0,200px)]",
          "lg:grid-cols-[minmax(0,280px)_1fr_minmax(0,220px)]",
          "md:h-[200px] lg:h-[220px]",
        )}
      >

        {/* IMAGE SECTION */}
        <div className="relative overflow-hidden p-3 h-48 md:h-auto">
          <motion.div
            layoutId={`image-${serviceId}`}
            className="w-full h-full relative"
          >
            <img
              src={validimage(thumbnail)}
              alt={bikeName}
              className="w-full h-full object-cover rounded-xl md:rounded-2xl"
            />
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
              {bikeType}
            </div>
          </motion.div>

          <div className="absolute top-5 right-5 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
            {discountLabel}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="p-4 md:p-5 flex flex-col border-b md:border-b-0 md:border-r border-border/50">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 onClick={() => { RouterPush(router, `/bikes/services/${serviceId}`) }} className="text-xl  md:text-2xl font-bold text-foreground tracking-tight hover:text-primary transition-colors duration-300 cursor-pointer">
                {bikeName}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium">Verified & Well Maintained</span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <span className="text-[10px] md:text-xs font-bold text-primary">Excellent</span>
                <div className="bg-primary text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded">4.8</div>
              </div>
              <span className="text-[9px] md:text-[10px] text-muted-foreground">120+ Bookings</span>
            </div>
          </div>

          {/* BIKE SPECS GRID */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-1.5 bg-muted rounded-lg">
                <Settings2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground/70">Transmission</span>
                <span className="text-xs md:text-sm font-semibold text-foreground">{gearType}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-1.5 bg-muted rounded-lg">
                <Gauge className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground/70">Mileage</span>
                <span className="text-xs md:text-sm font-semibold text-foreground">{mileage}</span>
              </div>
            </div>
          </div>

          {/* FEATURES TAGS */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {features.slice(0, 4).map((feature) => (
              <span
                key={feature}
                className="text-[9px] md:text-[10px] font-bold bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-md border border-border/40"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* PRICING & ACTION */}
        <div className="bg-muted/10 p-4 md:p-5 flex flex-col justify-center items-center md:items-end">
          <div className="text-center md:text-right w-full mb-4">
            <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Price per day</p>
            <div className="flex items-baseline justify-center md:justify-end gap-1">
              <span className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">
                ₹{pricePerDay.toLocaleString()}
              </span>
              <span className="text-xs md:text-sm font-medium text-muted-foreground">/day</span>
            </div>
            {totalPriceWithTax > pricePerDay && (
              <p className="text-[10px] md:text-[11px] text-green-600 font-bold mt-1">
                Incl. GST (₹{totalPriceWithTax.toLocaleString()} total)
              </p>
            )}
          </div>

          <Button
            onClick={handleClick}
            size="lg"
            className="w-full group/btn relative overflow-hidden rounded-xl font-bold h-10 md:h-12 shadow-md hover:shadow-primary/20"
          >
            <span className="relative z-10 flex items-center gap-2 text-xs md:text-sm">
              {bothDateSelected ? "Book Now" : "Select Dates"}
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-1" />
            </span>
          </Button>

          <p className="text-[9px] md:text-[10px] text-muted-foreground mt-2 md:mt-3 text-center w-full">
            *No hidden charges. Instant confirmation.
          </p>
        </div>
      </div>
    </Card>
  );
}

// Fixed validimage utility
