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
import { useHotelContext } from "../_providers_context/hotel-contextProvider";
import SliderIfNotChooseDate from "../_providers_context/SliderIfNotChooseDate";
import GuestSelector from "@/components/filter-bar/newui-selectedCounter";
import { CometCard } from "@/components/ui/comet-card";
import { cn } from "@/lib/utils";

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
  isBookingMode,
  isAvailabilityLoading,
}: {
  values: { title: TabKey; id: number }[];
  hotel: Hotel;
  isBookingMode: boolean;
  isAvailabilityLoading: boolean;
}) {


  const hotelId = hotel._id;
  if (!hotel) return null;

  const content: Record<TabKey, React.ReactNode> = {
    overview: <LayoutGridDemo images={hotel.images} />,
    description: <Decription hotel={hotel} />,
    location: (
      <MapLocation
        address={hotel.address}
        cordinates={hotel.location.coordinates}
        map="/map.png"
      />
    ),
    amenities: <AmenitiesValues amenities={hotel.amenities} />,
    reviews: <ReviewsMain hotel={hotel} />,
    rooms: (
      <RoomsMain
        hotelId={hotelId}
        isBookingMode={isBookingMode}
        isLoading={isAvailabilityLoading}
      />
    ),
  };

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const handleClick = () =>
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-10">
      <section id="overview" className="py-3 -mx-5 md:mx-0">
        {content.overview}
      </section>
      <div className="z-30 sticky top-0 z-0 bg-white/50 dark:bg-background/30 backdrop-blur-md border-b border-t h-16 flex items-center -mx-4 px-4 md:px-6 mb-8">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {values.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.title}`}
              className="capitalize whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-orange-500 text-sm font-semibold transition-all text-slate-600 hover:text-slate-900 dark:hover:text-primary"
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
      <div className="flex flex-col lg:flex-row lg:gap-6 mb-5">
        <main className="flex-1 space-y-5">
          <section id="description" className=" py-2 gap-2">
            <h3 className="text-xl font-bold mb-2 dark:text-zinc-400 text-zinc-800">Description</h3>
            {content.description}
          </section>
          <section
            id="amenities"
            className="scroll-mt-16 border-t md:pt-3 pt-2"
          >
            {content.amenities}
          </section>
          <section
            id="location"
            className="scroll-mt-5 border-t md:pt-4 pt-5"
            ref={sectionRef}
          >
            {content.location}
          </section>
        </main>
        <aside className="lg:w-[380px] flex-shrink-0">

          <div className="lg:sticky lg:top-24">
            {/* <CometCard translateDepth={5}> */}
            <BookingCard
              isBookingMode={isBookingMode}
              isLoading={isAvailabilityLoading}
            />
            {/* </CometCard> */}
          </div>
        </aside>
      </div>
      <section
        id="rooms"
        className="scroll-mt-24 border-t md:pt-16 pt-6 md:mb-16 mb-5 w-full"
      >
        <div className="mb-8 text-left">
          <h3 className="text-2xl font-bold">Available Rooms</h3>
          <p className="text-slate-500 text-sm">
            Choose the best room that fits your needs
          </p>
        </div>
        <SliderIfNotChooseDate handleClick={handleClick}>
          {content.rooms}
        </SliderIfNotChooseDate>
      </section>
      <section
        id="reviews"
        className="py-5 border-t md:pt-5 pt-6 md:mb- mb-5"
      >
        {content.reviews}
      </section>
      <HotelPolicies id={hotelId} />
    </div>
  );
}

function BookingCard({
  isBookingMode,
  isLoading,
}: {
  isBookingMode: boolean;
  isLoading: boolean;
}) {
  const { date, guests } = useHotelStore();
  const [showCalendar, setShowCalendar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { FetchRoomTypes, rooms, setFetch } = useHotelContext();

  const validPrices = rooms
    .map((r: RoomType) => r.finalPrice || r.displayPrice || r.totalPrice)
    .filter((p): p is number => typeof p === "number" && !isNaN(p));

  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;

  const handleToggleCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCalendar((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      )
        setShowCalendar(false);
    };
    if (showCalendar)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  return (
    <Card className="border border-border shadow-xl rounded-2xl bg-background/90 text-foreground overflow-visible relative">
      <CardContent className="p-6 space-y-6">
        <div
          ref={containerRef}
          className="relative rounded-2xl border border-border divide-x divide-border flex overflow-visible bg-background z-1"
        >
          <div
            className="flex-1 p-4 hover:bg-muted cursor-pointer transition rounded-l-2xl"
            onClick={handleToggleCalendar}
          >
            <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">
              Check-in
            </span>
            <p className="text-sm font-bold text-foreground">
              {date?.from ? format(date.from, "dd/MM/yyyy") : "Add date"}
            </p>
          </div>
          <div
            className="flex-1 p-4 hover:bg-muted cursor-pointer transition rounded-r-2xl"
            onClick={handleToggleCalendar}
          >
            <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">
              Check-out
            </span>
            <p className="text-sm font-bold text-foreground">
              {date?.to ? format(date.to, "dd/MM/yyyy") : "Add date"}
            </p>
          </div>
          {showCalendar && (
            <div
              className={cn(
                "absolute p-2 z-[1000] bg-background border border-border shadow-2xl rounded-2xl",
                "top-full mt-2 left-1/2 -translate-x-1/2",
                "w-[95vw] md:w-auto"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <HotelCalender />
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-border p-1 bg-background w-full">
          <VisitorsMembers showCalendar={showCalendar} />
        </div>
        <div className="py-2">
          <p className="text-xs text-muted-foreground font-bold uppercase mb-1">
            Prices
          </p>
          {isLoading ? (
            <div className="animate-pulse h-8 w-32 bg-muted rounded" />
          ) : (
            <p className="text-2xl font-black text-foreground">
              {minPrice > 0 ? `₹${minPrice} to ₹${maxPrice}` : "Select dates"}
            </p>
          )}
        </div>
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-2xl text-lg shadow-lg transition-all active:scale-[0.98]"
          onClick={async (e) => {
            e.preventDefault();
            const el = document.getElementById("rooms");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            // FetchRoomTypes();
            setFetch(true);
          }}
        >
          Show Rooms
        </Button>
        <p className="text-[11px] text-center text-muted-foreground font-medium italic">
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
      className="w-full px-5"
      style={{ display: showCalendar ? "none" : "block" }}
    >
      <AccordionItem value="rooms and guests">
        <AccordionTrigger>rooms and guests</AccordionTrigger>
        <AccordionContent>
          <GuestSelector />
          {/* <HotelVisitorsCounters
            values={["adults", "children"]}
            methods={methods}
          /> */}
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
  const handleStoreChange = (key: string, val: number) =>
    setGuests({ ...guests, [key]: val });
  return (
    <div className="flex flex-col gap-2">
      {values.map((opt) => (
        <CounterWithoutQuery
          key={opt}
          label={opt}
          methods={methods}
          fieldName={methods ? `guests.${opt}` : undefined}
          value={methods ? undefined : (guests as Record<string, number>)[opt]}
          onChange={methods ? undefined : (val) => handleStoreChange(opt, val)}
        />
      ))}
    </div>
  );
};

export default BookingCard;
