"use client";

import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Calendar, User, ChevronRight, Loader2, Compass } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Decription } from "@/app/(home)/(categories)/_componentsRoot_categories/description";
import { LayoutGridDemo } from "@/app/(home)/(categories)/_componentsRoot_categories/imsges";
import AmenitiesValues from "@/app/(home)/(categories)/_componentsRoot_categories/amanities";
import HotelPolicies from "../../../[tourid]/_components/policies";
import ChangelogComponentPage from "@/app/(home)/(categories)/_componentsRoot_categories/timelinedemo";
import ReviewsMain from "@/app/(home)/(categories)/_componentsRoot_categories/reviews";
import { RouterPush } from "@/components/RouterPush";
import { useToursStore } from "@/store/tours.store";
import { TourServiceData } from "./HotelItems";

type TabKey = "overview" | "description" | "amenities" | "reviews";

export function TabsLine({
  values,
  data,
  isBookingMode,
  isAvailabilityLoading,
}: {
  values: { title: TabKey; id: number }[];
  data: TourServiceData;
  isBookingMode: boolean;
  isAvailabilityLoading: boolean;
}) {
  const companyId = data.company.companyId;
  if (!data) return null;

  const content: Record<TabKey, React.ReactNode> = {
    overview: (
      <LayoutGridDemo
        images={data?.company?.images}
      />
    ),
    description: (
      <Decription
        data={{ name: data.company.name, description: data.company.description }}
      />
    ),
    reviews: <ReviewsMain companyId={companyId} CompanyType="tour" />,
    amenities: <AmenitiesValues amenities={data.service.features} title="" />,
  };

  const sectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-10">
      <section id="overview" className="py-3 -mx-5 md:mx-0">
        {content.overview}
      </section>

      <div className="flex flex-col lg:flex-row lg:gap-6 mb-5">
        <main className="flex-1 space-y-5 border-b-1 mb-4">
          <section id="description" className="py-2 gap-2">
            <h3 className="text-xl font-bold mb-2 dark:text-zinc-400 text-zinc-800">
              Description
            </h3>
            {content.description}
          </section>
          <section id="amenities" className="scroll-mt-16 border-t md:pt-3 pt-2">
            {content.amenities}
          </section>
        </main>
        <aside className="lg:w-[380px] flex-shrink-0">
          <div className="lg:sticky lg:top-24 pt-3">
            <TourBookingCard data={data} />
          </div>
        </aside>
      </div>

      <section
        id="itenary"
        className="scroll-mt-24 border-t md:pt-16 pt-6 md:mb-16 mb-5 w-full"
      >
        <div className="mb-8 text-left">
          <h3 className="text-2xl font-bold">Itinerary</h3>
        </div>
        <ChangelogComponentPage releses={data.service.itinerary} />
      </section>

      <section id="reviews" className="py-5 border-t md:pt-5 pt-6 md:mb- mb-5">
        {content.reviews}
      </section>

      <HotelPolicies id={companyId} />
    </div>
  );
}

// ─── Tour Booking Sidebar Card ────────────────────────────────────────────────
const TourBookingCard = ({ data }: { data?: TourServiceData }) => {
  const { date, guests } = useToursStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <Card className="w-full lg:max-w-[400px] border-none shadow-2xl rounded-[32px] overflow-hidden bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm p-1 transition-colors duration-300">
      <CardContent className="pt-5 px-5 space-y-5">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-400">
              {data?.service?.title || "Tour Package"}
            </h2>
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-500 dark:text-zinc-500">
              <Compass className="w-4 h-4 text-orange-500" />
              <span>
                {/* {data?.service?.duration?.days || "0"} Days •{" "}
                {data?.service?.duration?.nights || "0"} Nights */}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase">
                  Period
                </span>
                <span className="text-[11px] font-bold text-slate-900 dark:text-zinc-200">
                  {date?.from ? format(date.from, "dd/MM/yyyy") : "Start"} -{" "}
                  {date?.to ? format(date.to, "dd/MM/yyyy") : "End"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase">
                  Guests
                </span>
                <span className="text-[11px] font-bold text-slate-900 dark:text-zinc-200">
                  {guests.adults + guests.children} Guest(s)
                </span>
              </div>
            </div>
          </div>
        </div>

        {data?.service?.price && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/50 p-4 rounded-2xl border border-orange-100/50 dark:border-slate-700">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase tracking-widest">
                  Price
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-zinc-400">
                  ₹{data.service.totalPriceWithTax}{" "}
                  <span className="text-sm font-bold text-slate-500 dark:text-zinc-500">
                    /person
                  </span>
                </p>
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 pb-1">
                + Taxes & Fees
              </p>
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
            RouterPush(
              router,
              `/booknow/${data.service.serviceId}/${data.company.companyId}`,
              {
                date: `${date?.from ? format(date.from, "dd/MM/yyyy") : "Add date"}-${date?.to ? format(date.to, "dd/MM/yyyy") : "Add date"}`,
                guests: `${guests.adults + guests.children} Guests`,
                categories: "tours",
              }
            );
          }}
          className="w-full bg-primary text-white text-md font-bold h-14 rounded-2xl shadow-lg group active:scale-[0.98] transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Book Now"}
          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};
