'use client'
import FilterFramePages from "@/components/frame-pages/Filter-Frame-Page";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ContentFrame } from "./_components/content";
import { MessageModal } from "@/components/messagemodal";
import { PageSkeleton } from "@/components/loader/skeleton";

import { useCabsStore } from "@/store/cabs.store";
import { CabsContextProvider } from "@/context/CabsContextProvider";
import { items } from "@/constants/filter-constants";
import { SideBarFilter } from "@/components/filter-bar/sidebar-filter";

type FindHotelProps = {
  className?: string;
};

const FindHotels: React.FC<FindHotelProps> = (props) => {
  const { PickupCity, DropoffCity } = useCabsStore()
  return (
    <div className={cn(props.className, "w-full bg-background  sm:px-0")}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<PageSkeleton />}>
          <CabsContextProvider>

            <FilterFramePages
              filterClassname="w-full flex gap-4 justify-center "
              filterSidebar={<SideBarFilter items={items} mapSrc="/map-icons/map.png" alt="map image" overlayTitle="See Location on Map" />}
              content={<ContentFrame tg={`cabs from ${PickupCity} to ${DropoffCity}`} />}
            />
          </CabsContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
export default FindHotels;
