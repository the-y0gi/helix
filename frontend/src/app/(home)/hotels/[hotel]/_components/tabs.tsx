import { RoomsBedTabs, RoomsMain } from "./rooms";
import MapLocation from "./Location";
import AmenitiesValues from "./amanities";
import { Decription } from "./description";
import { LayoutGridDemo } from "./imsges";
import { Hotel } from "@/types";
import ReviewsMain from "./reviews";
import { Card, CardContent } from "@/components/ui/card";
import { HotelPolicies } from "./policies";
import { BookingCalender, HotelCalender } from "./calander-booking";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Reviews = ({ hotel }: { hotel: Hotel }) => {
  return <ReviewsMain hotel={hotel} />;
};

const Rooms = ({ hotel }: { hotel: Hotel }) => {
  return <RoomsMain hotel={hotel} />;
};

const Location = ({ hotel }: { hotel: Hotel }) => {
  return <MapLocation address={hotel.address} map="/map.png" />;
};

const Amenities = ({ hotel }: { hotel: Hotel }) => {
  return <AmenitiesValues amenities={hotel.amenities} />;
};

const Header = ({ hotel }: { hotel: Hotel }) => {
  return <LayoutGridDemo images={hotel.images} />;
};

type TabKey = "overview" | "description" | "location" | "rooms" | "amenities" | "reviews";

export function TabsLine({
  values,
  hotel,
}: {
  values: {
    title: TabKey;
    id: number;
  }[];
  hotel: Hotel;
}) {
  const content: Record<TabKey, React.ReactNode> = {
    overview: <Header hotel={hotel} />,
    description: <Decription hotel={hotel} />,
    reviews: <Reviews hotel={hotel} />,
    location: <Location hotel={hotel} />,
    rooms: <Rooms hotel={hotel} />,
    amenities: <Amenities hotel={hotel} />,
  };

  const tabItems = values.filter((tab) => tab.title === "description" || tab.title === "amenities" || tab.title === "location");

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-10 xl:px-16">
      <div className="sticky top-0 z-30 bg-card border-b h-20 md:h-[86px] flex items-center -mx-4 md:-mx-6 lg:-mx-10 xl:-mx-16 px-4 md:px-6 lg:px-10 xl:px-16">
        <div className="flex gap-6 md:gap-8 lg:gap-10">
          {values.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.title}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(tab.title)?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              className="capitalize pb-3 md:pb-4 border-b-2 border-transparent hover:border-primary data-[state=active]:border-primary cursor-pointer text-sm md:text-base font-medium transition-colors"
            >
              {tab.title}
            </a>
          ))}
        </div>
      </div>

      <section id="overview" className="py-6 md:py-8 lg:py-10 w-full overflow-hidden">
        {content.overview}
      </section>

      <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
        <main className="flex-1 min-w-0 py-6 lg:py-10 space-y-10 lg:space-y-16 w-full">
          {tabItems.map((tab) => (
            <section
              key={tab.id}
              id={tab.title}
              className="scroll-mt-28 lg:scroll-mt-32 w-full overflow-hidden"
            >
              {content[tab.title]}
            </section>
          ))}
        </main>

        <aside className="hidden   lg:block lg:w-[320px] xl:w-[360px] flex-shrink-0 pt-6 lg:pt-10">
          <div className="sticky top-24 lg:top-28 z-10">
            <BookingCard />
          </div>
        </aside>
      </div>
      <section id="rooms" className="py-6 md:py-8 lg:py-10 w-full overflow-hidden">
        {content.rooms}
      </section>
      <section id="reviews" className="py-6 md:py-8 lg:py-10 w-full overflow-hidden">
        {content.reviews}
      </section>
      <HotelPolicies />
    </div>
  );
}


