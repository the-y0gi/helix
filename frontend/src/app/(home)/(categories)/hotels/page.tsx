'use client'
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'
import HotelFramePage from "@/components/frame-pages/HotelFramePage";
import type { CityTrends } from "@/types";
import { useGetNewHotels } from "@/services/hotel/querys";
import { PageSkeleton } from "@/components/loader/skeleton";
import { MessageModal } from "@/components/messagemodal";
import HotelSearch from "./search-";
import { useIsMobile } from "@/hooks/use-mobile";
import { Categories } from "@/types";

export type HotelFramePageProps = {
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
// export const  HotelPopularCites:CityTrends[]=[
//  {
//   name:"south goa",
//   tagline:"Popular homes in South Goa"
//  },
//  {
//   name:"Bangalore",
//   tagline:"Popular stays in Bangalore"
//  },
//  {
//   name:"south goa",
//   tagline:"Popular homes in South Goa"
//  },
//  {
//   name:"Bangalore",
//   tagline:"Popular stays in Bangalore"
//  },
//  {
//   name:"south goa",
//   tagline:"Popular homes in South Goa"
//  },
//  {
//   name:"Bangalore",
//   tagline:"Popular stays in Bangalore"
//  },
// ]
const Hotel: React.FC<HotelFramePageProps> = ({ className }) => {
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  const ismobile = useIsMobile()


  return (
    <div className={cn(" w-full ", ismobile ? "" : "", className)}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<PageSkeleton />}>

          <HotelFramePage
            // popularTrends={HotelPopularCites}
            type="hotels"




          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Hotel;
