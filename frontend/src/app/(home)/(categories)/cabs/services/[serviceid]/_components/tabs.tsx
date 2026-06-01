"use client";

import React, { useEffect, useRef, useState } from "react";

import { CabDetailData } from "../page";
import { Decription } from "@/app/(home)/(categories)/_componentsRoot_categories/description";
import { LayoutGridDemo } from "@/app/(home)/(categories)/_componentsRoot_categories/imsges";
import AmenitiesValues from "@/app/(home)/(categories)/_componentsRoot_categories/amanities";
import HotelPolicies from "../../../[cabid]/_components/policies";


type TabKey =
  | "overview"
  | "description"
  // | "location"
  // | "rooms"
  | "amenities"
  | "reviews";

export function TabsLine({
  values,
  data,
  isBookingMode,
  isAvailabilityLoading,
}: {
  values: { title: TabKey; id: number }[];
  data: CabDetailData;
  isBookingMode: boolean;
  isAvailabilityLoading: boolean;
}) {


  const companyId = data.company.companyId;
  // const serviceId = data.service.serviceId;
  if (!data) return null;

  const content: Record<TabKey, React.ReactNode> = {
    overview: <LayoutGridDemo v="base4" images={data.company.images} />,
    description: <Decription data={{ name: data.company.name, description: data.company.description }} />,
    reviews: <ReviewsMain CompanyType="cab" companyId={companyId} />,

    amenities: <AmenitiesValues amenities={data.service.features} title="" />

  };

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const handleClick = () =>
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-3 lg:px-10 flex flex-col lg:flex-row gap-3">

      {/* LEFT COLUMN: Main Content Area */}
      <div className="flex-1 min-w-0">

        {/* Overview Section */}
        <section id="overview" className="py-3">
          {content.overview}

          {/* Mobile-only Card: Shows right under the images on small screens */}
          <div className="mt-6 lg:hidden">
            <CarBookingCard data={data} />
          </div>
        </section>

        {/* Details Sections */}
        <div className="flex flex-col space-y-8 mt-4">
          <main className="space-y-8 border-b pb-10">
            <section id="description">
              <h3 className="text-xl font-bold mb-4 dark:text-zinc-400 text-zinc-800">Description</h3>
              <div className="prose max-w-none">
                {content.description}
              </div>
            </section>

            <section id="amenities" className="scroll-mt-20 border-t pt-8">
              <h3 className="text-xl font-bold mb-4">Amenities</h3>
              {content.amenities}
            </section>

            <section id="reviews" className="scroll-mt-20 border-t pt-8">
              <h3 className="text-xl font-bold mb-4">Reviews</h3>
              {content.reviews}
            </section>

            <div className="border-t pt-8">
              <HotelPolicies id={companyId} />
            </div>
          </main>
        </div>
      </div>

      {/* RIGHT COLUMN: The Sidebar Card */}
      <aside className="hidden lg:block lg:w-[380px] flex-shrink-0  ">
        <div className="  pt-5 sticky top-24">
          {/* <CometCard translateDepth={1} rotateDepth={3}> */}

          <CarBookingCard data={data} />
          {/* </CometCard> */}
        </div>
      </aside>

    </div>
    // <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-10">
    //   <section id="overview" className="py-3 -mx-5 md:mx-0">
    //     {content.overview}
    //   </section>

    //   <div className="flex flex-col lg:flex-row lg:gap-6 mb-5">
    //     <main className="flex-1 space-y-5 border-b-1 mb-4">
    //       <section id="description" className=" py-2 gap-2">
    //         <h3 className="text-xl font-bold mb-2 dark:text-zinc-400 text-zinc-800">Description</h3>
    //         {content.description}
    //       </section>
    //       <section
    //         id="amenities"
    //         className="scroll-mt-16 border-t md:pt-3 pt-2"
    //       >
    //         {content.amenities}
    //       </section>
    //       {/* <section
    //         id="location"
    //         className="scroll-mt-5 border-t md:pt-4 pt-5 my-4"
    //         ref={sectionRef}
    //       >
    //         {content.location}
    //       </section> */}
    //     </main>
    //     <aside className="lg:w-[380px] flex-shrink-0">

    //       {/* <div className="lg:sticky lg:top-24">
    //         <CometCard translateDepth={5}>
    //         <BookingCard
    //           isBookingMode={isBookingMode}
    //           isLoading={isAvailabilityLoading}
    //         />
    //         </CometCard>
    //       </div> */}
    //     </aside>
    //   </div>
    //   <section
    //     id="rooms"
    //     className="scroll-mt-24 border-t md:pt-16 pt-6 md:mb-16 mb-5 w-full"
    //   >
    //     {/* <div className="mb-8 text-left">
    //       <h3 className="text-2xl font-bold">Available Rooms</h3>
    //       <p className="text-slate-500 text-sm">
    //         Choose the best room that fits your needs
    //       </p>
    //     </div> */}
    //     {/* <SliderIfNotChooseDate handleClick={handleClick}>
    //       {content.rooms}
    //     </SliderIfNotChooseDate> */}
    //   </section>
    //   <section
    //     id="reviews"
    //     className="py-5 border-t md:pt-5 pt-6 md:mb- mb-5"
    //   >
    //     {content.reviews}
    //   </section>
    //   <HotelPolicies id={companyId} />
    // </div>
  );
}




