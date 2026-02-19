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
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ScrollToTop } from "../../../../../scrolltoto";
import { useParams } from "next/navigation";

import HotelItems from "./_components/HotelItems";
import { useHotelStore } from "@/store/hotel.store";
import {
  useHotelDetailsQuery,
  useHotelAvailabilityQuery,
} from "@/services/querys";

const HotelDetails = ({ className }: { className?: string }) => {
  const { hotel: hotelIdParam } = useParams();

  const hotelId = Array.isArray(hotelIdParam)
    ? hotelIdParam[0]
    : hotelIdParam || "";

  const { date, guests, isBookingMode } = useHotelStore();

  const { data: hotelDetailsData, isLoading: detailsLoading } =
    useHotelDetailsQuery(hotelId);

  const hotelDetails = hotelDetailsData?.data || hotelDetailsData;

  const { data: availabilityResponse, isLoading: availabilityLoading } =
    useHotelAvailabilityQuery({
      hotelId,
      checkIn: date?.from,
      checkOut: date?.to,
      adults: guests.adults,
      children: guests.children,
    });

  const isLoading = detailsLoading || (isBookingMode && availabilityLoading);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <p className="text-muted-foreground text-sm">
          Loading hotel details...
        </p>
      </div>
    );
  }

  if (!hotelDetails || !hotelDetails.name) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <p className="text-red-500 text-sm">Hotel not found.</p>
      </div>
    );
  }

  const availabilityRooms =
    availabilityResponse?.data?.roomTypes || availabilityResponse?.roomTypes;

  const rooms =
    isBookingMode && availabilityRooms
      ? availabilityRooms
      : hotelDetails.roomTypes || [];

  return (
    <div className={cn("w-full", className)}>
      <ErrorBoundary fallback={<p>Something went wrong.</p>}>
        <ScrollToTop />
        <HotelItems
          hotel={hotelDetails}
          rooms={rooms}
          isBookingMode={isBookingMode}
          isAvailabilityLoading={availabilityLoading}
        />
      </ErrorBoundary>
    </div>
  );
};

export default HotelDetails;
