'use client'
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { PopularDestinationCarousel } from "../carousel/tabs-carousel";
import type { CityTrends } from "@/types";

type HotelFramePageProps = {
  searchHotels?: React.ReactNode;
  popularDestinations?: React.ReactNode;
  trendingAdventures?: React.ReactNode;
  offers?: React.ReactNode;
  className?: string;
  popularTrends?: CityTrends[];
  type: | "cabs" | "adventures" | "tours" | "bikes" | "hotels"

};
type hoteldata = {
    _id:string,
    name:string,
    city:string,
    image:string,
    
  }
interface HotelData {
  data:hoteldata[];
}
import { ImagesSliderDemo } from "../addimage/middle-ads-image";
import { useGetNewHotels } from "@/services/hotel/querys";
const MainFramePage = ({ className, popularTrends, type }: HotelFramePageProps) => {
    const { data, isLoading, error } = useGetNewHotels();

const groupedByCity = data?.data.reduce(
  (acc: Record<string, hoteldata[]>, hotel: hoteldata) => {
    if (!acc[hotel.city]) {
      acc[hotel.city] = [];
    }

    acc[hotel.city].push(hotel);

    return acc;
  },
  {}
);
const AllHotels = useMemo(()=>groupedByCity,[groupedByCity])

  return (
    <div className={cn(className, "flex flex-col gap-y-5")}>
      {popularTrends?.map((city, i) => (
        <div key={i}>

          <PopularDestinationCarousel

            name={city.name}
            tagline={city.tagline}
            tabs={city.tabs}
            type={type}

          />
          {i === 1 && (
            <ImagesSliderDemo />
          )}
        </div>
      ))}
    </div>
  );
};

export default MainFramePage;