import { MapPin, Calendar, User, Fuel, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReviewsMain from "@/app/(home)/(categories)/_componentsRoot_categories/reviews";
import { useCabsStore } from "@/store/cabs.store";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { RouterPush } from "@/components/RouterPush";
import { CometCard } from "@/components/ui/comet-card";
const CarBookingCard = ({ data }: { data: CabDetailData }) => {
  const { DropoffCity, PickupCity, guests, date } = useCabsStore()
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  return (
    <Card className="w-full lg:max-w-[400px] border-none shadow-2xl rounded-[16px] overflow-hidden bg-card/90 dark:bg-zinc-800/80 backdrop-blur-sm p-1">
      <CardContent className="pt-5 px-5 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-foreground">
              {data.service.carName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-muted-foreground">
              <Fuel className="w-4 h-4 text-rose-500" />
              <span>{data.service.capacity}</span>
            </div>
          </div>
          <div className="relative w-24 h-16 flex-shrink-0">
            <img
              src="/nav-icons/cabs-logo.png"
              alt="Car"
              className="object-contain w-full h-full drop-shadow-md dark:brightness-90"
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Timeline Style Locations */}
          <div className="relative space-y-4">
            {/* Visual connector line */}
            <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-border" />

            {/* Pickup */}
            <div className="flex gap-4 relative">
              <div className="z-10 p-2 bg-rose-50 dark:bg-zinc-950/30 rounded-full h-fit ring-4 ring-card">
                <MapPin className="w-4 h-4 text-rose-600 fill-rose-600 dark:text-rose-500 dark:fill-rose-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">Pickup</span>
                <span className="text-sm font-bold text-foreground">{PickupCity}</span>
              </div>
            </div>

            {/* Drop */}
            <div className="flex gap-4 relative">
              <div className="z-10 p-2 bg-rose-50 dark:bg-zinc-950/30 rounded-full h-fit ring-4 ring-card">
                <MapPin className="w-4 h-4 text-rose-600 fill-rose-600 dark:text-rose-500 dark:fill-rose-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">Drop</span>
                <span className="text-sm font-bold text-foreground">{DropoffCity}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Pickup Time */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/50">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Time</span>
                <span className="text-[11px] font-bold text-foreground">
                  {date?.from ? format(date.from, "dd/MM/yyyy") : "Add date"}
                </span>
              </div>
            </div>

            {/* Passengers */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/50">
              <User className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Seats</span>
                <span className="text-[11px] font-bold text-foreground">
                  {guests.adults + guests.children} Passengers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Box - Adaptive Gradients */}
        {/* <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20 p-4 rounded-2xl border border-rose-100/50 dark:border-rose-900/30">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest">Base Fare</p>
              <p className="text-xl font-black text-foreground">
                ₹9 <span className="text-sm font-bold text-muted-foreground">/Km</span>
              </p>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground pb-1">+ Taxes & Fees</p>
          </div>
        </div> */}
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button disabled={loading} onClick={() => { setLoading(true); RouterPush(router, `/booknow/${data.service.serviceId}/${data.company.companyId}`, { "date": `${date?.from ? format(date.from, "dd/MM/yyyy") : "Add date"}-${date?.to ? format(date.to, "dd/MM/yyyy") : "Add date"}`, "guests": `${guests.adults + guests.children} Passengers`, "categories": "cabs" }) }} className="w-full bg-primary hover:bg-primary-700 dark:bg-rose-600 dark:hover:bg-primary-500 text-white text-md font-bold h-14 rounded-2xl shadow-lg shadow-primary-200 dark:shadow-none group active:scale-[0.98] transition-all">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Book Now"}
          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};