"use client";
import React from "react";
import { HotelCard } from "./CardCompo";
import { cn } from "@/lib/utils";
import { ComboboxMultiple } from "./combobox-multiple";
import { Pagination_console } from "./pagination-console";
import { Button } from "@/components/ui/button";
import { IconGrid4x4, IconMenu4 } from "@tabler/icons-react";
import { useHotelStore } from "@/store/hotel.store";
type Props = {};

export const ContentFrame = (props: Props) => {
  return (
    <div className="md:w-full">
      <div className="flex justify-between">
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4">
            Explore 300+ places in Goa
          </h2>
          <div className="w-10 min-w-37 md:w-1/2 mb-6">
            <ComboboxMultiple />
          </div>
        </div>
        <div>
          <SwitchGrids />
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
  const { wrap } = useHotelStore();

  return (
    <div
      className={cn("flex  px-2", wrap ? "flex-wrap" : "flex-col", className)}
    >
      {[...Array(9)].map((_, i) => (
        <HotelCard
          hotelId={i.toString()}
          amenities={["free cancelation", "spa access"]}
          left={1}
          stars={4}
          wrap={wrap}
          key={i}
          image="./img2.png"
          title="Hotel Arts Goa"
          location="Port Olympic"
          tag="Getaway Deal"
          rating={5.0}
          reviews={{ text: "Excellent", count: 1200 }}
          roomInfo="Luxury Hotel · Sea View Room · King Bed"
          oldPrice="$1,800"
          price="$1,500"
          discount="10% off"
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
