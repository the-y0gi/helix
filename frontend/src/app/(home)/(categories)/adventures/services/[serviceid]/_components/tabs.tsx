"use client";

import React, { useEffect, useRef, useState } from "react";

import { Decription } from "@/app/(home)/(categories)/_componentsRoot_categories/description";
import { LayoutGridDemo } from "@/app/(home)/(categories)/_componentsRoot_categories/imsges";
import AmenitiesValues from "@/app/(home)/(categories)/_componentsRoot_categories/amanities";
import HotelPolicies from "../../../[adventureid]/_components/policies";
import { TrekDetailData } from "../page";

type TabKey =
  | "overview"
  | "description"
  // | "location"
  // | "rooms"
  | "amenities"
// | "reviews";

export function TabsLine({
  values,
  data,
  isBookingMode,
  isAvailabilityLoading,
}: {
  values: { title: TabKey; id: number }[];
  data: TrekDetailData;
  isBookingMode: boolean;
  isAvailabilityLoading: boolean;
}) {


  const companyId = data.adventure._id;
  // const serviceId = data.service.serviceId;
  if (!data) return null;

  const content: Record<TabKey, React.ReactNode> = {
    overview: <LayoutGridDemo images={[{
      "url": "https://res.cloudinary.com/dwfolqpht/image/upload/v1771828289/general/xrdjhqvzflmxoimk5qol.jpg",
      "public_id": "general/sample",
      "resource_type": "image",
      "_id": "69b805d08eceb263ce97ccc0"
    }]} />,
    description: <Decription data={{ name: data.adventure.name, description: "adventure service description from hardcoded " }} />,

    amenities: <AmenitiesValues amenities={data.service.features} />

  };

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const handleClick = () =>
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-10">
      <section id="overview" className="py-3 -mx-5 md:mx-0">
        {content.overview}
      </section>

      <div className="flex flex-col lg:flex-row lg:gap-6 mb-5">
        <main className="flex-1 space-y-5 border-b-1 mb-4">
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
          {/* <section
            id="location"
            className="scroll-mt-5 border-t md:pt-4 pt-5 my-4"
            ref={sectionRef}
          >
            {content.location}
          </section> */}
        </main>
        <aside className="lg:w-[380px] flex-shrink-0">

          {/* <div className="lg:sticky lg:top-24">
            <CometCard translateDepth={5}>
            <BookingCard
              isBookingMode={isBookingMode}
              isLoading={isAvailabilityLoading}
            />
            </CometCard>
          </div> */}
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
        {/* <SliderIfNotChooseDate handleClick={handleClick}>
          {content.rooms}
        </SliderIfNotChooseDate> */}
      </section>
      {/* <section
        id="reviews"
        className="py-5 border-t md:pt-5 pt-6 md:mb- mb-5"
      >
        {content.reviews}
      </section> */}
      <HotelPolicies id={companyId} />
    </div>
  );
}
