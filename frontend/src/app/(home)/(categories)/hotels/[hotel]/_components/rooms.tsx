
"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabscn";
import { HotelRoomCard, HotelRoomCardSkeleton } from "./room-card";
import { RoomType } from "@/types";
import { useHotelContext } from "../_providers_context/hotel-contextProvider";
import { useHotelStore } from "@/store/hotel.store";

export const RoomsMain = ({
  hotelId,

  isBookingMode,
  isLoading,
}: {
  hotelId: string;
  // rooms: RoomType[];
  isBookingMode: boolean;
  isLoading: boolean;
}) => {
  const { rooms } = useHotelContext();

  // const roomTypes = rooms;
  return (
    <div id="rooms" className="w-full space-y-6 scroll-mt-24">
      {/* <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-bold text-foreground">
          Available Rooms
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose the best room that fits your needs
        </p>
      </div> */}

      {isLoading && isBookingMode ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <HotelRoomCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <RoomsBedTabs
          roomTypes={rooms}
          hotelId={hotelId}
          isBookingMode={isBookingMode}
        />
      )}
    </div>
  );
};

export function RoomsBedTabs({
  roomTypes,
  hotelId,
  isBookingMode,
}: {
  roomTypes: RoomType[];
  hotelId: string;
  isBookingMode: boolean;
}) {
  if (roomTypes?.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed rounded-3xl text-center">
        <p className="text-slate-500 font-medium">
          No rooms available for the selected criteria.
        </p>
      </div>
    );
  }

  // Generate dynamic tabs based on bed counts
  const bedCounts = Array.from(
    new Set(
      roomTypes?.map((r) =>
        r.beds.reduce((acc, curr) => acc + curr.quantity, 0),
      ),
    ),
  ).sort((a, b) => a - b);

  return (
    <Tabs defaultValue="all" className="w-full">
      {/* Figma Filter Tabs */}
      <TabsList className="bg-transparent gap-2 mb-8 overflow-x-auto no-scrollbar flex justify-start h-auto p-0">
        <TabsTrigger
          value="all"
          className="rounded-full px-6 py-2 border border-slate-200 data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
        >
          All Rooms
        </TabsTrigger>
        {bedCounts.map((count) => (
          <TabsTrigger
            key={count}
            value={count.toString()}
            className="rounded-full px-6 py-2 border border-slate-200 data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
          >
            {count} Bed{count > 1 ? "s" : ""}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tabs Content */}
      <TabsContent value="all" className="flex flex-col gap-6">
        {roomTypes?.map((room) => (
          <RoomCardItem
            key={room._id}
            room={room}
            hotelId={hotelId}
            isBookingMode={isBookingMode}
          />
        ))}
      </TabsContent>

      {bedCounts.map((count) => (
        <TabsContent
          key={count}
          value={count.toString()}
          className="flex flex-col gap-6"
        >
          {roomTypes
            ?.filter(
              (r) =>
                r.beds.reduce((acc, curr) => acc + curr.quantity, 0) === count,
            )
            .map((room) => (
              <RoomCardItem
                key={room._id}
                room={room}
                hotelId={hotelId}
                isBookingMode={isBookingMode}
              />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}

// function renderRoomCard(room: any, hotelId: string, isBookingMode: boolean) {
//   const totalBeds = room.beds.reduce((acc: number, curr: any) => acc + curr.quantity, 0);
//   const bedDescription = room.beds.map((b: any) => `${b.quantity} ${b.type}`).join(", ");

//   // Price Calculation logic
//   const originalPrice = room.basePrice;
//   const discountedPrice = room.discountPrice || room.basePrice;
//   const discountPercent = originalPrice > discountedPrice
//     ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
//     : 0;

//   return (
//     <HotelRoomCard
//       key={room._id}
//       hotelId={hotelId}
//       id={room._id}
//       title={room.name}
//       imageUrl={room.images?.[0]?.url || "/img1.png"}
//       originalPrice={originalPrice}
//       discountedPrice={discountedPrice}
//       totalPrice={room.totalPrice}
//       nights={room.nights || 1}
//       rating={room.rating || 5.0}
//       reviewCount={room.numReviews || 120}
//       beds={`${totalBeds} ${totalBeds > 1 ? 'Beds' : 'Bed'} (${bedDescription})`}
//       guests={room.capacity.adults + room.capacity.children}
//       size={room.roomSizeSqm}
//       amenities={room.amenities.map((a: string) => ({
//         name: a,
//         icon: a.toLowerCase().replace(/\s+/g, "_"),
//       }))}
//       roomsLeft={room.availableRooms ?? room.totalRooms}
//       discountPercent={discountPercent}
//       isBookingMode={isBookingMode}
//     />
//   );
// }


export const RoomCardItem = ({
  room,
  hotelId,
  isBookingMode,
}: {
  room: RoomType;
  hotelId: string;
  isBookingMode: boolean;
}) => {
  const { date: d } = useHotelStore();
  const showReserveButton = !!d?.to && !!d?.from;
  const totalBeds = room.beds.reduce(
    (acc: number, curr: { quantity: number }) => acc + curr.quantity,
    0,
  );
  const bedDescription = room.beds
    .map((b: { quantity: number; type: string }) => `${b.quantity} ${b.type}`)
    .join(", ");

  const currentNightlyPrice =
    isBookingMode && room.displayPrice
      ? room.displayPrice
      : room.discountPrice || room.basePrice;

  const originalPrice = room.basePrice;

  // Discount % calculation based on dynamic price
  const discountPercent =
    originalPrice > currentNightlyPrice
      ? Math.round(
        ((originalPrice - currentNightlyPrice) / originalPrice) * 100,
      )
      : 0;

  return (
    <HotelRoomCard
      displayPrice={room.displayPrice || room.basePrice}

      taxPercentage={room.taxPercentage}
      totalTax={room.totalTax}
      totalPriceWithTax={room.totalPriceWithTax}

      showReserveButton={showReserveButton}
      key={room._id}
      hotelId={hotelId}
      id={room._id}
      title={room.name}
      imageUrl={
        typeof room.images?.[0] === "string"
          ? room.images[0]
          : room.images?.[0]?.url || "/hotels/img1.png"
      }
      originalPrice={originalPrice}
      discountedPrice={currentNightlyPrice}
      totalPrice={room.totalPrice}
      nights={room.nights || 1}
      rating={room.rating || 5.0}
      reviewCount={room.numReviews || 1245}
      beds={`${totalBeds} ${totalBeds > 1 ? "Beds" : "Bed"} (${bedDescription})`}
      guests={(room.capacity?.adults || 0) + (room.capacity?.children || 0)}
      size={room.roomSizeSqm}
      amenities={room.amenities.map((a: string) => ({
        name: a,
        icon: a.toLowerCase().replace(/\s+/g, "_"),
      }))}
      roomsLeft={
        room.availableRooms !== undefined
          ? room.availableRooms
          : room.totalRooms
      }
      discountPercent={discountPercent}
      isBookingMode={isBookingMode}
    />
  );
};