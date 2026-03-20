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
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ScrollToTop } from "../../../../../scrolltoto";
import { useParams } from "next/navigation";

import HotelItems from "./_components/HotelItems";
import { useHotelStore } from "@/store/hotel.store";
import {
  useHotelDetailsQuery,
  useHotelAvailabilityQuery,
} from "@/services/hotel/querys";
import HotelContextProvider from "./_providers_context/hotel-contextProvider";
import { MessageModal } from "@/components/messagemodal";
import { PageSkeleton, PlaneSkeleton, SkeletonText } from "@/components/loader/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const HotelDetails = ({ className }: { className?: string }) => {
  const ismobile = useIsMobile();
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  const { hotel: hotelIdParam } = useParams();

  const hotelId = Array.isArray(hotelIdParam)
    ? hotelIdParam[0]
    : hotelIdParam || "";

  const { date, guests, isBookingMode } = useHotelStore();

  const { data: hotelDetailsData } =
    useHotelDetailsQuery(hotelId);


  const { isLoading: availabilityLoading, refetch: refetchAvailability } =
    useHotelAvailabilityQuery({
      hotelId,
      checkIn: date?.from,
      checkOut: date?.to,
      adults: guests.adults,
      children: guests.children,
    });





  if (!hotelDetailsData || !hotelDetailsData.name) {
    return (

      <div className="w-full flex items-center justify-center py-10 flex-col">
        <div className="w-full my-10">
          <SkeletonText />
        </div>
        <div className="grid-cols-2 w-full px-15">
          <PlaneSkeleton />

        </div>
      </div>
    );
  }





  return (
    <div className={cn("w-full  ", className)}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<PageSkeleton />}>
          <ScrollToTop />
          <HotelContextProvider hotelId={hotelId}>

            <HotelItems
              hotel={hotelDetailsData}
              // rooms={rooms}
              isBookingMode={isBookingMode}
              isAvailabilityLoading={availabilityLoading}
            />
          </HotelContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default HotelDetails;
