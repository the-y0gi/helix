import { cn } from "@/lib/utils";
import React from "react";
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
import { ImagesSliderDemo } from "../addimage/middle-ads-image";
const MainFramePage = ({ className, popularTrends, type }: HotelFramePageProps) => {
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
