"use client";
import React, { useState } from "react";
import { HotelCard, HotelCardSkeleton } from "./CardCompo";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { IconGrid4x4, IconMenu4 } from "@tabler/icons-react";
import { useHotelStore } from "@/store/hotel.store";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHotelContext } from "@/context/hotel/HotelContextProvider";
import { Hotel } from "@/types";
// import { SheetNavigation } from "./sheetNavigation";

import { ChevronRight } from "lucide-react";
import { ScrollToTopByParams } from "@/components/ui/ScrollToTopByParams";
import { Pagination_console } from "@/components/ui/pagination-console";
import SwitchGrids from "@/components/side-bar-filter/SwitchGrid";
import { useNuqsContext } from "@/context/NuqsContentProvider";
import { SideBarFilter } from "@/components/filter-bar/sidebar-filter";
import { SheetNavigation } from "@/components/ui/sheetNavigation";
import { items } from "@/constants/filter-constants";

type Props = {};

export const ContentFrame = (props: Props) => {
  const ismobile = useIsMobile()
  const { total, isLoading, page, setPage } = useHotelContext()
  const { city, setCity } = useHotelStore();
  const [open, setOpen] = useState(false)
  return (
    <div className="md:w-full">
      <div className="flex justify-between px-4 sm:px-0">
        <div className="flex gap-3 w-full">
          {<div className="block xl:hidden h-10    ">
            <SheetNavigation
              content={
                <SideBarFilter items={items} mapSrc="/map-icons/map.png" alt="map image" overlayTitle="See Location on Map" />
              }
              setOpen={setOpen}
              trigger={
                <Button variant={"ghost"} className="border-r">
                  {<ChevronRight className="h-4 w-4" />}
                </Button>
              }
            />
          </div>}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4 ">
              {total > 0 ? `Explore ${total}+ hotels in ${city}` : `Explore hotels in ${city}`}
            </h2>
            {/* <div className="w-10 min-w-37 md:w-1/2 mb-6">

            <ComboboxMultiple />
          </div> */}
          </div>
        </div>
        <div>
          {!ismobile && <SwitchGrids />}
        </div>
      </div>
      <Content className={cn("gap-x-4 gap-y-6")} />
      <div className="flex py-8">
        <Pagination_console {...{ page, isLoading, setPage, total }} />
      </div>
    </div>
  );
};

export const Content = ({ className }: { className: string }) => {
  const { city } = useHotelStore();
  const isMobile = useIsMobile()
  const { hotels, isLoading } = useHotelContext()
  const { wrap } = useNuqsContext()

  if (isLoading) {
    return (
      <>
        <ScrollToTopByParams />
        <div
          className={cn(
            "grid px-2 gap-y-8",
            (wrap || isMobile)
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 justify-items-center"
              : "grid-cols-1",
            className
          )}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full">
              <HotelCardSkeleton wrap={wrap} />
            </div>
          ))}
        </div>
      </>
    )
  }

  if (!isLoading && hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <p className="text-lg">No hotels found for the selected filters.</p>
        <p className="text-sm">Try adjusting or clearing the filters.</p>
      </div>
    )
  }

  return (<>

    <ScrollToTopByParams />
    <div
      className={cn(
        "grid px-2  gap-y-8",
        (wrap || isMobile)
          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 justify-items-center"
          : "grid-cols-1",
        className
      )}
    >
      {hotels.map((hotel: Hotel) => {
        const roomTypes = (hotel as any).roomTypes ?? []
        const lowestPrice = roomTypes.length > 0
          ? Math.min(...roomTypes.map((r: any) => r.discountPrice > 0 ? r.discountPrice : r.basePrice))
          : (hotel as any).startingPrice ?? 0

        const firstImage = hotel.thumbnail.length > 50 ? hotel.thumbnail : "/hotels/hotel-temp.png"
        // console.log( hotel);


        return (
          <HotelCard
            key={hotel._id}
            hotelId={hotel._id}
            image={firstImage}
            favourite={hotel.isFavorite}
            title={hotel.name}
            location={hotel.city ?? city}
            rating={hotel.rating ?? 0}
            stars={Math.round(hotel.rating ?? 0)}
            reviews={{ text: hotel.rating >= 4.5 ? "Excellent" : hotel.rating >= 3.5 ? "Very Good" : "Good", count: hotel.numReviews ?? 0 }}
            roomInfo={hotel.description}
            price={lowestPrice ? `₹${lowestPrice.toLocaleString()}` : "—"}
            discount={""}
            wrap={wrap || isMobile}
            amenities={hotel.amenities ?? []}
          />
        )
      })}
    </div>
  </>
  );
};

