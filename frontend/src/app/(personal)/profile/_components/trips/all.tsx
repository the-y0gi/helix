"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMyBookingsQuery } from "@/services/hotel/querys";

import { useState } from "react";
import ReservationDetailsPage from "./details-trips";

import EmptyBookings from "./notrips";
import { SkeletonAvatar, SkeletonText } from "@/components/loader/skeleton";
type ReservationStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "active"
  | "all";

export interface ReservationCardProps {
  hotelId:string;
  _id: string;
  hotelName: string;
  thumbnail: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  bookingId: string;
  status: ReservationStatus;
  onCheckDetails?: () => void;
}

export function AllReservations({
  variant,
}: {
  variant: "cancelled" | "all" | "completed" | "active";
}) {
  const { data: tripsdata_unfiltered, isLoading } = useMyBookingsQuery();


  const trips = tripsdata_unfiltered?.data ?? [];

 

  const tripsdata =
    variant === "all"
      ? trips
      : trips.filter((val: ReservationCardProps) =>
          variant === "active"
            ? val.status === "confirmed" || val.status === "pending"
            : val.status === variant,
        );
  const [details, setDetails] = useState<{ id: string; open: boolean }>({
    id: "",
    open: false,
  });
  if (isLoading) return <Skel />;
  if (!tripsdata) return <p>no bookings</p>;

  if (details.open)
    return <ReservationDetailsPage setDetails={setDetails} id={details.id} />;

  if (tripsdata.length === 0) return <EmptyBookings variant={variant} />;
  return (
    <div className="rounded-xl shadow-sm  p-8 space-y-6  max-h-screen overflow-y-scroll">
      <div>
        <h2 className="text-xl font-semibold">All Reservations</h2>
        <p className="text-sm text-muted-foreground">
          View and manage your current bookings here.
        </p>
      </div>

      {isLoading
        ? [...Array(6)].map((_, i) => {
            return <SkeletonAvatar key={i} />;
          })
        : tripsdata?.map((val: ReservationCardProps) => {
            return (
              <div key={val._id}>
                <ReservationCard
                hotelId={val.hotelId}
                  _id={val._id}
                  hotelName={val.hotelName}
                  thumbnail={val.thumbnail}
                  checkIn={val.checkIn}
                  checkOut={val.checkOut}
                  guests={{
                    adults: val.guests.adults,
                    children: val.guests.children,
                  }}
                  bookingId={val.bookingId}
                  status={val.status}
                  onCheckDetails={() => setDetails({ id: val._id, open: true })}
                />
                <Separator />
              </div>
            );
          })}
    </div>
  );
}

const Skel = () => {
  return (
    <div className="rounded-xl shadow-sm  p-8 space-y-6  max-h-screen overflow-y-scroll">
      <div>
        <SkeletonText />
      </div>

      {[...Array(6)].map((_, i) => {
        return <SkeletonAvatar key={i} />;
      })}
    </div>
  );
};


import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";



export function ReservationCard({
  hotelId,
  hotelName,
  thumbnail,
  checkIn,
  checkOut,
  guests,
  bookingId,
  status,
  _id,
  onCheckDetails,
}: ReservationCardProps) {
  const router = useRouter();
  const isConfirmed = status === "confirmed";

  return (
    <Card className="rounded-xl bg-background shadow-sm border border-border/40 hover:shadow-md transition-shadow">
      <CardContent className="">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 sm:gap-6">
          {/* Left Section – Image + Info */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Hotel Image */}
            <div className="relative h-32 sm:h-24 w-full sm:w-32 min-w-[128px] overflow-hidden rounded-lg">
              <img
                src={thumbnail || "/room1.png"}
                alt={hotelName}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Hotel Details */}
            <div className="flex-1 space-y-3 sm:space-y-2">
              <h3
                onClick={() => router.push(`/hotels/${hotelId}`)}
                className="font-semibold text-lg sm:text-base cursor-pointer hover:text-primary transition-colors line-clamp-2"
              >
                {hotelName}
              </h3>

              <Separator className="my-2 sm:hidden" />

              <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:gap-6 gap-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Check-in:</span>{" "}
                  {new Date(checkIn).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <span className="font-medium text-foreground">Check-out:</span>{" "}
                  {new Date(checkOut).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <span className="font-medium text-foreground">Guests:</span>{" "}
                  {guests.adults + guests.children} 
                  {guests.adults + guests.children === 1 ? " person" : " people"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section – Status + Button */}
          <div className="flex flex-col items-start sm:items-end gap-4 sm:gap-3 mt-3 sm:mt-0">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "px-3 py-1 text-xs sm:text-sm font-medium",
                  isConfirmed
                    ? "border-green-500/70 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                    : "border-amber-500/70 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                )}
              >
                {isConfirmed ? "Confirmed" : status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>

              <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                {bookingId}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="px-6 sm:px-0 sm:w-auto w-full sm:text-base"
              onClick={onCheckDetails}
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}