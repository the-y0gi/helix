// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabscn";
// import { HotelRoomCard } from "./room-card";
// import { Hotel, RoomType } from "@/types";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useEffect } from "react";
// import { useHotelStore } from "@/store/hotel.store";
// import { useRoomsQuery } from "@/services/querys";

// // export const RoomsMain = ({ hotel }: { hotel: Hotel }) => {
// //   const { hotel: currentHotel, setHotel, hotel: hotelData, guests, date } = useHotelStore();

// //   useEffect(() => {
// //     if (currentHotel.id !== hotel._id) {
// //       setHotel({ ...currentHotel, id: hotel._id });
// //     }
// //   }, [hotel._id, currentHotel, setHotel]);
// //   return (
// //     <Card className="w-full bg-transparent border-none shadow-none">
// //       <CardHeader>
// //         <h3 className="text-xl font-bold"> Rooms</h3>
// //       </CardHeader>
// //       <CardContent className="flex flex-wrap gap-4">
// //         <RoomsBedTabs roomTypes={hotel.roomTypes || []} />
// //       </CardContent>
// //     </Card>
// //   );
// // };
// // export function RoomsBedTabs({ roomTypes }: { roomTypes: RoomType[] }) {
// //   const { hotel: hotelData, guests, date } = useHotelStore();
// //   // const { data: newRoomsData, refetch, isLoading, isError, isRefetching } = useRoomsQuery({
// //   //   hotelId: hotelData.id,
// //   //   checkIn: date?.from,
// //   //   checkOut: date?.to,
// //   //   adults: guests.adults,
// //   //   children: guests.children,
// //   // })

// //   const capacities = Array.from(
// //     new Set(roomTypes.map((r) => r.capacity.adults)),
// //   ).sort((a, b) => a - b);

// //   return (
// //     <div defaultValue="all" className="w-full">
// //       <div className="bg-transparent gap-4 flex gap-3 py-2 px-4">
// //         <Button className=" rounded-full bg-card min-w-[100px] border border-border justify-center items-center cursor-pointer" variant="ghost">
// //           All Rooms
// //         </Button>
// //         {capacities.map((cap) => (
// //           <Button
// //             variant="ghost"
// //             className="rounded-full bg-card min-w-[100px] border border-border justify-center items-center cursor-pointer"
// //             key={cap}

// //           >
// //             {cap} {cap === 1 ? "adult" : "adults"}
// //           </Button>
// //         ))}
// //       </div>

// //       {capacities.map((cap) => (
// //         <div
// //           key={cap}

// //           className="w-full flex flex-col gap-4"
// //         >
// //           {roomTypes
// //             .filter((r) => r.capacity.adults === cap)
// //             .map((room) => (
// //               <HotelRoomCard
// //                 key={room._id}
// //                 id={room._id}
// //                 title={room.name}
// //                 imageUrl={room.images[0] || "/img1.png"}
// //                 originalPrice={room.basePrice}
// //                 discountedPrice={room.discountPrice}
// //                 totalPrice={room.finalPrice}
// //                 nights={1}
// //                 rating={5.0}
// //                 reviewCount={0}
// //                 dubleBeds={
// //                   room.bedType.toLowerCase().includes("double") ? 1 : 0
// //                 }
// //                 beds={
// //                   room.bedType.toLowerCase().includes("king") ||
// //                     room.bedType.toLowerCase().includes("queen")
// //                     ? 1
// //                     : room.capacity.adults
// //                 }
// //                 guests={room.capacity.adults + room.capacity.children}
// //                 size={room.roomSizeSqm}
// //                 amenities={room.amenities.map((a) => ({
// //                   name: a,
// //                   icon: a.toLowerCase().replace(/\s+/g, "_"),
// //                 }))}
// //                 roomsLeft={room.availableRooms}
// //                 discountPercent={
// //                   room.basePrice > room.discountPrice
// //                     ? Math.round(
// //                       ((room.basePrice - room.discountPrice) /
// //                         room.basePrice) *
// //                       100,
// //                     )
// //                     : 0
// //                 }
// //               />
// //             ))}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// export const RoomsMain = ({ hotel }: { hotel: Hotel }) => {
//   return (
//     <Card className="w-full bg-transparent border-none shadow-none">
//       <CardHeader>
//         <h3 className="text-xl font-bold">Rooms</h3>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-6">
//         {/* <RoomsBedTabs roomTypes={hotel.roomTypes || []} /> */}
//         <RoomsBedTabs roomTypes={hotel.roomTypes || []} hotelId={hotel._id} />
//       </CardContent>
//     </Card>
//   );
// };

// export function RoomsBedTabs({
//   roomTypes,
//   hotelId,
// }: {
//   roomTypes: RoomType[];
//   hotelId: string;
// }) {
//   const capacities = Array.from(
//     new Set(roomTypes.map((r) => r.capacity.adults)),
//   ).sort((a, b) => a - b);

//   if (roomTypes.length === 0) {
//     return (
//       <p className="text-sm text-red-500">
//         No rooms available for selected dates.
//       </p>
//     );
//   }

