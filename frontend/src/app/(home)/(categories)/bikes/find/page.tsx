import FilterFramePages from "@/components/frame-pages/Filter-Frame-Page";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ContentFrame } from "./_components/content";
import { HotelContextProvider } from "@/context/hotel/HotelContextProvider";
import { MessageModal } from "@/components/messagemodal";
import { PageSkeleton } from "@/components/loader/skeleton";
import { IconArrowRampRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { BikeContextProvider } from "@/context/BikesContextProvider";
import { SideBarFilter } from "@/components/filter-bar/sidebar-filter";
import { items } from "@/constants/filter-constants";

type FindHotelProps = {
  className?: string;
};

const FindHotels: React.FC<FindHotelProps> = (props) => {
  return (
    <div className={cn(props.className, "w-full bg-background  sm:px-0")}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<PageSkeleton />}>
          <BikeContextProvider>

            <FilterFramePages
              filterClassname="w-full flex gap-4 justify-center "
              filterSidebar={<SideBarFilter items={items} mapSrc="/map-icons/map.png" alt="map image" overlayTitle="See Location on Map" />}
              content={<ContentFrame />}
            />
          </BikeContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
export default FindHotels;
