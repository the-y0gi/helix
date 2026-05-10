"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabscn";
import { RoomType } from "@/types";
import { useHotelStore } from "@/store/hotel.store";
// import { Service } from "../_providers_context/AdventureDetailsContextProvider";
import { HotelRoomCardSkeleton } from "../../../hotels/[hotel]/_components/room-card";
import { AdventureService } from "../_providers_context/AdventureDetailsContextProvider";
import { AdventureDetailsCardComp } from "./adventure-card";

export const BikesMain = ({
  services,

  isBookingMode,
  isLoading,
}: {
  services: AdventureService[]
  // hotelId: string;
  // rooms: RoomType[];
  isBookingMode: boolean;
  isLoading: boolean;
}) => {

  return (
    <div id="rooms" className="w-full space-y-6 scroll-mt-24">


      {isLoading && isBookingMode ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <HotelRoomCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Bikes
          services={services}
          // services={services}
          isBookingMode={isBookingMode}
        />
      )}
    </div>
  );
};

export function Bikes({
  services,
  isBookingMode,
}: {
  services: AdventureService[];
  isBookingMode: boolean;
}) {
  if (services?.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed rounded-3xl text-center">
        <p className="text-slate-500 font-medium">
          No rooms available for the selected criteria.
        </p>
      </div>
    );
  }



  return (
    <div className="flex flex-col gap-2 md:gap-4">
      {services?.map((service) => (
        <BikeDetailsCardItem
          key={service._id}
          service={service}
          isBookingMode={isBookingMode}
        />
      ))}
    </div>
  );
}



export const BikeDetailsCardItem = ({
  service,
  isBookingMode,
}: {
  service: AdventureService;
  isBookingMode: boolean;
}) => {
  // const { date: d } = useHotelStore();
  // const showReserveButton = !!d?.to && !!d?.from;
  // const totalBeds = room.beds.reduce(
  //   (acc: number, curr: { quantity: number }) => acc + curr.quantity,
  //   0,
  // );
  // const bedDescription = room.beds
  //   .map((b: { quantity: number; type: string }) => `${b.quantity} ${b.type}`)
  //   .join(", ");

  // const currentNightlyPrice =
  //   isBookingMode && room.displayPrice
  //     ? room.displayPrice
  //     : room.discountPrice || room.basePrice;

  // const originalPrice = room.basePrice;

  // Discount % calculation based on dynamic price
  // const discountPercent =
  //   originalPrice > currentNightlyPrice
  //     ? Math.round(
  //       ((originalPrice - currentNightlyPrice) / originalPrice) * 100,
  //     )
  //     : 0;

  return (
    <AdventureDetailsCardComp
      _id={service._id}
      basePrice={service.basePrice}
      discountPrice={service.discountPrice}
      features={service.features}
      itinerary={service.itinerary}
      taxPercentage={service.taxPercentage}
      title={service.title}
      totalPriceWithTax={service.totalPriceWithTax}
      totalTax={service.totalTax}
      type={service.type}
      images={'/img4.png'}
    />
  );
};