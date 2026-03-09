'use client'
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { PopularDestinationCarousel } from "../carousel/tabs-carousel";
import { ImagesSliderDemo } from "../addimage/middle-ads-image";
import { useGetNewHotels } from "@/services/hotel/querys";
import type { Item } from "../carousel/onlyColursel";
import { hoteldata, HotelFramePageProps } from "@/app/(home)/hotels/page";

// No tabs in this design → so we pass tabs={undefined}
type SectionConfig = {
  tagline: string;
  city: string;
  limit?: number;
};

const POPULAR_SECTIONS: SectionConfig[] = [
  { tagline: "Popular Homes In South Goa", city: "Goa" },
  { tagline: "Popular Stays In Bangalore", city: "Bengaluru" },
  { tagline: "Grand Palaces In Udaipur", city: "Udaipur" },
  { tagline: "Luxury in Mumbai", city: "Mumbai" },
  { tagline: "Luxury in Indore", city: "Indore" },
];

const MainFramePage = ({ className, type }: HotelFramePageProps) => {
  const { data, isLoading, error } = useGetNewHotels();
  console.log(data?.data);
  

  // 1. Group once (optional but efficient if many sections)
  const groupedByCity = useMemo(() => {
    if (!data?.data) return {};

    return data.data.reduce((acc: Record<string, hoteldata[]>, hotel: hoteldata) => {
      const city = hotel.city?.trim();
      if (!city) return acc;
      acc[city] = acc[city] || [];
      acc[city].push(hotel);
      return acc;
    }, {} as Record<string, hoteldata[]>);
  }, [data?.data]);
  // let allciti =
  // 2. Prepare carousel items for each section
  const sectionItems = useMemo(() => {
    return POPULAR_SECTIONS.map((section) => {
      const hotelsInCity = groupedByCity[section.city] || [];

      // Optional: sort by some criteria (e.g. newest first if _id is chronological)
      // hotelsInCity.sort((a, b) => b._id.localeCompare(a._id)); 

      const sliced = section.limit ? hotelsInCity.slice(0, section.limit) : hotelsInCity;

      return sliced.map((hotel:hoteldata): Item => ({
        title: hotel.name,
        location: `${hotel.city}, India`,
        image: hotel.image,
        href: `/hotels/${hotel._id}`,   // adjust if your route is different
      }));
    });
  }, [groupedByCity]);

  return (
    <div className={cn(className, "flex flex-col gap-y-5 ")}>
      {POPULAR_SECTIONS.map((section, i) => {
        const items = sectionItems[i] || [];
        console.log(items);
        

        return (
          <React.Fragment key={section.tagline}>
            <PopularDestinationCarousel
              tagline={section.tagline}
              // No tabs needed in your screenshot design
              // tabs={undefined}
              type={type}
              items={items}
              isLoading={isLoading}
            />

            {/* Insert ad after Bangalore (or any index you want) */}
            {i === 1 && <ImagesSliderDemo />}
          </React.Fragment>
        );
      })}

      {error && (
        <p className="text-red-500 text-center">Failed to load hotels: {error.message}</p>
      )}
    </div>
  );
};

export default MainFramePage;