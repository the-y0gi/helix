// import { RoomsBedTabs, RoomsMain } from "./rooms";
// import MapLocation from "./Location";
// import AmenitiesValues from "./amanities";
// import { Decription } from "./description";
// import { LayoutGridDemo } from "./imsges";
// import { Hotel } from "@/types";
// import ReviewsMain from "./reviews";
// import { Card, CardContent } from "@/components/ui/card";
// import { HotelPolicies } from "./policies";
// import { BookingCalender, HotelCalender } from "./calander-booking";
// import { useEffect, useRef, useState } from "react";
// import React from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";

// const Reviews = ({ hotel }: { hotel: Hotel }) => {
//   return <ReviewsMain hotel={hotel} />;
// };

// const Rooms = ({ hotel }: { hotel: Hotel }) => {
//   return <RoomsMain hotel={hotel} />;
// };

// const Location = ({ hotel }: { hotel: Hotel }) => {
//   return <MapLocation address={hotel.address} map="/map.png" />;
// };

// const Amenities = ({ hotel }: { hotel: Hotel }) => {
//   return <AmenitiesValues amenities={hotel.amenities} />;
// };

// const Header = ({ hotel }: { hotel: Hotel }) => {
//   return <LayoutGridDemo images={hotel.images} />;
// };

// type TabKey =
//   | "overview"
//   | "description"
//   | "location"
//   | "rooms"
//   | "amenities"
//   | "reviews";

// export function TabsLine({
//   values,
//   hotel,
// }: {
//   values: {
//     title: TabKey;
//     id: number;
//   }[];
//   hotel: Hotel;
// }) {
//   const content: Record<TabKey, React.ReactNode> = {
//     overview: <Header hotel={hotel} />,
//     description: <Decription hotel={hotel} />,
//     reviews: <Reviews hotel={hotel} />,
//     location: <Location hotel={hotel} />,
//     rooms: <Rooms hotel={hotel} />,
//     amenities: <Amenities hotel={hotel} />,
//   };

//   const tabItems = values.filter(
//     (tab) =>
//       tab.title === "description" ||
//       tab.title === "amenities" ||
//       tab.title === "location",
//   );

//   return (
//     <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-10 xl:px-16">
//       <div className="sticky top-0 z-30 bg-card border-b h-20 md:h-[86px] flex items-center -mx-4 md:-mx-6 lg:-mx-10 xl:-mx-16 px-4 md:px-6 lg:px-10 xl:px-16">
//         <div className="flex gap-6 md:gap-8 lg:gap-10">
//           {values.map((tab) => (
//             <a
//               key={tab.id}
//               href={`#${tab.title}`}
//               onClick={(e) => {
//                 e.preventDefault();
//                 document.getElementById(tab.title)?.scrollIntoView({
//                   behavior: "smooth",
//                   block: "center",
//                 });
//               }}
//               className="capitalize pb-3 md:pb-4 border-b-2 border-transparent hover:border-primary data-[state=active]:border-primary cursor-pointer text-sm md:text-base font-medium transition-colors"
//             >
//               {tab.title}
//             </a>
//           ))}
//         </div>
//       </div>

//       <section
//         id="overview"
//         className="py-6 md:py-8 lg:py-10 w-full overflow-hidden"
//       >
//         {content.overview}
//       </section>

//       <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
//         <main className="flex-1 min-w-0 py-6 lg:py-10 space-y-10 lg:space-y-16 w-full">
//           {tabItems.map((tab) => (
//             <section
//               key={tab.id}
//               id={tab.title}
//               className="scroll-mt-28 lg:scroll-mt-32 w-full overflow-hidden"
//             >
//               {content[tab.title]}
//             </section>
//           ))}
//         </main>

//         <aside className="hidden   lg:block lg:w-[320px] xl:w-[360px] flex-shrink-0 pt-6 lg:pt-10">
//           <div className="sticky top-24 lg:top-28 z-10">
//             <BookingCard hotel={hotel} />
//           </div>
//         </aside>
//       </div>
//       <section
//         id="rooms"
//         className="py-6 md:py-8 lg:py-10 w-full overflow-hidden"
//       >
//         {content.rooms}
//       </section>
//       <section
//         id="reviews"
//         className="py-6 md:py-8 lg:py-10 w-full overflow-hidden"
//       >
//         {content.reviews}
//       </section>
//       <HotelPolicies />
//     </div>
//   );
// }

