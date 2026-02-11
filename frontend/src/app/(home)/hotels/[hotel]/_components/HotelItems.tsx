"use client";
import { IconHeart, IconShare, IconStarFilled } from "@tabler/icons-react";
import React from "react";
import { TabsLine } from "./tabs";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { hotelService } from "@/services/hotel.service";

const HotelItems = () => {
  const { hotel: hotelId } = useParams();

  const {
    data: hotel,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: () => hotelService.getHotelById(hotelId as string),
    enabled: !!hotelId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-1/3 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-[400px] w-full bg-muted rounded-2xl" />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold">Hotel not found</h2>
        <p className="text-muted-foreground">
          The hotel you are looking for might have been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{hotel.name}</h1>

            <div className="flex items-center gap-1">
              {[...Array(hotel.stars || 5)].map((_, i) => (
                <IconStarFilled key={i} color="gold" size={14} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconHeart className="cursor-pointer text-red-500" size={20} />
            <IconShare className="cursor-pointer text-gray-600" size={20} />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {hotel.city}, {hotel.address}
        </p>
      </div>

      <div className="border-t pt-4">
        <TabsLine
          values={[
            { title: "overview", id: 1 },
            { id: 2, title: "amenities" },
            { id: 3, title: "location" },
            { id: 4, title: "rooms" },
            { id: 5, title: "reviews" },
          ]}
        />
      </div>
    </div>
  );
};

export default HotelItems;
