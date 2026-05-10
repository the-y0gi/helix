
// "use client";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useHotelStore } from "@/store/hotel.store";
// import { cn } from "@/lib/utils";
// import { useSliderIfNotChooseDate } from "../_providers_context/SliderIfNotChooseDate";
// import { motion } from "framer-motion";
// import { useState } from "react";

// import {
//   Fuel,
//   Gauge,
//   Settings2,
//   ChevronRight,
//   Star,
//   ShieldCheck
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { validimage } from "@/services/dailyfunctions";
// import { RouterPush } from "@/components/RouterPush";
// import { TourService } from "../_providers_context/TourDetailsContextProvider";

// export function BikeDetailsageCardComp({
//  duration,features,price,serviceId,title,
//   taxPercentage,
//   thumbnail,
//   totalPriceWithTax,
// }: TourService) {
//   const [loading, setLoading] = useState(false);
//   const { date } = useHotelStore();
//   const { handleClick } = useSliderIfNotChooseDate();

//   // Logic helpers
//   const bothDateSelected = !!date?.to && !!date?.from;
//   const discountLabel = taxPercentage > 0 ? `${taxPercentage}% TAX INCL.` : "BEST PRICE";
//   const router = useRouter();
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
//           "grid grid-cols-1 md:grid-cols-[minmax(0,240px)_1fr_minmax(0,200px)]",
//           "lg:grid-cols-[minmax(0,280px)_1fr_minmax(0,220px)]",
//           "md:h-[200px] lg:h-[220px]",
//         )}
//       >

//         {/* IMAGE SECTION */}
//         <div className="relative overflow-hidden p-3 h-48 md:h-auto">
//           <motion.div
//             layoutId={`image-${serviceId}`}
//             className="w-full h-full relative"
//           >
//             <img
//               src={validimage(thumbnail)}
//               alt={bikeName}
//               className="w-full h-full object-cover rounded-xl md:rounded-2xl"
//             />
//             <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
//               {bikeType}
//             </div>
//           </motion.div>

//           <div className="absolute top-5 right-5 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
//             {discountLabel}
//           </div>
//         </div>

//         {/* INFO SECTION */}
//         <div className="p-4 md:p-5 flex flex-col border-b md:border-b-0 md:border-r border-border/50">
//           <div className="flex justify-between items-start mb-3">
//             <div>
//               <h3 onClick={() => { RouterPush(router, `/bikes/services/${serviceId}`) }} className="text-xl  md:text-2xl font-bold text-foreground tracking-tight hover:text-primary transition-colors duration-300 cursor-pointer">
//                 {bikeName}
//               </h3>
//               <div className="flex items-center gap-2 mt-1 text-muted-foreground">
//                 <ShieldCheck className="w-4 h-4 text-green-500" />
//                 <span className="text-xs font-medium">Verified & Well Maintained</span>
//               </div>
//             </div>

//             <div className="text-right">
//               <div className="flex items-center gap-1 justify-end">
//                 <span className="text-[10px] md:text-xs font-bold text-primary">Excellent</span>
//                 <div className="bg-primary text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded">4.8</div>
//               </div>
//               <span className="text-[9px] md:text-[10px] text-muted-foreground">120+ Bookings</span>
//             </div>
//           </div>

//           {/* BIKE SPECS GRID */}
//           <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
//             <div className="flex items-center gap-2 text-muted-foreground">
//               <div className="p-1.5 bg-muted rounded-lg">
//                 <Settings2 className="w-4 h-4" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground/70">Transmission</span>
//                 <span className="text-xs md:text-sm font-semibold text-foreground">{gearType}</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 text-muted-foreground">
//               <div className="p-1.5 bg-muted rounded-lg">
//                 <Gauge className="w-4 h-4" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground/70">Mileage</span>
//                 <span className="text-xs md:text-sm font-semibold text-foreground">{mileage}</span>
//               </div>
//             </div>
//           </div>

//           {/* FEATURES TAGS */}
//           <div className="flex flex-wrap gap-1.5 mt-auto">
//             {features.slice(0, 4).map((feature) => (
//               <span
//                 key={feature}
//                 className="text-[9px] md:text-[10px] font-bold bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-md border border-border/40"
//               >
//                 {feature}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* PRICING & ACTION */}
//         <div className="bg-muted/10 p-4 md:p-5 flex flex-col justify-center items-center md:items-end">
//           <div className="text-center md:text-right w-full mb-4">
//             <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Price per day</p>
//             <div className="flex items-baseline justify-center md:justify-end gap-1">
//               <span className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">
//                 ₹{pricePerDay.toLocaleString()}
//               </span>
//               <span className="text-xs md:text-sm font-medium text-muted-foreground">/day</span>
//             </div>
//             {totalPriceWithTax > pricePerDay && (
//               <p className="text-[10px] md:text-[11px] text-green-600 font-bold mt-1">
//                 Incl. GST (₹{totalPriceWithTax.toLocaleString()} total)
//               </p>
//             )}
//           </div>