//   return (
//     <div className="w-full flex flex-col gap-6">
//       {capacities.map((cap) => (
//         <div key={cap} className="flex flex-col gap-4">
//           {roomTypes
//             .filter((r) => r.capacity.adults === cap)
//             .map((room) => (
//               <HotelRoomCard
//                 key={room._id}
//                 hotelId={hotelId}
//                 id={room._id}
//                 title={room.name}
//                 imageUrl={room.images?.[0]?.url || "/img1.png"}
//                 originalPrice={room.basePrice}
//                 discountedPrice={room.finalPrice}
//                 totalPrice={room.totalPrice}
//                 nights={room.nights || 1}
//                 rating={5.0}
//                 reviewCount={0}
//                 dubleBeds={
//                   room.bedType?.toLowerCase().includes("double") ? 1 : 0
//                 }
//                 beds={
//                   room.bedType?.toLowerCase().includes("king") ||
//                   room.bedType?.toLowerCase().includes("queen")
//                     ? 1
//                     : room.capacity.adults
//                 }
//                 guests={room.capacity.adults + room.capacity.children}
//                 size={room.roomSizeSqm}
//                 amenities={room.amenities.map((a) => ({
//                   name: a,
//                   icon: a.toLowerCase().replace(/\s+/g, "_"),
//                 }))}
//                 roomsLeft={room.availableRooms}
//                 discountPercent={
//                   room.basePrice > room.finalPrice
//                     ? Math.round(
//                         ((room.basePrice - room.finalPrice) / room.basePrice) *
//                           100,
//                       )
//                     : 0
//                 }
//               />
//             ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabscn";
// import { HotelRoomCard } from "./room-card";
// import { Hotel, RoomType } from "@/types";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useEffect } from "react";
// import { useHotelStore } from "@/store/hotel.store";

// export const RoomsMain = ({
//   hotelId,
//   rooms,
//   isBookingMode,
//   isLoading,
// }: {
//   hotelId: string;
//   rooms: RoomType[];
//   isBookingMode: boolean;
//   isLoading: boolean;
// }) => {
//   return (
//     <Card className="w-full bg-transparent border-none shadow-none">
//       <CardHeader>
//         <h3 className="text-xl font-bold">Rooms</h3>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-6">
//         {/* <RoomsBedTabs roomTypes={hotel.roomTypes || []} /> */}
//         {isLoading && isBookingMode ? (
//           <p>Checking availability...</p>
//         ) : (
//           <RoomsBedTabs roomTypes={rooms} hotelId={hotelId} />
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export function RoomsBedTabs({
//   roomTypes,
//   hotelId,
// }: {
//   roomTypes: RoomType[];
//   hotelId: string;
// }) {
//   const capacities = Array.from(
//     new Set(roomTypes.map((r) => r.capacity.adults)),
//   ).sort((a, b) => a - b);

//   if (roomTypes.length === 0) {
//     return (
//       <p className="text-sm text-red-500">
//         No rooms available for selected dates.
//       </p>
//     );
//   }

//   return (
//     <div className="w-full flex flex-col gap-6">
//       {capacities.map((cap) => (
//         <div key={cap} className="flex flex-col gap-4">
//           {roomTypes
//             .filter((r) => r.capacity.adults === cap)
//             .map((room) => (
//               <HotelRoomCard
//                 key={room._id}
//                 hotelId={hotelId}
//                 id={room._id}
//                 title={room.name}
//                 imageUrl={room.images?.[0]?.url || "/img1.png"}
//                 originalPrice={room.basePrice}
//                 discountedPrice={room.finalPrice}
//                 totalPrice={room.totalPrice}
//                 nights={room.nights || 1}
//                 rating={5.0}
//                 reviewCount={0}
//                 dubleBeds={
//                   room.bedType?.toLowerCase().includes("double") ? 1 : 0
//                 }
//                 beds={
//                   room.bedType?.toLowerCase().includes("king") ||
//                   room.bedType?.toLowerCase().includes("queen")
//                     ? 1
//                     : room.capacity.adults
//                 }
//                 guests={room.capacity.adults + room.capacity.children}
//                 size={room.roomSizeSqm}
//                 amenities={room.amenities.map((a) => ({
//                   name: a,
//                   icon: a.toLowerCase().replace(/\s+/g, "_"),
//                 }))}
//                 roomsLeft={room.availableRooms}
//                 discountPercent={
//                   room.basePrice > room.finalPrice
//                     ? Math.round(
//                         ((room.basePrice - room.finalPrice) / room.basePrice) *
//                           100,
//                       )
//                     : 0
//                 }
//               />
//             ))}
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabscn";
import { HotelRoomCard } from "./room-card";
import { RoomType } from "@/types";
import { useHotelContext } from "../_providers_context/hotel-contextProvider";
import { useHotelStore } from "@/store/hotel.store";

export const RoomsMain = ({
  hotelId,
  rooms: f,
  isBookingMode,
  isLoading,
}: {
  hotelId: string;
  rooms: RoomType[];
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
            <div
              key={i}
              className="w-full h-[250px] bg-muted animate-pulse rounded-3xl"
            />
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
        {roomTypes?.map((room) => renderRoomCard(room, hotelId, isBookingMode))}
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
            .map((room) => renderRoomCard(room, hotelId, isBookingMode))}
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

export const renderRoomCard = (
  room: RoomType,
  hotelId: string,
  isBookingMode: boolean,
) => {
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
      showReserveButton={showReserveButton}
      key={room._id}
      hotelId={hotelId}
      id={room._id}
      title={room.name}
      imageUrl={
        typeof room.images?.[0] === "string"
          ? room.images[0]
          : room.images?.[0]?.url || "/img1.png"
      }
      originalPrice={originalPrice}
      discountedPrice={currentNightlyPrice}
      totalPrice={room.totalPrice}
      nights={room.nights || 1}
      rating={room.rating || 5.0}
      reviewCount={room.numReviews || 1245}
      beds={`${totalBeds} ${totalBeds > 1 ? "Beds" : "Bed"} (${bedDescription})`}
      guests={room.capacity.adults + room.capacity.children}
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
