
"use client";

import { cn } from "@/lib/utils";
import React, { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ScrollToTop } from "../../../../../../scrolltoto";
import { useParams } from "next/navigation";

import HotelItems from "./_components/HotelItems";
import { useHotelStore } from "@/store/hotel.store";
import { HotelPageSkeleton, Skeleton } from "@/components/ui/skeleton";

import { MessageModal } from "@/components/messagemodal";
import { useIsMobile } from "@/hooks/use-mobile";
import BikeDetailsContextProvider from "./_providers_context/bike-contextProvider";
import { useBilesCompanyDetailsQuery } from "@/services/bikes/bikes.queries";

const BikeDetails = ({ className }: { className?: string }) => {
  const [isBookingMode, setIsBookingMode] = React.useState(false);
  const ismobile = useIsMobile();
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  const { bikeid: bikeIdParam } = useParams();

  const bikeId = Array.isArray(bikeIdParam)
    ? bikeIdParam[0]
    : bikeIdParam || "";

  const { date, guests } = useHotelStore();


  const { data: bikeDetailsData, isLoading } =
    useBilesCompanyDetailsQuery(bikeId);


  if (!bikeDetailsData || !bikeDetailsData.data?.company || isLoading) {
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
          <BikeDetailsContextProvider bikeId={bikeId}>
            <HotelItems
              data={bikeDetailsData.data}
              loading={isLoading || !bikeDetailsData.data}
              isBookingMode={isBookingMode}
            />
          </BikeDetailsContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};



export default BikeDetails;
