// "use client";

// import { cn } from "@/lib/utils";
// import React, { Suspense } from "react";
// import { ErrorBoundary } from "react-error-boundary";
// import HotelItems from "./_components/HotelItems";
// import { ScrollToTop } from "../../../../../scrolltoto";

// import { useParams } from "next/navigation";

// // import { useHotelQuery } from "@/services/querys";
// import { Hotel } from "@/types";

// type HotelDetailsProps = {
//   className?: string;
// };

// const HotelDetails = ({ className }: HotelDetailsProps) => {
//   const { hotel: hotelId } = useParams();
//   const { data: hotel, isLoading: loading } = useHotelQuery({
//     hotelId: Array.isArray(hotelId) ? hotelId[0] : (hotelId || ""),
//   });

//   if (loading) return <p>Loading...</p>;
//   if (!hotel) return <p>Hotel not found</p>;

//   return (
//     <div className={cn(" w-full", className)}>
//       <ErrorBoundary fallback={<p>error</p>}>
//         <Suspense fallback={<p>loading</p>}>
//           <ScrollToTop />
//           <HotelItems hotel={hotel} />
//         </Suspense>
//       </ErrorBoundary>
//     </div>
//   );
// };

// export default HotelDetails;

// "use client";

// import { cn } from "@/lib/utils";
// import React from "react";
// import { ErrorBoundary } from "react-error-boundary";
// import { ScrollToTop } from "../../../../../scrolltoto";
// import { useParams } from "next/navigation";

// import HotelItems from "./_components/HotelItems";
// import { useHotelStore } from "@/store/hotel.store";
// import {
//   useHotelDetailsQuery,
//   useHotelAvailabilityQuery,
// } from "@/services/querys";

// type HotelDetailsProps = {
//   className?: string;
// };

// const HotelDetails = ({ className }: HotelDetailsProps) => {
//   const { hotel: hotelIdParam } = useParams();

//   const hotelId = Array.isArray(hotelIdParam)
//     ? hotelIdParam[0]
//     : hotelIdParam || "";

//   const { date, guests, isBookingMode } = useHotelStore();

//   /* ---------------- Details Query ---------------- */
//   const {
//     data: hotelDetails,
//     isLoading: detailsLoading,
//   } = useHotelDetailsQuery(hotelId);

//   /* ---------------- Availability Query ---------------- */
//   const {
//     data: availabilityData,
//     isLoading: availabilityLoading,
//   } = useHotelAvailabilityQuery({
//     hotelId,
//     checkIn: date?.from,
//     checkOut: date?.to,
//     adults: guests.adults,
//     children: guests.children,
//   });

//   /* ---------------- Combined Loading ---------------- */
//   const isLoading =
//     detailsLoading || (isBookingMode && availabilityLoading);

//   if (isLoading) {
//     return (
//       <div className="w-full flex items-center justify-center py-20">
//         <p className="text-muted-foreground text-sm">
//           Loading hotel details...
//         </p>
//       </div>
//     );
//   }

//   if (!hotelDetails) {
//     return (
//       <div className="w-full flex items-center justify-center py-20">
//         <p className="text-red-500 text-sm">
//           Hotel not found.
//         </p>
//       </div>
//     );
//   }

//   const rooms =
//     isBookingMode && availabilityData?.roomTypes
//       ? availabilityData.roomTypes
//       : hotelDetails.roomTypes || [];

//   return (
//     <div className={cn("w-full", className)}>
//       <ErrorBoundary fallback={<p>Something went wrong.</p>}>
//         <ScrollToTop />
//         <HotelItems
//           hotel={hotelDetails}
//           rooms={rooms}
//           isBookingMode={isBookingMode}
//           isAvailabilityLoading={availabilityLoading}
//         />
//       </ErrorBoundary>
//     </div>
//   );
// };

// export default HotelDetails;

"use client";

import { cn } from "@/lib/utils";
import React, { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ScrollToTop } from "../../../../../../scrolltoto";
import { useParams } from "next/navigation";

import HotelItems from "./_components/HotelItems";
import { useHotelStore } from "@/store/hotel.store";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useHotelDetailsQuery,
} from "@/services/hotel/querys";
import HotelContextProvider from "./_providers_context/hotel-contextProvider";
import { MessageModal } from "@/components/messagemodal";
import { useIsMobile } from "@/hooks/use-mobile";

const HotelDetails = ({ className }: { className?: string }) => {
  const [isBookingMode, setIsBookingMode] = React.useState(false);
  const ismobile = useIsMobile();
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  const { hotel: hotelIdParam } = useParams();

  const hotelId = Array.isArray(hotelIdParam)
    ? hotelIdParam[0]
    : hotelIdParam || "";

  const { date, guests } = useHotelStore();
  const hotelStorage = localStorage.getItem("hotel-storage");
  useEffect(() => {
    if (hotelStorage) {
      const hotel = JSON.parse(hotelStorage);
      setIsBookingMode(!!hotel.state.date?.to && !!hotel.state.date?.from);
    }
  }, [hotelStorage]);

  const { data: hotelDetailsData } =
    useHotelDetailsQuery(hotelId);








  if (!hotelDetailsData || !hotelDetailsData.name) {
    return (
      <div className={cn("w-full", className)}>
        <ScrollToTop />
        <HotelPageSkeleton />
      </div>
    );
  }





  return (
    <div className={cn("w-full  ", className)}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<HotelPageSkeleton />}>
          <ScrollToTop />
          <HotelContextProvider hotelId={hotelId}>
            <HotelItems
              hotel={hotelDetailsData}
              loading={!hotelDetailsData || !hotelDetailsData.name}
              isBookingMode={isBookingMode}
            />
          </HotelContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

function HotelPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full md:py-8 px-4 md:px-0">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:px-10">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <Skeleton className="h-6 sm:h-7 md:h-8 w-[80%] max-w-[600px] rounded-md" />
            <Skeleton className="h-4 sm:h-5 w-[150px] rounded-md" />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
            <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
          <Skeleton className="h-4 w-[250px] rounded-md" />
        </div>
      </div>

      {/* TabsLine Container */}
      <div className="w-full border-t border-border mt-2">
        <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-10">
          
          {/* Overview / LayoutGridDemo Skeleton */}
          <section className="py-3 -mx-5 md:mx-0">
            <div className="grid grid-cols-2 md:gap-1 gap-0.5 rounded-xl md:rounded-2xl overflow-hidden w-full aspect-[4/3] md:aspect-auto xl:h-[430px] md:h-[300px]">
              {/* Left half: 1 large image */}
              <div className="h-full w-full block">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
              {/* Right half: 2x2 grid of 4 images */}
              <div className="h-full w-full grid grid-cols-2 grid-rows-2 gap-0.5 md:gap-1">
                 <Skeleton className="h-full w-full rounded-none" />
                 <Skeleton className="h-full w-full rounded-none" />
                 <Skeleton className="h-full w-full rounded-none" />
                 <Skeleton className="h-full w-full rounded-none" />
              </div>
            </div>
          </section>

          {/* Sticky Tab Bar Skeleton */}
          <div className="h-16 flex items-center -mx-4 px-4 md:px-6 mb-8 border-b border-t border-border">
            <div className="flex gap-6 overflow-hidden">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>

          {/* Main Content & Sidebar Skeleton */}
          <div className="flex flex-col lg:flex-row lg:gap-6 mb-5">
            <main className="flex-1 space-y-5 border-b-1 mb-4">
              <section className="py-2 gap-4 flex flex-col">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[60%]" />
              </section>
            </main>
            
            <aside className="lg:w-[380px] flex-shrink-0">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;
