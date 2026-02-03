import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import HotelItems from "./_components/HotelItems";
import { ScrollToTop } from "../../../../../scrolltoto";

type HotelDetailsProps = {
  className?: string;
};

const HotelDetails = ({ className }: HotelDetailsProps) => {
  return (
    <div className={cn(" w-full", className)}>
      <ErrorBoundary fallback={<p>error</p>}>
        <Suspense fallback={<p>loading</p>}>
          <ScrollToTop />
          <HotelItems />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default HotelDetails;
