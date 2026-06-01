"use client";

import React, { useEffect, useRef, useState } from "react";

import { RentalData } from "../page";
import { Decription } from "@/app/(home)/(categories)/_componentsRoot_categories/description";
import { LayoutGridDemo } from "@/app/(home)/(categories)/_componentsRoot_categories/imsges";
import AmenitiesValues from "@/app/(home)/(categories)/_componentsRoot_categories/amanities";
import HotelPolicies from "../../../[bikeid]/_components/policies";
import ReviewsMain from "@/app/(home)/(categories)/_componentsRoot_categories/reviews";

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
  data: RentalData;
  isBookingMode: boolean;
  isAvailabilityLoading: boolean;
}) {


  const companyId = data.company.companyId;
  // const serviceId = data.service.serviceId;
  if (!data) return null;

  const content: Record<TabKey, React.ReactNode> = {
    overview: <LayoutGridDemo images={data?.company?.images} v="base4" />,
    description: <Decription data={{ name: data.company.name, description: data.company.description }} />,

    amenities: <AmenitiesValues amenities={data.service.features} title="" />,
    reviews: <ReviewsMain companyId={companyId} CompanyType="bike" />

  };

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const handleClick = () =>
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-10 flex flex-col lg:flex-row gap-2">

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
              <h3 className="text-xl font-bold mb-4">Feartures</h3>
              {content.amenities}
            </section>

            <section id="reviews" className="scroll-mt-20 border-t pt-8">
              {/* <h3 className="text-xl font-bold mb-4">Reviews</h3> */}
              {content.reviews}
            </section>

            <div className="border-t pt-8">
              <HotelPolicies id={companyId} />
            </div>
          </main>
        </div>
      </div>

      {/* RIGHT COLUMN: The Sidebar Card */}
      <aside className="hidden lg:block lg:w-[380px] flex-shrink-0">
        <div className="sticky top-24 pt-3">
          <CarBookingCard data={data} />
        </div>
      </aside>

    </div>
    // <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-10 flex flex-col lg:flex-row gap-4 ">
    //   <div className="w-full "> <section id="overview" className="py-3 -mx-5 md:mx-0 flex flex-col lg:flex-row gap-2">
    //     {content.overview}
    //     {/* <div className="md:hidden block">
    //       <CarBookingCard />
    //     </div> */}
    //   </section>

    //     <div className="flex flex-col lg:flex-row lg:gap-6 mb-5">
    //       <main className="flex-1 space-y-5 border-b-1 mb-4">
    //         <section id="description" className=" py-2 gap-2">
    //           <h3 className="text-xl font-bold mb-2 dark:text-zinc-400 text-zinc-800">Description</h3>
    //           {content.description}
    //         </section>
    //         <section
    //           id="amenities"
    //           className="scroll-mt-16 border-t md:pt-3 pt-2"
    //         >
    //           {content.amenities}
    //         </section>
    //         {/* <section
    //         id="location"
    //         className="scroll-mt-5 border-t md:pt-4 pt-5 my-4"
    //         ref={sectionRef}
    //       >
    //         {content.location}
    //       </section> */}
    //       </main>
    //       <aside className="lg:w-[380px] flex-shrink-0">

    //         {/* <div className="lg:sticky lg:top-24">
    //         <CometCard translateDepth={5}>
    //         <BookingCard
    //           isBookingMode={isBookingMode}
    //           isLoading={isAvailabilityLoading}
    //         />
    //         </CometCard>
    //       </div> */}
    //       </aside>
    //     </div>
    //     {/* <section
    //     id="rooms"
    //     className="scroll-mt-24 border-t md:pt-16 pt-6 md:mb-16 mb-5 w-full"
    //   >
    //     <div className="mb-8 text-left">
    //       <h3 className="text-2xl font-bold">Available Rooms</h3>
    //       <p className="text-slate-500 text-sm">
    //         Choose the best room that fits your needs
    //       </p>
    //     </div>
    //     <SliderIfNotChooseDate handleClick={handleClick}>
    //       {content.rooms}
    //     </SliderIfNotChooseDate>
    //   </section> */}
    //     <section
    //       id="reviews"
    //       className="py-5 border-t md:pt-5 pt-6 md:mb- mb-5"
    //     >
    //       {content.reviews}
    //     </section><HotelPolicies id={companyId} /></div>
    //   <aside className="lg:w-[380px] flex-shrink-0 py-5 lg:block hidden">
    //     <CarBookingCard />
    //   </aside>

    // </div>

  );
}

import { Fuel, MapPin, Calendar, User, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBikesStore } from "@/store/bikes.store";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { RouterPush } from "@/components/RouterPush";


const CarBookingCard = ({ data }: { data?: RentalData }) => {
  const { city, guests, date } = useBikesStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <Card className="w-full lg:max-w-[400px] border-none shadow-2xl rounded-[32px] overflow-hidden bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm p-1 transition-colors duration-300">
      <CardContent className="pt-5 px-5 space-y-5">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-400">
              {data?.service?.bikeName || "Bike Rental"}
            </h2>
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-500 dark:text-zinc-500">
              <Fuel className="w-4 h-4 text-rose-500" />
              <span>{data?.service?.mileage || "—"} • {data?.service?.fuelType || "Petrol"}</span>
            </div>
          </div>
          <div className="relative w-24 h-16 flex-shrink-0">
            <img
              src="/nav-icons/bikes-logo.png"
              alt="Bike"
              className="object-contain w-full h-full drop-shadow-md brightness-100 dark:brightness-90"
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Location */}
          <div className="relative space-y-4">
            <div className="flex gap-4 relative">
              <div className="z-10 p-2 bg-rose-50 dark:bg-rose-950/30 rounded-full h-fit ring-4 ring-white dark:ring-zinc-800">
                <MapPin className="w-4 h-4 text-rose-600 fill-rose-600 dark:text-rose-500 dark:fill-rose-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-zinc-500">Location</span>
                <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">{city || "Select location"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Date */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase">Period</span>
                <span className="text-[11px] font-bold text-slate-900 dark:text-zinc-200">
                  {date?.from ? format(date.from, "dd/MM/yyyy") : "Start"} - {date?.to ? format(date.to, "dd/MM/yyyy") : "End"}
                </span>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase">Riders</span>
                <span className="text-[11px] font-bold text-slate-900 dark:text-zinc-200">
                  {guests.adults + guests.children} Rider(s)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Box */}
        {data?.service?.pricePerDay && (
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-slate-800 dark:to-zinc-800/50 p-4 rounded-2xl border border-rose-100/50 dark:border-slate-700">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-rose-400 dark:text-rose-500 uppercase tracking-widest">Price</p>
                <p className="text-xl font-black text-slate-900 dark:text-zinc-400">
                  ₹{data.service.totalPriceWithTax} <span className="text-sm font-bold text-slate-500 dark:text-zinc-500">/day</span>
                </p>
              </div>
              <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 pb-1">after Taxes & Fees</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          disabled={loading}
          onClick={() => {
            if (!data) return;
            setLoading(true);
            RouterPush(router, `/booknow/${data.service.serviceId}/${data.company.companyId}`, {
              "date": `${date?.from ? format(date.from, "dd/MM/yyyy") : "Add date"}-${date?.to ? format(date.to, "dd/MM/yyyy") : "Add date"}`,
              "guests": `${guests.adults + guests.children} Riders`,
              "categories": "bikes"
            });
          }}
          className="w-full bg-primary hover:bg-primary/80 text-white text-md font-bold h-14 rounded-2xl shadow-lg shadow-rose-200 dark:shadow-none group active:scale-[0.98] transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Book Now"}
          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarBookingCard;