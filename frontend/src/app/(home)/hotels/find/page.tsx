import FilterFramePages from "@/components/frame-pages/Filter-Frame-Page";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import img2 from "@/assets/img2.png";
import { SideBarFilter } from "./_components/sidebar-filter";
import { ContentFrame } from "./_components/content";
import HotelContextProvider from "@/context/hotel/HotelContextProvider";

type FindHotelProps = {
  className?: string;
};

const FindHotels = (props: FindHotelProps) => {
  return (
    <div className={cn(props.className, "w-full bg-background")}>
      <ErrorBoundary fallback={<p>error</p>}>
        <Suspense fallback={<p>loading</p>}>
          <HotelContextProvider>
            <FilterFramePages
              filterClassname="w-full flex gap-4 "
              filterSidebar={<SideBarFilter />}
              content={<ContentFrame />}
            />
          </HotelContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
export default FindHotels;
