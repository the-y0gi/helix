import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-redix";
import { RoomsBedTabs } from "./rooms";
import MapLocation from "./Location";
import AmenitiesValues from "./amanities";
import { Decription } from "./description";
import { LayoutGridDemo } from "./imsges";
import { Hotel } from "@/types";

const Rooms = ({ hotel }: { hotel: Hotel }) => {
  return <RoomsBedTabs />;
};
const Location = ({ hotel }: { hotel: Hotel }) => {
  return <MapLocation address={hotel.address} map="/map.png" />;
};
const Amenities = ({ hotel }: { hotel: Hotel }) => {
  return <AmenitiesValues amenities={hotel.amenities} />;
};
const Header = ({ hotel }: { hotel: Hotel }) => {
  return <LayoutGridDemo images={hotel.images} />;
};
type TabKey = "overview" | "reviews" | "location" | "rooms" | "amenities";

export function TabsLine({
  values,
  hotel,
}: {
  values: {
    title: TabKey;
    id: number;
  }[];
  hotel: Hotel;
}) {
  const content: Record<TabKey, React.ReactNode> = {
    overview: (
      <>
        <Header hotel={hotel} />
        <Decription hotel={hotel} />
        <Amenities hotel={hotel} />
        <Location hotel={hotel} />
        <Rooms hotel={hotel} />
      </>
    ),
    reviews: <Header hotel={hotel} />, // real component
    location: <Location hotel={hotel} />,
    rooms: <Rooms hotel={hotel} />,
    amenities: <Amenities hotel={hotel} />,
  };

  return (
    <Tabs defaultValue="overview">
      <div className="bg-card h-[86px] flex items-center border-b px-20 -mx-20">
        <TabsList className="flex gap-4 bg-transparent" variant="line">
          {values.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.title}
              className="capitalize rounded-none border-b-2 border-transparent
                     data-[state=active]:border-primary"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {values.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.title}
          className="flex flex-col gap-4"
        >
          {content[tab.title]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
