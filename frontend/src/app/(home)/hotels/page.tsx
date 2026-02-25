'use client'
import { cn } from "@/lib/utils";
import  { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'
import HotelFramePage from "@/components/frame-pages/MainFramePage";
import type { CityTrends } from "@/types";
import { useGetMyTripME, useGetNewHotels } from "@/services/hotel/querys";

type HitelProps = {
  className?: string;
};

export const  HotelPopularCites:CityTrends[]=[
 {
  name:"south goa",
  tagline:"Popular homes in South Goa"
 },
 {
  name:"Bangalore",
  tagline:"Popular stays in Bangalore"
 },
 {
  name:"south goa",
  tagline:"Popular homes in South Goa"
 },
 {
  name:"Bangalore",
  tagline:"Popular stays in Bangalore"
 },
 {
  name:"south goa",
  tagline:"Popular homes in South Goa"
 },
 {
  name:"Bangalore",
  tagline:"Popular stays in Bangalore"
 },
]
const Hotel = ({className}: HitelProps) => {
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  
  
  return (
    <div className={cn(" w-full", className)}>
      <ErrorBoundary fallback={<p>error</p>}>
        <Suspense fallback={<p>loading hotels</p>}>
          <HotelFramePage 
          popularTrends={HotelPopularCites}
          type="hotels"
          
            

            
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Hotel;
