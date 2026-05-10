
"use client";

import { cn } from "@/lib/utils";
import React, { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ScrollToTop } from "../../../../../../scrolltoto";
import { useParams } from "next/navigation";

import HotelItems from "./_components/HotelItems";
import { useHotelStore } from "@/store/hotel.store";
import { HotelPageSkeleton, Skeleton } from "@/components/ui/skeleton";
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



export default HotelDetails;
