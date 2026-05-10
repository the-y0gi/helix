
"use client";

import { cn } from "@/lib/utils";
import React, { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ScrollToTop } from "../../../../../../scrolltoto";
import { useParams } from "next/navigation";

import AdventureDetailsItems from "./_components/HotelItems";
import { useHotelStore } from "@/store/hotel.store";
import { HotelPageSkeleton, Skeleton } from "@/components/ui/skeleton";
import {
  useHotelDetailsQuery,
} from "@/services/hotel/querys";
import { MessageModal } from "@/components/messagemodal";
import { useIsMobile } from "@/hooks/use-mobile";
import { usegetAdventureCompanyDetails } from "@/services/adventures/adventures.queries";
import { useParam } from "@/services/dailyfunctions";
import AdventureDetailsContextProvider from "./_providers_context/AdventureDetailsContextProvider";

const HotelDetails = ({ className }: { className?: string }) => {
  const [isBookingMode, setIsBookingMode] = React.useState(false);
  const ismobile = useIsMobile();
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  const adventureid = useParam('adventureid')

  const { data: hotelDetailsData } =
    usegetAdventureCompanyDetails(adventureid);


  if (!hotelDetailsData || !hotelDetailsData.data) {
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
          <AdventureDetailsContextProvider adventureId={adventureid}>
            <AdventureDetailsItems
              data={hotelDetailsData.data}
              loading={!hotelDetailsData || !hotelDetailsData.data}
              isBookingMode={isBookingMode}
            />
          </AdventureDetailsContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};



export default HotelDetails;