import { format } from "date-fns";
function BookingCard() {
  const { booking, setBooking, date, hotel, guests } = useHotelStore()
  const [showCalendar, setShowCalendar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);
  const pathname = usePathname()
  useEffect(() => {
    if (pathname.includes("hotels")) {
      setBooking(true)
    } else {
      setBooking(false)
    }
  }, [pathname]);
  const r = rating(hotel.rating)
  const { data: newRoomsData, refetch, isLoading, isError, isRefetching } = useRoomsQuery({
    hotelId: hotel.id,
    checkIn: date?.from,
    checkOut: date?.to,
    adults: guests.adults,
    children: guests.children,
  })

  return (
    <Card className="border shadow-xl rounded-2xl bg-card w-full max-w-md">
      <CardContent className="p-6 space-y-6">
        {!booking && <div className="flex gap-4">
          <img
            src={hotel.image}
            alt="Hotel"
            className="w-28 h-28 rounded-xl object-cover"
          />

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                {hotel.name}
              </h3>
              <div className="flex text-yellow-400 text-sm">
                {Array.from({ length: hotel.rating }).map((_, i) => {
                  return (
                    <IconStarFilled key={i} className="size-4" color="gold" />
                  )
                })}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Barcelona, Spain
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md">
                5.0
              </span>
              <span className="text-sm font-medium text-blue-600">
                {r}
              </span>
              <span className="text-xs text-muted-foreground">
                {hotel.reviewCount} reviews
              </span>
            </div>
          </div>
        </div>}
        <div ref={containerRef} className="relative rounded-xl border">
          {showCalendar && (
            <div
              className="
              absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50
              bg-popover border rounded-xl shadow-2xl -ml-20
              w-full max-w-md
              "
            >
              <HotelCalender className="p-4" />
            </div>
          )}
          <div
            className={`
              grid grid-cols-3 gap-4 p-4 
              cursor-pointer transition-all duration-200
              ${showCalendar
                ? "border-primary shadow-sm bg-muted/30"
                : "border-border hover:border-primary/50 hover:bg-muted/20"
              }
            `}
            onClick={() => setShowCalendar((prev) => !prev)}
          >
            <div>
              <h4 className="font-semibold text-base">Check-in</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {date?.from ? format(date.from, "dd/MM/yyyy") : ""}
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-px h-full bg-border" />
            </div>

            <div>
              <h4 className="font-semibold text-base">Check-out</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {date?.to ? format(date.to, "dd/MM/yyyy") : ""}
              </p>
            </div>
          </div>


          <div className="border-t border-border"></div>

          <div className="mt-3 px-4">
            <VisitorsMembers showCalendar={showCalendar} />
          </div>
        </div>
        {booking && <div className="space-y-1">
          <p className="font-medium text-base">Prices start from</p>
          <p className="text-2xl font-bold text-primary">
            $300 <span className="text-lg font-normal">/ night</span>
          </p>
          <p className="text-sm text-muted-foreground">to $600</p>
        </div>}

        {!booking && <div className="space-y-3">
          <h4 className="font-semibold">Price details:</h4>

          <div className="flex justify-between text-sm">
            <span>$300 × 5 nights</span>
            <span>$1,500</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tripto service fee</span>
            <span>$4.20</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Taxes</span>
            <span>$24.70</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total USD</span>
            <span>$1,528</span>
          </div>
        </div>}

        {booking && <Button
          asChild
          className="
            w-full bg-orange-600 hover:bg-orange-700 
            text-white font-semibold 
            rounded-xl py-3.5 
            transition-colors duration-200
            shadow-sm hover:shadow
          "
        >
          <a href="#rooms" onClick={() => refetch()}>Show Rooms</a>
        </Button>}

        {booking && <p className="text-xs text-center text-muted-foreground pt-1">
          You won’t be charged yet
        </p>}
      </CardContent>
    </Card>
  );
}

export default BookingCard;


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HotelCounters } from "@/components/side-bar-filter/hotel/HotelPileGroup";
import { CounterWithoutQuery } from "@/components/side-bar-filter/counter";
import { useHotelStore } from "@/store/hotel.store";
import { PaymentProps } from "@/schema/payment.schema";
import { IconStarFilled } from "@tabler/icons-react";
import { rating } from "@/config/rating";
import { useForm, UseFormReturn } from "react-hook-form"
import { useRoomsQuery } from "@/services/querys";
export function VisitorsMembers({ showCalendar, methods }: { showCalendar: boolean, methods?: UseFormReturn<PaymentProps> }) {
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
          <HotelVisitorsCounters values={['adults', 'children']} methods={methods} />
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  )
}
export const HotelVisitorsCounters = ({ values, methods }: { values: string[], methods?: UseFormReturn<PaymentProps> }) => {
  const { guests, setGuests } = useHotelStore();

  const handleStoreChange = (key: string, val: number) => {
    setGuests({ ...guests, [key]: val });
  };

  return (
    <div className="flex flex-col  gap-2">
      {
        values.map((opt) => (
          <CounterWithoutQuery
            key={opt}
            label={opt}
            methods={methods}
            fieldName={methods ? `guests.${opt}` : undefined}
            value={methods ? undefined : (guests as any)[opt]}
            onChange={methods ? undefined : (val) => handleStoreChange(opt, val)}
          />

        ))
      }

    </div>
  )
}