// import { format } from "date-fns";

// function BookingCard({hotel}: {hotel: Hotel}) {
//   const { date, guests } = useHotelStore();

//   const [showCalendar, setShowCalendar] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setShowCalendar(false);
//       }
//     }

//     if (showCalendar) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showCalendar]);

//   const { data: hotelData, isLoading } = useHotelQuery({
//     hotelId: hotel.id,
//     checkIn: date?.from,
//     checkOut: date?.to,
//     adults: guests.adults,
//     children: guests.children,
//   });

//   const roomTypes = hotelData?.roomTypes || [];

//   const minPrice =
//     roomTypes.length > 0
//       ? Math.min(...roomTypes.map((r) => r.finalPrice))
//       : null;

//   const nights = roomTypes[0]?.nights || 0;

//   return (
//     <Card className="border shadow-xl rounded-2xl bg-card w-full max-w-md">
//       <CardContent className="p-6 space-y-6">
//         {/* Calendar */}
//         <div ref={containerRef} className="relative rounded-xl border">
//           {showCalendar && (
//             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 bg-popover border rounded-xl shadow-2xl w-full max-w-md">
//               <HotelCalender className="p-4" />
//             </div>
//           )}

//           <div
//             className="grid grid-cols-3 gap-4 p-4 cursor-pointer"
//             onClick={() => setShowCalendar((prev) => !prev)}
//           >
//             <div>
//               <h4 className="font-semibold text-base">Check-in</h4>
//               <p className="text-sm text-muted-foreground mt-1">
//                 {date?.from ? format(date.from, "dd/MM/yyyy") : ""}
//               </p>
//             </div>

//             <div className="flex justify-center">
//               <div className="w-px h-full bg-border" />
//             </div>

//             <div>
//               <h4 className="font-semibold text-base">Check-out</h4>
//               <p className="text-sm text-muted-foreground mt-1">
//                 {date?.to ? format(date.to, "dd/MM/yyyy") : ""}
//               </p>
//             </div>
//           </div>

//           <div className="border-t border-border"></div>

//           <div className="mt-3 px-4">
//             <VisitorsMembers showCalendar={showCalendar} />
//           </div>
//         </div>

//         {/* Pricing */}
//         {isLoading && <p>Checking availability...</p>}

//         {!isLoading && minPrice && (
//           <div className="space-y-1">
//             <p className="font-medium text-base">Prices start from</p>
//             <p className="text-2xl font-bold text-primary">
//               ₹{minPrice} <span className="text-lg font-normal">/ night</span>
//             </p>
//             {nights > 0 && (
//               <p className="text-sm text-muted-foreground">
//                 {nights} nights selected
//               </p>
//             )}
//           </div>
//         )}

//         {!isLoading && roomTypes.length === 0 && (
//           <p className="text-sm text-red-500">
//             No rooms available for selected dates.
//           </p>
//         )}

//         <Button
//           className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3.5"
//           onClick={() => {
//             document.getElementById("rooms")?.scrollIntoView({
//               behavior: "smooth",
//             });
//           }}
//         >
//           Show Rooms
//         </Button>

//         <p className="text-xs text-center text-muted-foreground pt-1">
//           You won’t be charged yet
//         </p>
//       </CardContent>
//     </Card>
//   );
// }

// export default BookingCard;

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { HotelCounters } from "@/components/side-bar-filter/hotel/HotelPileGroup";
// import { CounterWithoutQuery } from "@/components/side-bar-filter/counter";
// import { useHotelStore } from "@/store/hotel.store";
// import { PaymentProps } from "@/schema/payment.schema";
// import { IconStarFilled } from "@tabler/icons-react";
// import { rating } from "@/config/rating";
// import { useForm, UseFormReturn } from "react-hook-form";
// import { useHotelQuery, useRoomsQuery } from "@/services/querys";
// export function VisitorsMembers({
//   showCalendar,
//   methods,
// }: {
//   showCalendar: boolean;
//   methods?: UseFormReturn<PaymentProps>;
// }) {
//   return (
//     <Accordion
//       type="single"
//       collapsible
//       className="max-w-lg"
//       style={{ display: showCalendar ? "none" : "block" }}
//     >
//       <AccordionItem value="rooms and guests">
//         <AccordionTrigger>rooms and guests</AccordionTrigger>
//         <AccordionContent>
//           <HotelVisitorsCounters
//             values={["adults", "children"]}
//             methods={methods}
//           />
//         </AccordionContent>
//       </AccordionItem>
//     </Accordion>
//   );
// }
// export const HotelVisitorsCounters = ({
//   values,
//   methods,
// }: {
//   values: string[];
//   methods?: UseFormReturn<PaymentProps>;
// }) => {
//   const { guests, setGuests } = useHotelStore();

