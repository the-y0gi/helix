
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabscn";
import { HotelRoomCard, type RoomCardProps } from "./room-card";
const data: { beds: number }[] = [
  {
    beds: 1,
  },
  {
    beds: 2,
  },
  {
    beds: 3,
  },
];
export function RoomsBedTabs() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="bg-transparent gap-4">
        <TabsTrigger
          className="rounded-full w-20 bg-card w-[400px]"
          value="all"
        >
          All Beds
        </TabsTrigger>
        {data.map((bed) => (
          <TabsTrigger
            className="rounded-full w-20 bg-card"
            key={bed.beds}
            value={bed.beds.toString()}
          >
            {bed.beds} Beds
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="all" className="w-full flex flex-col gap-4">
        {[...Array(10)].map((_, i) => (
          <HotelRoomCard
          key={i}
          id={i.toString()}
            title="Superior Twin Room"
            imageUrl="/img1.png"
            originalPrice={350}
            discountedPrice={290}
            totalPrice={1450}
            nights={5}
            rating={5.0}
            reviewCount={1260}
            dubleBeds={2}
            beds={
                Math.floor(Math.random() * 4)%4 + 1
            }
            guests={2}
            size={30}
            amenities={[
              {
                name: "Breakfast",
                icon: "breakfast"
              },
              {
                name: "Free WiFi",
                icon: "wifi"
              },
              {
                name: "Sea View",
                icon: "ac"
              },
              {
                name: "No Smoking",
                icon: "no_smoking"
              },
              {
                name: "Air Conditioner",
                icon: "sea_view"
              },
            ]}
            roomsLeft={2}
            discountPercent={10}
          />
        ))}
      </TabsContent>
      {data.map((bed,i) => (
        <TabsContent key={bed.beds} value={bed.beds.toString()} className="w-full flex flex-col gap-4">
           {[...Array(10)].map((_, i) => (
          <HotelRoomCard
          key={i}
          id={i.toString()}
            title="Superior Twin Room"
            imageUrl="/img1.png"
            originalPrice={350}
            discountedPrice={290}
            totalPrice={1450}
            nights={5}
            rating={5.0}
            reviewCount={1260}
            dubleBeds={2}
            beds={
                Math.floor(Math.random() * 4)%4 + 1
            }
            guests={2}
            size={30}
            amenities={[
              {
                name: "Breakfast",
                icon: "breakfast"
              },
              {
                name: "Free WiFi",
                icon: "wifi"
              },
              {
                name: "Sea View",
                icon: "ac"
              },
              {
                name: "No Smoking",
                icon: "no_smoking"
              },
              {
                name: "Air Conditioner",
                icon: "sea_view"
              },
            ]}
            roomsLeft={2}
            discountPercent={10}
          />
        ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
