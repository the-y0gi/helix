
"use client";

import { cn } from "@/lib/utils";
import React, { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ScrollToTop } from "../../../../../../scrolltoto";
import { useParams } from "next/navigation";

import HotelItems from "./_components/HotelItems";
import { HotelPageSkeleton, Skeleton } from "@/components/ui/skeleton";

import { MessageModal } from "@/components/messagemodal";
import { useIsMobile } from "@/hooks/use-mobile";
import TourDetailsContextProvider from "./_providers_context/TourDetailsContextProvider";
import { useParam } from "@/services/dailyfunctions";
import { useTourDetailsQuery } from "@/services/tours/tours.queries";

const HotelDetails = ({ className }: { className?: string }) => {
  const [isBookingMode, setIsBookingMode] = React.useState(false);
  const ismobile = useIsMobile();
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  const { hotel: hotelIdParam } = useParams();

  const hotelId = useParam('tourid');

  const { data: tourDetailsData, isLoading: tourDetailsLoading } =
    useTourDetailsQuery(hotelId);


  if (!tourDetailsData || !tourDetailsData.data || tourDetailsLoading) {
    return (
      <div className={cn("w-full", className)}>
        <ScrollToTop />
        <HotelPageSkeleton />
      </div>
    );
  }





  return (
    <div className={cn("w-full   ", className)}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<HotelPageSkeleton />}>
          <ScrollToTop />
          <TourDetailsContextProvider tourid={hotelId}>
            <HotelItems
              data={tourDetailsData.data}
              loading={!tourDetailsData || !tourDetailsData.data || tourDetailsLoading}
              isBookingMode={isBookingMode}
            />
          </TourDetailsContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};



export default HotelDetails;