//   const handleStoreChange = (key: string, val: number) => {
//     setGuests({ ...guests, [key]: val });
//   };

//   return (
//     <div className="flex flex-col  gap-2">
//       {values.map((opt) => (
//         <CounterWithoutQuery
//           key={opt}
//           label={opt}
//           methods={methods}
//           fieldName={methods ? `guests.${opt}` : undefined}
//           value={methods ? undefined : (guests as any)[opt]}
//           onChange={methods ? undefined : (val) => handleStoreChange(opt, val)}
//         />
//       ))}
//     </div>
//   );
// };

"use client";

import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Hotel, RoomType } from "@/types";
import { useHotelStore } from "@/store/hotel.store";

import { LayoutGridDemo } from "./imsges";
import { Decription } from "./description";
import AmenitiesValues from "./amanities";
import MapLocation from "./Location";
import ReviewsMain from "./reviews";
import { HotelPolicies } from "./policies";
import { RoomsMain } from "./rooms";
import { HotelCalender } from "./calander-booking";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { CounterWithoutQuery } from "@/components/side-bar-filter/counter";
import { PaymentProps } from "@/schema/payment.schema";
import { UseFormReturn } from "react-hook-form";

type TabKey =
  | "overview"
  | "description"
  | "location"
  | "rooms"
  | "amenities"
  | "reviews";

export function TabsLine({
  values,
  hotel,
  rooms,
  isBookingMode,
  isAvailabilityLoading,
}: any) {
  const hotelId = hotel._id;
  if (!hotel) return null;

  const content: Record<TabKey, React.ReactNode> = {
    overview: <LayoutGridDemo images={hotel.images} />,
    description: <Decription hotel={hotel} />,
    location: <MapLocation address={hotel.address} map="/map.png" />,
    amenities: <AmenitiesValues amenities={hotel.amenities} />,
    reviews: <ReviewsMain hotel={hotel} />,
    rooms: (
      <RoomsMain
        hotelId={hotelId}
        rooms={rooms}
        isBookingMode={isBookingMode}
        isLoading={isAvailabilityLoading}
      />
    ),
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-10">
      {/* 1. Top Section */}
      <section id="overview" className="py-6">
        {content.overview}
      </section>

      {/* 2. Sticky Navbar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b h-16 flex items-center -mx-4 px-4 md:px-6 lg:px-10 mb-8">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {values.map((tab: any) => (
            <a
              key={tab.id}
              href={`#${tab.title}`}
              className="capitalize whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-orange-500 text-sm font-semibold transition-all text-slate-600 hover:text-slate-900"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(tab.title)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {tab.title}
            </a>
          ))}
        </div>
      </div>

      {/* 3. Split Section (Upper Part Only) */}
      <div className="flex flex-col lg:flex-row lg:gap-12 mb-16">
        <main className="flex-1 space-y-12">
          <section id="description" className="scroll-mt-24">
            {content.description}
          </section>
          <section id="amenities" className="scroll-mt-24 border-t pt-10">
            <h3 className="text-xl font-bold mb-6">Amenities</h3>
            {content.amenities}
          </section>
          <section id="location" className="scroll-mt-24 border-t pt-10">
            <h3 className="text-xl font-bold mb-6">Location</h3>
            {content.location}
          </section>
        </main>

        <aside className="lg:w-[380px] flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <BookingCard
              rooms={rooms}
              isBookingMode={isBookingMode}
              isLoading={isAvailabilityLoading}
            />
          </div>
        </aside>
      </div>

      {/* 4. Full Width Rooms Section (Moved outside the split grid) */}
      <section id="rooms" className="scroll-mt-24 border-t pt-16 mb-16 w-full">
        <div className="mb-8 text-left">
          <h3 className="text-2xl font-bold">Available Rooms</h3>
          <p className="text-slate-500 text-sm">
            Choose the best room that fits your needs
          </p>
        </div>
        {content.rooms}
      </section>

      <section id="reviews" className="py-16 border-t mt-16">
        {content.reviews}
      </section>
      <HotelPolicies />
    </div>
  );
}

