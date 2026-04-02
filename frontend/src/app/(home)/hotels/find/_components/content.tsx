"use client";
import React from "react";
import { HotelCard } from "./CardCompo";
import { cn } from "@/lib/utils";
import { ComboboxMultiple } from "./combobox-multiple";
import { Pagination_console } from "./pagination-console";
import { Button } from "@/components/ui/button";
import { IconGrid4x4, IconMenu4 } from "@tabler/icons-react";
import { useHotelStore } from "@/store/hotel.store";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHotelContext } from "@/context/hotel/HotelContextProvider";
import { Hotel } from "@/types";
import { ScrollToTop } from "../../../../../../scrolltoto";
import { ScrollToTopByParams } from "./ScrollToTopByParams";

type Props = {};

export const ContentFrame = (props: Props) => {
  const ismobile = useIsMobile()
  const { total } = useHotelContext()
  const { city, setCity } = useHotelStore();

  return (
    <div className="md:w-full">
      <div className="flex justify-between px-4 sm:px-0">
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 ">
            {total > 0 ? `Explore ${total}+ hotels in ${city}` : `Explore hotels in ${city}`}
          </h2>
          {/* <div className="w-10 min-w-37 md:w-1/2 mb-6">

            <ComboboxMultiple />
          </div> */}
        </div>
        <div>
          {!ismobile && <SwitchGrids />}
        </div>
      </div>
      <Content className={cn("gap-x-4 gap-y-6")} />
      <div className="flex py-8">
        <Pagination_console />
      </div>
    </div>
  );
};

export const Content = ({ className }: { className: string }) => {
  const { wrap , city } = useHotelStore();
  const isMobile = useIsMobile()
  const { hotels, isLoading } = useHotelContext()

  if (isLoading) {
    return (
      <>
        <ScrollToTopByParams />
        <div className={cn("flex px-2 flex-wrap", className)}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl bg-muted animate-pulse",
                wrap || isMobile ? "w-[290px] h-[420px]" : "w-full h-[220px]"
              )}
            />
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
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center"
          : "grid-cols-1",
        className
      )}
    >
      {hotels.map((hotel: Hotel) => {
        // Find lowest display price from roomTypes if available
        const roomTypes = (hotel as any).roomTypes ?? []
        const lowestPrice = roomTypes.length > 0
          ? Math.min(...roomTypes.map((r: any) => r.discountPrice > 0 ? r.discountPrice : r.basePrice))
          : (hotel as any).startingPrice ?? 0

        const firstImage = hotel.images[0]?.url ?? "/hotels/hotel-temp.png"
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

const SwitchGrids = () => {
  const { setWrap: setIsGroupedItems, wrap: isGroupedItems } = useHotelStore();

  return (
    <div
      onClick={() => setIsGroupedItems(!isGroupedItems)}
      className="relative flex h-10 w-20 rounded-2xl border border-zinc-300/30 bg-background"
    >
      <div
        className={cn(
          "absolute top-0 h-10 w-10 rounded-2xl bg-muted transition-all duration-200",
          isGroupedItems ? "left-0" : "left-10",
        )}
      />

      <Button
        variant="ghost"
        size="icon"
        className="z-10 h-10 w-10 rounded-2xl"
      >
        <IconGrid4x4 />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="z-10 h-10 w-10 rounded-2xl"
      >
        <IconMenu4 />
      </Button>
    </div>
  );
};

export default SwitchGrids;
