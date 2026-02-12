import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabscn";
import { HotelRoomCard } from "./room-card";
import { RoomType } from "@/types";

export function RoomsBedTabs({ roomTypes }: { roomTypes: RoomType[] }) {

  const capacities = Array.from(
    new Set(roomTypes.map((r) => r.capacity.adults)),
  ).sort((a, b) => a - b);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="bg-transparent gap-4">
        <TabsTrigger className="rounded-full bg-card min-w-[100px]" value="all">
          All Rooms
        </TabsTrigger>
        {capacities.map((cap) => (
          <TabsTrigger
            className="rounded-full bg-card min-w-[100px]"
            key={cap}
            value={cap.toString()}
          >
            {cap} Adults
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all" className="w-full flex flex-col gap-4">
        {roomTypes.map((room) => (
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
            dubleBeds={room.bedType.toLowerCase().includes("double") ? 1 : 0}
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
                    ((room.basePrice - room.discountPrice) / room.basePrice) *
                      100,
                  )
                : 0
            }
          />
        ))}
      </TabsContent>

      {capacities.map((cap) => (
        <TabsContent
          key={cap}
          value={cap.toString()}
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
        </TabsContent>
      ))}
    </Tabs>
  );
}