function BookingCard({ rooms, isBookingMode, isLoading }: any) {
  const { date, guests } = useHotelStore();
  const [showCalendar, setShowCalendar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // NaN Fix: Validating prices
  const validPrices = rooms
    .map((r: any) => r.finalPrice || r.displayPrice || r.totalPrice)
    .filter((p: any) => typeof p === "number" && !isNaN(p));

  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;

  // Calendar toggle function - Most Important Fix
  const handleToggleCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Event bubbling rokne ke liye
    setShowCalendar((prev) => !prev);
  };

  // Click Outside Fix: Calendar tabhi band hoga jab bahar click ho
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <Card className="border shadow-2xl rounded-[32px] bg-white overflow-visible relative">
      <CardContent className="p-6 space-y-6">
        {/* Date Selection Box */}
        <div
          ref={containerRef}
          className="relative rounded-2xl border border-slate-200 divide-x flex overflow-visible bg-white z-50"
        >
          {/* Check-in Box */}
          <div
            className="flex-1 p-4 hover:bg-slate-50 cursor-pointer transition rounded-l-2xl"
            onClick={handleToggleCalendar}
          >
            <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">
              Check-in
            </span>
            <p className="text-sm font-bold text-slate-800">
              {date?.from ? format(date.from, "dd/MM/yyyy") : "Add date"}
            </p>
          </div>

          {/* Check-out Box */}
          <div
            className="flex-1 p-4 hover:bg-slate-50 cursor-pointer transition rounded-r-2xl"
            onClick={handleToggleCalendar}
          >
            <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">
              Check-out
            </span>
            <p className="text-sm font-bold text-slate-800">
              {date?.to ? format(date.to, "dd/MM/yyyy") : "Add date"}
            </p>
          </div>

          {/* Calendar Dropdown - High Z-Index & Absolute Positioning */}
          {showCalendar && (
            <div
              className="absolute top-full left-0 right-0 mt-3 z-[1000] bg-white border shadow-2xl rounded-2xl p-2 min-w-[320px]"
              style={{ filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))" }}
              onClick={(e) => e.stopPropagation()} // Calendar ke andar click se band na ho
            >
              <HotelCalender />
            </div>
          )}
        </div>

        {/* Rooms & Guests Accordion */}
        <div className="rounded-2xl border border-slate-200 p-1">
          <VisitorsMembers showCalendar={showCalendar} />
        </div>

        {/* Pricing Display */}
        <div className="py-2">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">
            Prices
          </p>
          {isLoading ? (
            <div className="animate-pulse h-8 w-32 bg-slate-100 rounded" />
          ) : (
            <p className="text-2xl font-black text-slate-900">
              {minPrice > 0 ? `₹${minPrice} to ₹${maxPrice}` : "Select dates"}
            </p>
          )}
        </div>

        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 rounded-2xl text-lg shadow-lg shadow-orange-100 transition-all active:scale-[0.98]"
          onClick={() => {
            const el = document.getElementById("rooms");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Show Rooms
        </Button>

        <p className="text-[11px] text-center text-slate-400 font-medium italic">
          Best price guaranteed • No hidden fees
        </p>
      </CardContent>
    </Card>
  );
}

export function VisitorsMembers({
  showCalendar,
  methods,
}: {
  showCalendar: boolean;
  methods?: UseFormReturn<PaymentProps>;
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className="max-w-lg"
      style={{ display: showCalendar ? "none" : "block" }}
    >
      <AccordionItem value="rooms and guests">
        <AccordionTrigger>rooms and guests</AccordionTrigger>
        <AccordionContent>
          <HotelVisitorsCounters
            values={["adults", "children"]}
            methods={methods}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export const HotelVisitorsCounters = ({
  values,
  methods,
}: {
  values: string[];
  methods?: UseFormReturn<PaymentProps>;
}) => {
  const { guests, setGuests } = useHotelStore();

  const handleStoreChange = (key: string, val: number) => {
    setGuests({ ...guests, [key]: val });
  };

  return (
    <div className="flex flex-col  gap-2">
      {values.map((opt) => (
        <CounterWithoutQuery
          key={opt}
          label={opt}
          methods={methods}
          fieldName={methods ? `guests.${opt}` : undefined}
          value={methods ? undefined : (guests as any)[opt]}
          onChange={methods ? undefined : (val) => handleStoreChange(opt, val)}
        />
      ))}
    </div>
  );
};

export default BookingCard;
