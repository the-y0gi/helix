import {
  IconHeart,
  IconShare,
  IconStarFilled,
  IconTagFilled,
} from "@tabler/icons-react";
import React from "react";
import { TabsLine } from "./tabs";
import { RoomsBedTabs } from "./rooms";

// const Rooms = () => {
//   <RoomsBedTabs />;
// };

import { Hotel } from "@/types";

type HotelItemsProps = {
  hotel: Hotel;
};

const HotelItems = ({ hotel }: HotelItemsProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{hotel.name}</h1>

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <IconStarFilled
                  key={i}
                  color={i < Math.round(hotel.rating) ? "gold" : "gray"}
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

        <p className="text-sm text-muted-foreground line-clamp-2">
          {hotel.description}
        </p>
      </div>

      <div className="border-t pt-4 ">
        <TabsLine
          hotel={hotel}
          values={[
            {
              title: "overview",
              id: 1,
            },
            {
              title: "description",
              id: 2,
            },
            {
              id: 3,
              title: "amenities",
            },
            {
              id: 4,
              title: "location",
            },
            {
              id: 5,
              title: "rooms",
            },
            {
              id: 6,
              title: "reviews",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default HotelItems;
