// import {
//   IconHeart,
//   IconShare,
//   IconStarFilled,
//   IconTagFilled,
// } from "@tabler/icons-react";
// import React from "react";
// import { TabsLine } from "./tabs";
// import { RoomsBedTabs } from "./rooms";

// // const Rooms = () => {
// //   <RoomsBedTabs />;
// // };

// import { Hotel, RoomType } from "@/types";

// type HotelItemsProps = {
//   hotel: Hotel;
//   rooms: RoomType[];
//   isBookingMode: boolean;
//   isAvailabilityLoading: boolean;
// };

// const HotelItems = ({
//   hotel,
//   rooms,
//   isBookingMode,
//   isAvailabilityLoading,
// }: HotelItemsProps) => {
//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex flex-col gap-1">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <h1 className="text-xl font-semibold">{hotel.name}</h1>

//             <div className="flex items-center gap-1">
//               {[...Array(5)].map((_, i) => (
//                 <IconStarFilled
//                   key={i}
//                   color={i < Math.round(hotel.rating) ? "gold" : "gray"}
//                   size={14}
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <IconHeart className="cursor-pointer text-red-500" size={20} />
//             <IconShare className="cursor-pointer text-gray-600" size={20} />
//           </div>
//         </div>

//         <p className="text-sm text-muted-foreground line-clamp-2">
//           {hotel.description}
//         </p>
//       </div>

//       <div className="border-t pt-4 ">
//         <TabsLine
//           hotel={hotel}
//           rooms={rooms}
//           isBookingMode={isBookingMode}
//           isAvailabilityLoading={isAvailabilityLoading}
//           values={[
//             {
//               title: "overview",
//               id: 1,
//             },
//             {
//               title: "description",
//               id: 2,
//             },
//             {
//               id: 3,
//               title: "amenities",
//             },
//             {
//               id: 4,
//               title: "location",
//             },
//             {
//               id: 5,
//               title: "rooms",
//             },
//             {
//               id: 6,
//               title: "reviews",
//             },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// export default HotelItems;

"use client";

import { IconHeart, IconShare, IconStarFilled } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { TabsLine } from "./tabs";
import { Hotel, RoomType } from "@/types";
import { handleCopy, LikeIcon } from "@/services/dailyfunctions";
import { Sign_in_hover } from "@/components/auth/_components/sign-in-hover";

type HotelItemsProps = {
  hotel: Hotel;
  rooms: RoomType[];
  isBookingMode: boolean;
  isAvailabilityLoading: boolean;
};

const HotelItems = ({
  hotel,
  rooms,
  isBookingMode,
  isAvailabilityLoading,
}: HotelItemsProps) => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    setHasToken(!!token);
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {hotel.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <IconStarFilled
                  key={i}
                  className={
                    i < Math.round(hotel.rating)
                      ? "text-yellow-400"
                      : "text-muted"
                  }
                  size={18}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LikeIcon _id={hotel._id} />


            <button
              className="p-2.5 hover:bg-muted rounded-full transition-all group"
              onClick={handleCopy}
            >
              <IconShare
                className="text-muted-foreground group-hover:text-primary transition-colors"
                size={24}
              />
            </button>
          </div>
        </div>

        {/* Location */}
        <p className="text-sm font-medium text-muted-foreground">
          {hotel.address}, {hotel.city}
        </p>
      </div>

      <div className="w-full border-t border-border pt-2">
        <TabsLine
          hotel={hotel}
          rooms={rooms}
          isBookingMode={isBookingMode}
          isAvailabilityLoading={isAvailabilityLoading}
          values={[
            { title: "overview", id: 1 },
            { title: "description", id: 2 },
            { title: "amenities", id: 3 },
            { title: "location", id: 4 },
            { title: "rooms", id: 5 },
            { title: "reviews", id: 6 },
          ]}
        />
      </div>
    </div>
  );
};

export default HotelItems;
