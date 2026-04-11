'use client'
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'
import AdventureFramePage from "@/components/frame-pages/AdventuresFramePage";
import type { Categories, CityTrends } from "@/types";
import { PageSkeleton } from "@/components/loader/skeleton";
import { MessageModal } from "@/components/messagemodal";
import { useIsMobile } from "@/hooks/use-mobile";
import AdventureSection from "./_components/activityDummy";
import { OnlyCarousel } from "@/components/carousel/onlyColursel";
import { PopularDestinationCarousel } from "@/components/carousel/tabs-carousel";
import UnderConstruction from "@/components/blankpages/contruction";

export type AdventuresFramePageProps = {
  className?: string;
  type: Categories;
  popularTrends?: CityTrends[];
};
export interface HotelData {
  data: hoteldata[];
}
export type hoteldata = {
  _id: string,
  name: string,
  city: string,
  image: string,
}

const Hotel: React.FC<AdventuresFramePageProps> = ({ className }) => {
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  const ismobile = useIsMobile()


  return (
    <UnderConstruction cat='Adventures'/>
    // <div className={cn(" w-full ", ismobile ? "" : "", className)}>
    //   <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
    //     <Suspense fallback={<PageSkeleton />}>

    //       <AdventureSection />


    //       <AdventureFramePage
    //         // popularTrends={HotelPopularCites}
    //         type="adventures"




    //       />
    //     </Suspense>
    //   </ErrorBoundary>
    // </div>
  );
};

export default Hotel;
