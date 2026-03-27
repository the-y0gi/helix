import FilterFramePages from "@/components/frame-pages/Filter-Frame-Page";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SideBarFilter } from "./_components/sidebar-filter";
import { ContentFrame } from "./_components/content";
import { HotelContextProvider } from "@/context/hotel/HotelContextProvider";
import { MessageModal } from "@/components/messagemodal";
import { PageSkeleton } from "@/components/loader/skeleton";
import { IconArrowRampRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

type FindHotelProps = {
  className?: string;
};

const FindHotels: React.FC<FindHotelProps> = (props) => {
  return (
    <div className={cn(props.className, "w-full bg-background  sm:px-0")}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<PageSkeleton />}>
          <HotelContextProvider>

            <FilterFramePages
              filterClassname="w-full flex gap-4 justify-center "
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
