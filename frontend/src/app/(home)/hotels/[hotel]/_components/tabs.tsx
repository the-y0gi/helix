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
import { useRouter } from "next/navigation";
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
            <BookingCard hotel={hotel} />
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



function BookingCard({ hotel }: { hotel: Hotel }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
  const navigate = useRouter();
  return (
    <Card className="border shadow-xl rounded-2xl bg-card ">
      <CardContent className="p-6 space-y-6">
        <div
          ref={containerRef}
          className="relative"
        >
          <div
            className={`
              grid grid-cols-2 gap-4 p-4 rounded-xl border 
              ${showCalendar
                ? "border-primary shadow-sm bg-muted/30"
                : "border-border hover:border-primary/50 hover:bg-muted/20"
              } 
              cursor-pointer transition-all duration-200
            `}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <div>
              <h4 className="font-semibold text-base">Check-in</h4>
              <p className="text-sm text-muted-foreground mt-1">08/14/2025</p>
            </div>
            <div>
              <h4 className="font-semibold text-base">Check-out</h4>
              <p className="text-sm text-muted-foreground mt-1">08/19/2025</p>
            </div>
          </div>

          {showCalendar && (
            <div
              className="flex justify-center
                 top-full  left-0 right-0 mt-3 z-50 left-10 -ml-10 mr-10
                bg-popover border rounded-xl shadow-xl
                min-w-[320px] md:min-w-[380px]
              "
            >
              <HotelCalender

                className="p-4"
              />


            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="font-medium text-base">Prices start from</p>
          <p className="text-2xl font-bold text-primary">$300 <span className="text-lg font-normal">/ night</span></p>
          <p className="text-sm text-muted-foreground">
            to $600
          </p>
        </div>

        <Button asChild
          //  href=
          className="
            w-full bg-orange-600 hover:bg-orange-700 
            text-white font-semibold 
            rounded-xl py-3.5 
            transition-colors duration-200
            shadow-sm hover:shadow
          "
        >
          <a href={`#rooms`}> Show Rooms</a>

        </Button>

        <p className="text-xs text-center text-muted-foreground pt-1">
          You won’t be charged yet
        </p>
      </CardContent>
    </Card>
  );
}

export default BookingCard;