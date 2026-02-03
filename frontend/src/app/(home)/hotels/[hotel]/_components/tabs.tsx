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

const Rooms = () => {
    return <RoomsBedTabs/>
};
const Location = () => {
    return (
        <MapLocation map='/map.png'/>
    )
}
const Amenities = () => {
    return (
        <AmenitiesValues/>
    )
}
const Header =()=>{
    return (
        <LayoutGridDemo/>
    )
}
type TabKey =
  | "overview"
  | "reviews"
  | "location"
  | "rooms"
  | "amenities";


export function TabsLine({ values }: { values: {
  title: TabKey;
  id:number
}[] }) {
  const content: Record<TabKey, React.ReactNode> = {
  overview: (
    <>
      <Header />
      <Amenities />
      <Location />
      <Rooms />
    </>
  ),
  reviews: <Header />,      // real component
  location: <Location />,
  rooms: <Rooms />,
  amenities: <Amenities />,
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
    <TabsContent key={tab.id} value={tab.title} className="flex flex-col gap-4">
      {content[tab.title]}
    </TabsContent>
  ))}
</Tabs>

  );
}
