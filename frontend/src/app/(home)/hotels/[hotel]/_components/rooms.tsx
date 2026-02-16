import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabscn";
import { HotelRoomCard } from "./room-card";
import { Hotel, RoomType } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useHotelStore } from "@/store/hotel.store";
import { useRoomsQuery } from "@/services/querys";

export const RoomsMain = ({ hotel }: { hotel: Hotel }) => {
  const { hotel: currentHotel, setHotel, hotel: hotelData, guests, date } = useHotelStore();

  useEffect(() => {
    if (currentHotel.id !== hotel._id) {
      setHotel({ ...currentHotel, id: hotel._id });
    }
  }, [hotel._id, currentHotel, setHotel]);
  return (
    <Card className="w-full bg-transparent border-none shadow-none">
      <CardHeader>
        <h3 className="text-xl font-bold"> Rooms</h3>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <RoomsBedTabs roomTypes={hotel.roomTypes || []} />
      </CardContent>
    </Card>
  );
};
export function RoomsBedTabs({ roomTypes }: { roomTypes: RoomType[] }) {
  const { hotel: hotelData, guests, date } = useHotelStore();
  // const { data: newRoomsData, refetch, isLoading, isError, isRefetching } = useRoomsQuery({
  //   hotelId: hotelData.id,
  //   checkIn: date?.from,
  //   checkOut: date?.to,
  //   adults: guests.adults,
  //   children: guests.children,
  // })


  const capacities = Array.from(
    new Set(roomTypes.map((r) => r.capacity.adults)),
  ).sort((a, b) => a - b);

  return (
    <div defaultValue="all" className="w-full">
      <div className="bg-transparent gap-4 flex gap-3 py-2 px-4">
        <Button className=" rounded-full bg-card min-w-[100px] border border-border justify-center items-center cursor-pointer" variant="ghost">
          All Rooms
        </Button>
        {capacities.map((cap) => (
          <Button
            variant="ghost"
            className="rounded-full bg-card min-w-[100px] border border-border justify-center items-center cursor-pointer"
            key={cap}

          >
            {cap} {cap === 1 ? "adult" : "adults"}
          </Button>
        ))}
      </div>



      {capacities.map((cap) => (
        <div
          key={cap}

          className="w-full flex flex-col gap-4"
        >
          {roomTypes
            .filter((r) => r.capacity.adults === cap)
            .map((room) => (
              <HotelRoomCard
                key={room._id}
                id={room._id}
                title={room.name}
                imageUrl={room.images[0] || "/img1.png"}
                originalPrice={room.basePrice}
                discountedPrice={room.discountPrice}
                totalPrice={room.finalPrice}
                nights={1}
                rating={5.0}
                reviewCount={0}
                dubleBeds={
                  room.bedType.toLowerCase().includes("double") ? 1 : 0
                }
                beds={
                  room.bedType.toLowerCase().includes("king") ||
                    room.bedType.toLowerCase().includes("queen")
                    ? 1
                    : room.capacity.adults
                }
                guests={room.capacity.adults + room.capacity.children}
                size={room.roomSizeSqm}
                amenities={room.amenities.map((a) => ({
                  name: a,
                  icon: a.toLowerCase().replace(/\s+/g, "_"),
                }))}
                roomsLeft={room.availableRooms}
                discountPercent={
                  room.basePrice > room.discountPrice
                    ? Math.round(
                      ((room.basePrice - room.discountPrice) /
                        room.basePrice) *
                      100,
                    )
                    : 0
                }
              />
            ))}
        </div>
      ))}
    </div>
  );
}
