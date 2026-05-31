
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
import { useBilesCompanyDetailsQuery } from "@/services/bikes/bikes.queries";
import CabsDetailsContextProvider from "./_providers_context/CabsDetailsContextProvider";
import { usegetCabCompanyDetails } from "@/services/cabs/cabs.queries";
import { useParam } from "@/services/dailyfunctions";

const BikeDetails = ({ className }: { className?: string }) => {
  const [isBookingMode, setIsBookingMode] = React.useState(false);
  const ismobile = useIsMobile();
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")

  const bikeId = useParam('cabid')


  const { data: bikeDetailsData, isLoading } =
    usegetCabCompanyDetails(bikeId);


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
          <CabsDetailsContextProvider bikeId={bikeId}>
            <HotelItems
              data={bikeDetailsData.data}
              loading={isLoading || !bikeDetailsData.data}
              isBookingMode={isBookingMode}
            />
          </CabsDetailsContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};



export default BikeDetails;
