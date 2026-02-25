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

// "use client";

// import { IconShare, IconStarFilled, IconMapPin } from "@tabler/icons-react";
// import React, { useEffect, useState } from "react";
// import { TabsLine } from "./tabs";
// import { Hotel, RoomType } from "@/types";
// import { handleCopy, LikeIcon } from "@/services/dailyfunctions";
// import { cn } from "@/lib/utils";

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
//   const [hasToken, setHasToken] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("accesstoken");
//     setHasToken(!!token);
//   }, []);

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-8 animate-in fade-in duration-700">
//       {/* Upper Navigation / Breadcrumb style info */}
//       <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
//         <span>Hotels</span>
//         <span>/</span>
//         <span>{hotel.city}</span>
//         <span>/</span>
//         <span className="text-primary truncate">{hotel.name}</span>
//       </div>

//       <div className="flex flex-col gap-6">
//         {/* Main Header Row */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
          
//           <div className="space-y-3 flex-1">
//             {/* Title & Rating */}
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//               <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter fo">
//                 {hotel.name}
//               </h1>
              
//               <div className="flex items-center self-start bg-black/[0.03] dark:bg-white/[0.05] px-3 py-1.5 rounded-full border border-border/50">
//                 <IconStarFilled className="text-yellow-500 h-4 w-4" />
//                 <span className="ml-1.5 text-sm font-bold">{hotel.rating}</span>
//                 <span className="ml-1 text-sm text-muted-foreground font-medium">
//                   (50+ Reviews)
//                 </span>
//               </div>
//             </div>

//             {/* Location with Icon */}
//             <div className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer group w-fit">
//               <IconMapPin size={18} className="group-hover:animate-bounce" />
//               <p className="text-sm md:text-base font-medium underline underline-offset-4 decoration-border group-hover:decoration-primary">
//                 {hotel.address}, {hotel.city}
//               </p>
//             </div>
//           </div>

//           {/* Action Buttons: Minimalist & Professional */}
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center h-11 w-11 rounded-xl border border-border bg-background hover:bg-muted transition-all cursor-pointer shadow-sm">
//                <LikeIcon _id={hotel._id} isFavourite={hotel.isFavorite} name={hotel.name}/>
//             </div>

//             <button
//               onClick={handleCopy}
//               className="flex items-center gap-2 px-5 h-11 rounded-xl border border-border bg-background hover:bg-muted transition-all shadow-sm font-semibold text-sm active:scale-95"
//             >
//               <IconShare size={18} className="text-muted-foreground" />
//               <span className="hidden sm:inline">Share</span>
//             </button>
            
//             {/* Premium CTA Shortcut (Optional Visual Enhancement) */}
//             <button className="hidden lg:flex items-center justify-center px-6 h-11 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
//                Reserve Now
//             </button>
//           </div>
//         </div>

//         {/* Tabs Section - Sticky on Scroll for better UX */}
//         <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md pt-2">
//           <div className="w-full">
//             <TabsLine
//               hotel={hotel}
//               rooms={rooms}
//               isBookingMode={isBookingMode}
//               isAvailabilityLoading={isAvailabilityLoading}
//               values={[
//                 { title: "overview", id: 1 },
//                 { title: "description", id: 2 },
//                 { title: "amenities", id: 3 },
//                 { title: "location", id: 4 },
//                 { title: "rooms", id: 5 },
//                 { title: "reviews", id: 6 },
//               ]}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HotelItems;



"use client";

import { IconShare, IconStarFilled } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { TabsLine } from "./tabs";
import { Hotel, RoomType } from "@/types";
import { handleCopy, LikeIcon } from "@/services/dailyfunctions";

type HotelItemsProps = {
  hotel: Hotel;
  // rooms: RoomType[];
  isBookingMode: boolean;
  isAvailabilityLoading: boolean;
};

const HotelItems = ({
  hotel,
  // rooms,
  isBookingMode,
  isAvailabilityLoading,
}: HotelItemsProps) => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    setHasToken(!!token);
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full md:py-8">
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
            <LikeIcon _id={hotel._id} isFavourite={hotel.isFavorite} name={hotel.name}/>


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
          // rooms={rooms}
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