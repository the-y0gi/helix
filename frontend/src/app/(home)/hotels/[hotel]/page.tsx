"use client";

import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import HotelItems from "./_components/HotelItems";
import { ScrollToTop } from "../../../../../scrolltoto";

import { useParams } from "next/navigation";

import { useHotelQuery } from "@/services/querys";
import { Hotel } from "@/types";

type HotelDetailsProps = {
  className?: string;
};

const HotelDetails = ({ className }: HotelDetailsProps) => {
  const { hotel: hotelId } = useParams();
  const { data: hotel, isLoading: loading } = useHotelQuery({
    hotelId: Array.isArray(hotelId) ? hotelId[0] : (hotelId || ""),
  });

  if (loading) return <p>Loading...</p>;
  if (!hotel) return <p>Hotel not found</p>;

  return (
    <div className={cn(" w-full", className)}>
      <ErrorBoundary fallback={<p>error</p>}>
        <Suspense fallback={<p>loading</p>}>
          <ScrollToTop />
          <HotelItems hotel={hotel} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default HotelDetails;
