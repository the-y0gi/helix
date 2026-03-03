'use client'
import { cn } from "@/lib/utils";
import  { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'
import HotelFramePage from "@/components/frame-pages/MainFramePage";
import type { CityTrends } from "@/types";
import { useGetMyTripME, useGetNewHotels } from "@/services/hotel/querys";
import { PageSkeleton } from "@/components/loader/skeleton";
import { MessageModal } from "@/components/messagemodal";

export type HotelFramePageProps = {
  className?: string;
  type: "hotels" | "cabs";
};
export interface HotelData {
  data: hoteldata[];
}
export type hoteldata = {
  _id:   string,
  name:  string,
  city:  string,
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
const Hotel = ({className}: HotelFramePageProps) => {
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  
  
  return (
    <div className={cn(" w-full", className)}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong"/>}>
        <Suspense fallback={<PageSkeleton/>}>
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
