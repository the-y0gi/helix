"use client";
import React from "react";
import { HotelCard } from "./CardCompo";
import { cn } from "@/lib/utils";
import { ComboboxMultiple } from "./combobox-multiple";
import { Pagination_console } from "./pagination-console";
import { Button } from "@/components/ui/button";
import { IconGrid4x4, IconMenu4 } from "@tabler/icons-react";
import { useHotelStore } from "@/store/hotel.store";
import { useQuery } from "@tanstack/react-query";
import { hotelService } from "@/services/hotel.service";

type Props = {};

export const ContentFrame = (props: Props) => {
  const { data: hotels, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: () => hotelService.getHotels(),
  });

  return (
    <div className="md:w-full">
      <div className="flex justify-between">
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4">
            {isLoading
              ? "Searching for places..."
              : `Explore ${hotels?.length || 0}+ places in Goa`}
          </h2>
          <div className="w-10 min-w-37 md:w-1/2 mb-6">
            <ComboboxMultiple />
          </div>
        </div>
        <div>
          <SwitchGrids />
        </div>
      </div>
      <Content
        className={cn("gap-x-4 gap-y-6")}
        hotels={hotels}
        isLoading={isLoading}
      />
      <div className="flex py-8">
        <Pagination_console />
      </div>
    </div>
  );
};

export const Content = ({
  className,
  hotels,
  isLoading,
}: {
  className: string;
  hotels?: any[];
  isLoading: boolean;
}) => {
  const { wrap } = useHotelStore();

  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className,
        )}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[400px] w-full animate-pulse bg-muted rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h3 className="text-xl font-medium">No hotels found</h3>
        <p className="text-muted-foreground">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div
      className={cn("flex px-2", wrap ? "flex-wrap" : "flex-col", className)}
    >
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel._id}
          hotelId={hotel._id}
          amenities={hotel.amenities}
          left={hotel.left || 1} // Using default or backend field if added later
          stars={hotel.stars || 5} // Assuming 5 stars if not provided
          wrap={wrap}
          image={hotel.images?.[0]?.url || "/img2.png"}
          title={hotel.name}
          location={hotel.city || hotel.address}
          tag={hotel.isFeatured ? "Featured" : undefined}
          rating={hotel.rating || 0}
          reviews={{
            text: hotel.rating >= 4.5 ? "Excellent" : "Very Good",
            count: hotel.numReviews || 0,
          }}
          roomInfo={hotel.description.substring(0, 100) + "..."}
          oldPrice={hotel.oldPrice ? `$${hotel.oldPrice}` : undefined}
          price={`$${hotel.price || 1500}`} // Price might come from roomTypes, using fallback
          discount={hotel.discount || "10% off"}
        />
      ))}
    </div>
  );
};

const SwitchGrids = () => {
  // const [isGroupedItems, setIsGroupedItems] = React.useState(true)
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
