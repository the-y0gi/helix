"use client";

import React, { useEffect, useRef, useState } from "react";
import { LayoutGridDemo } from "../../../_componentsRoot_categories/imsges";
import { Decription } from "../../../_componentsRoot_categories/description";
import { BikesMain } from "./rooms";
import SliderIfNotChooseDate from "../_providers_context/SliderIfNotChooseDate";

import Policies from "./policies";
import { CabData } from "../_providers_context/CabsDetailsContextProvider";
import AmenitiesValues from "../../../_componentsRoot_categories/amanities";
import ReviewsMain from "../../../_componentsRoot_categories/reviews";

type TabKey =
  | "overview"
  | "description"
  // | "location" 
  | "rooms"
  | "amenities"
  | "reviews";

export function TabsLine({
  values,
  data,
  isBookingMode,
  isAvailabilityLoading,
}: {
  values: { title: TabKey; id: number }[];
  data: CabData;
  isBookingMode: boolean;
  isAvailabilityLoading: boolean;
}) {


  const companyId = data.company.companyId;
  // const serviceId = data.service.serviceId;
  if (!data) return null;

  const content: Record<TabKey, React.ReactNode> = {
    overview: <LayoutGridDemo images={data.company.images} />,
    description: <Decription data={{ name: data.company.name, description: data.company.description }} />
    // location: (
    //   <MapLocation
    //     address={data.company.address}
    //     cordinates={data.company.location.coordinates}
    //     map="/map.png"
    //   />
    // ),
    ,
    amenities: <AmenitiesValues amenities={data.company.features} title="" />,
    reviews: <ReviewsMain companyId={companyId} CompanyType='cab' />,

    rooms: (
      <BikesMain
        services={data.services}
        isBookingMode={isBookingMode}
        isLoading={isAvailabilityLoading} />
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
      {/* <div className="z-30 sticky top-0 z-0 bg-white/50 dark:bg-background/30 backdrop-blur-md border-b border-t h-16 flex items-center -mx-4 px-4 md:px-6 mb-8">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {values.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.title}`}
              className="capitalize whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-orange-500 text-sm font-semibold transition-all text-slate-600 hover:text-slate-900 dark:hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(tab.title);
                if (!target) return;

                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Custom smooth scroll that cannot be aborted by native browser layout shift bugs
                const startPosition = window.pageYOffset;
                const distance = offsetPosition - startPosition;
                const duration = 600; // ms
                let start: number | null = null;

                const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
                  t /= d / 2;
                  if (t < 1) return (c / 2) * t * t + b;
                  t--;
                  return (-c / 2) * (t * (t - 2) - 1) + b;
                };

                const animation = (currentTime: number) => {
                  if (start === null) start = currentTime;
                  const timeElapsed = currentTime - start;
                  const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                  window.scrollTo(0, run);
                  if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                  } else {
                    window.scrollTo(0, offsetPosition);
                  }
                };

                requestAnimationFrame(animation);
              }}
            >
              {tab.title}
            </a>
          ))}
        </div>
      </div> */}
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
          <h3 className="text-2xl font-bold">Available Cabs</h3>
          <p className="text-slate-500 text-sm">
            Choose the best cab that fits your needs
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
      <Policies id={companyId} />
    </div>
  );
}

// function BookingCard({
//   isBookingMode,
//   isLoading,
// }: {
//   isBookingMode: boolean;
//   isLoading: boolean;
// }) {
//   const { date, guests } = useHotelStore();
//   const [showCalendar, setShowCalendar] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);


//   return (
//     <Card className="border border-border shadow-xl rounded-2xl bg-background/90 text-foreground overflow-visible relative">
//       <CardContent className="p-6 space-y-6">
//         <div
//           ref={containerRef}
//           className="relative rounded-2xl border border-border divide-x divide-border flex overflow-visible bg-background z-1"
//         >
//           <div
//             className="flex-1 p-4 hover:bg-muted cursor-pointer transition rounded-l-2xl"
//             onClick={handleToggleCalendar}
//           >
//             <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">
//               Check-in
//             </span>
//             <p className="text-xs md:text-sm font-bold text-foreground">
//               {date?.from ? format(date.from, "dd/MM/yyyy") : "Add date"}
//             </p>
//           </div>
//           <div
//             className="flex-1 p-4 hover:bg-muted cursor-pointer transition rounded-r-2xl"
//             onClick={handleToggleCalendar}
//           >
//             <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">
//               Check-out
//             </span>
//             <p className="text-xs md:text-sm font-bold text-foreground">
//               {date?.to ? format(date.to, "dd/MM/yyyy") : "Add date"}
//             </p>
//           </div>
//           {showCalendar && (
//             <div
//               className={cn(
//                 "absolute p-2 z-[100px] bg-background border border-border shadow-2xl rounded-2xl",
//                 "top-full mt-2 left-1/2 -translate-x-1/2",
//                 " w-[98vw] md:w-auto"
//               )}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <HotelCalender />
//             </div>
//           )}
//         </div>
//         <div className="rounded-2xl border border-border p-1 bg-background w-full">
//           <VisitorsMembers showCalendar={false} />
//         </div>
//         <div className="py-2">
//           <p className="text-xs text-muted-foreground font-bold uppercase mb-1">
//             Prices
//           </p>
//           {isLoading ? (
//             <div className="animate-pulse h-8 w-32 bg-muted rounded" />
//           ) : (
//             <p className="text-2xl font-black text-foreground">
//               {minPrice > 0 ? `₹${minPrice} to ₹${maxPrice}` : "Select dates"}
//             </p>
//           )}
//         </div>
//         <Button
//           className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-2xl text-lg shadow-lg transition-all active:scale-[0.98]"
//           onClick={async (e) => {
//             e.preventDefault();
//             const el = document.getElementById("rooms");
//             if (el) el.scrollIntoView({ behavior: "smooth" });
//             // FetchRoomTypes();
//             setFetch(true);
//           }}
//         >
//           Show Rooms
//         </Button>
//         <p className="text-[11px] text-center text-muted-foreground font-medium italic">
//           Best price guaranteed • No hidden fees
//         </p>
//       </CardContent>
//     </Card>
//   );
// }

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
//       className="w-full px-5"
//       style={{ display: showCalendar ? "none" : "block" }}
//     >
//       <AccordionItem value="rooms and guests">
//         <AccordionTrigger>rooms and guests</AccordionTrigger>
//         <AccordionContent>
//           <GuestSelector />
//           {/* <HotelVisitorsCounters
//             values={["adults", "children"]}
//             methods={methods}
//           /> */}
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
//   const handleStoreChange = (key: string, val: number) =>
//     setGuests({ ...guests, [key]: val });
//   return (
//     <div className="flex flex-col gap-2">
//       {values.map((opt) => (
//         <CounterWithoutQuery
//           key={opt}
//           label={opt}
//           methods={methods}
//           fieldName={methods ? `guests.${opt}` : undefined}
//           value={methods ? undefined : (guests as Record<string, number>)[opt]}
//           onChange={methods ? undefined : (val) => handleStoreChange(opt, val)}
//         />
//       ))}
//     </div>
//   );
// };

// export default BookingCard;