//           <Button
//             onClick={handleClick}
//             size="lg"
//             className="w-full group/btn relative overflow-hidden rounded-xl font-bold h-10 md:h-12 shadow-md hover:shadow-primary/20"
//           >
//             <span className="relative z-10 flex items-center gap-2 text-xs md:text-sm">
//               {bothDateSelected ? "Book Now" : "Select Dates"}
//               <ChevronRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-1" />
//             </span>
//           </Button>

//           <p className="text-[9px] md:text-[10px] text-muted-foreground mt-2 md:mt-3 text-center w-full">
//             *No hidden charges. Instant confirmation.
//           </p>
//         </div>
//       </div>
//     </Card>
//   );
// }

// // Fixed validimage utility
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHotelStore } from "@/store/hotel.store";
import { cn } from "@/lib/utils";
import { useSliderIfNotChooseDate } from "../_providers_context/SliderIfNotChooseDate";
import { motion } from "framer-motion";
import { useState } from "react";

import {
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CalendarDays
} from "lucide-react";
import { useRouter } from "next/navigation";
import { validimage } from "@/services/dailyfunctions";
import { RouterPush } from "@/components/RouterPush";
import { TourService } from "../_providers_context/TourDetailsContextProvider";
import { DetailsPageCardWrapperUI } from "../../../_componentsRoot_categories/CardWrapper";

export function TourDetailsCard({
  duration,
  features,
  price,
  serviceId,
  title,
  taxPercentage,
  thumbnail,
  totalPriceWithTax,
}: TourService) {
  const [loading, setLoading] = useState(false);
  const { date } = useHotelStore();
  const { handleClick } = useSliderIfNotChooseDate();

  // Logic helpers
  const bothDateSelected = !!date?.to && !!date?.from;
  const discountLabel = taxPercentage > 0 ? `${taxPercentage}% TAX INCL.` : "BEST PRICE";
  const router = useRouter();

  return (
    <DetailsPageCardWrapperUI>


      {/* IMAGE SECTION */}
      <div className="relative overflow-hidden  h-42 md:h-auto">
        <motion.div
          layoutId={`image-${serviceId}`}
          className="w-full h-full relative"
        >
          <img
            src={validimage(thumbnail)}
            alt={title}
            className="w-full h-full object-cover rounded-md md:rounded-md"
          />
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Tour Package
          </div>
        </motion.div>

        <div className="absolute top-5 right-5 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
          {discountLabel}
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="p-4 md:p-5 flex flex-col border-b md:border-b-0 md:border-r border-border/50">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3
              onClick={() => RouterPush(router, `/tours/services/${serviceId}`)}
              className="text-lg md:text-xl lg:text-2xl font-bold text-foreground tracking-tight hover:text-primary transition-colors duration-300 cursor-pointer line-clamp-2"
            >
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Rishikesh, Uttarakhand</span>
            </div>
          </div>

          <div className="text-right ml-2 shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-[10px] md:text-xs font-bold text-primary">Excellent</span>
              <div className="bg-primary text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded">4.9</div>
            </div>
            <span className="text-[9px] md:text-[10px] text-muted-foreground">Top Rated</span>
          </div>
        </div>

        {/* TOUR SPECS GRID */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1.5 bg-muted rounded-lg">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground/70">Duration</span>
              <span className="text-xs md:text-sm font-semibold text-foreground">{duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1.5 bg-muted rounded-lg">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground/70">Guidance</span>
              <span className="text-xs md:text-sm font-semibold text-foreground">Expert Led</span>
            </div>
          </div>
        </div>

        {/* FEATURES TAGS */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="text-[9px] md:text-[10px] font-bold bg-secondary/50 text-secondary-foreground px-2.5 py-1 rounded-md border border-border/40 whitespace-nowrap"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* PRICING & ACTION */}
      <div className="bg-muted/10 p-4 md:p-5 flex flex-col justify-center items-center md:items-end">
        <div className="text-center md:text-right w-full mb-4">
          <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Starting from</p>
          <div className="flex items-baseline justify-center md:justify-end gap-1">
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">
              ₹{price.toLocaleString()}
            </span>
            <span className="text-xs md:text-sm font-medium text-muted-foreground">/person</span>
          </div>
          {totalPriceWithTax > price && (
            <p className="text-[10px] md:text-[11px] text-green-600 font-bold mt-1">
              Final: ₹{totalPriceWithTax.toLocaleString()}
            </p>
          )}
        </div>

        <Button
          onClick={handleClick}
          size="lg"
          className="w-full group/btn relative overflow-hidden rounded-xl font-bold h-10 md:h-12 shadow-md hover:shadow-primary/20"
        >
          <span className="relative z-10 flex items-center gap-2 text-xs md:text-sm">
            <CalendarDays className="w-4 h-4" />
            {bothDateSelected ? "Book Tour" : "Check Availability"}
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-1" />
          </span>
        </Button>

        <p className="text-[9px] md:text-[10px] text-muted-foreground mt-2 md:mt-3 text-center w-full">
          *Includes stay, meals & activities
        </p>
      </div>
    </DetailsPageCardWrapperUI>

  );
}


