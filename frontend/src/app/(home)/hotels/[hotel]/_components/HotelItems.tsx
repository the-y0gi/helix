import { IconHeart, IconShare, IconStarFilled, IconTagFilled } from "@tabler/icons-react";
import React from "react";
import { TabsLine } from "./tabs";
import { RoomsBedTabs } from "./rooms";


const Rooms=()=>{
    <RoomsBedTabs/>
}

type HotelItemsProps = {
  title: string;
  description: string;
  amenities: string[];
  location: string[];
  bednumber: number[];
};

const HotelItems = () => {
  return (
   <div className="flex flex-col gap-6">
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">
          Hotel Arts Goa
        </h1>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <IconStarFilled
              key={i}
              color="gold"
              size={14}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <IconHeart className="cursor-pointer text-red-500" size={20} />
        <IconShare className="cursor-pointer text-gray-600" size={20} />
      </div>
    </div>

    <p className="text-sm text-muted-foreground">
      Description
    </p>
  </div>

  <div className="border-t pt-4 ">
    <TabsLine 
    values={[
      {
        title:"overview",
        id:1,

      },{
        id:2,
        title:"amenities"
      },
      {
        id:3,
        title:"location"
      },{
        id:4,
        title:"rooms"
      },{
        id:5,
        title:"reviews"
      }
    ]}
    />
  </div>
</div>

  );
};

export default HotelItems;
