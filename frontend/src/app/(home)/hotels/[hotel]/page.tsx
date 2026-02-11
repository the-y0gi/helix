"use client";

import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import HotelItems from "./_components/HotelItems";
import { ScrollToTop } from "../../../../../scrolltoto";

import { useParams } from "next/navigation";
import { getHotelById } from "@/services/hotel.service";
import { Hotel } from "@/types";

type HotelDetailsProps = {
  className?: string;
};

const HotelDetails = ({ className }: HotelDetailsProps) => {
  const { hotel: hotelId } = useParams();
  const [hotel, setHotel] = React.useState<Hotel | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (hotelId && typeof hotelId === "string") {
      getHotelById(hotelId)
        .then((data) => setHotel(data))
        .finally(() => setLoading(false));
    }
  }, [hotelId]);

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
