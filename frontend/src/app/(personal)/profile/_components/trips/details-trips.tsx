"use client";
import { BookingDetails } from "./details-trips-provider";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dispatch, SetStateAction, useState } from "react";
import { useBookingByIdQuery } from "@/services/hotel/querys";
import { cancelBooking } from "@/services/booking/booking.service";
import { useRouter } from "next/navigation";
import { PageSkeleton } from "@/components/loader/skeleton";
import { MessageModal } from "@/components/messagemodal";
import { AnimatedModalDemo } from "./mapoverlay";

export default function ReservationDetailsPage({
  setDetails,
  id,
}: {
  id: string;
  setDetails: Dispatch<SetStateAction<{ id: string; open: boolean }>>;
}) {
  const { data: bookingg, refetch, isLoading, isRefetching } = useBookingByIdQuery({ id });
  const [canceled, setCanceled] = useState(
    bookingg?.data?.status === "cancelled" ? "Cancelled" : "Cancel booking"
  );

  const booking = bookingg?.data;
  if (isLoading || isRefetching) return <PageSkeleton />;
  if (!booking) return <MessageModal title="No Booking Found" description="Please return to home page" />;

  const handelCancelBooking = () => {
    cancelBooking(id)?.then(() => refetch());
    setCanceled("Cancelled");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-3">
      <Button
        variant="ghost"
        className="gap-2 px-0"
        onClick={() => setDetails((val) => ({ ...val, open: false }))}
      >
        <ArrowLeft size={16} />
        Back to trips
      </Button>

      <PropertyHeaderCard booking={booking} />

      <div className="rounded-xl shadow-sm bg-background p-4 md:p-6 space-y-4 border">
        <AboutPropertySection booking={booking} />
        <Separator />
        <PriceSection booking={booking} />
        <Separator />
        <AmenitiesSection booking={booking} />
        <Separator />

        {/* Responsive Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handelCancelBooking}
            disabled={canceled === "Cancelled"}
          >
            {canceled}
          </Button>
          <Button className="gap-2 w-full sm:w-auto">
            <Download size={16} />
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PropertyHeaderCard({ booking }: { booking: BookingDetails }) {
  const { hotel, checkIn, checkOut, status, roomsBooked } = booking;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const router = useRouter();

  return (
    <Card className="rounded-xl bg-background border shadow-sm">
      <CardContent className="p-4 md:p-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex gap-4">
          <div
            className="w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden shrink-0 cursor-pointer"
            onClick={() => router.push(`/hotels/${hotel.hotelId}`)}
          >
            <img src={hotel?.thumbnail} alt={hotel?.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-1 md:space-y-2">
            <h2
              className="text-base md:text-lg font-semibold cursor-pointer"
              onClick={() => router.push(`/hotels/${hotel.hotelId}`)}
            >
              {hotel.name}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{hotel.address}</p>
            <p className="hidden md:block text-sm text-muted-foreground">
              Coordinates: {hotel.coordinates[1]}, {hotel.coordinates[0]}
            </p>
          </div>
        </div>

        {/* Stats Row: Grid on small, flex on large */}
        <div className="grid grid-cols-3 md:flex items-center gap-4 md:gap-10 border-t pt-4 md:border-t-0 md:pt-0">
          <div className="text-center">
            <p className="text-[10px] md:text-sm text-muted-foreground">Check-In</p>
            <p className="text-lg md:text-2xl font-semibold">{checkInDate.getDate()}</p>
            <p className="text-[10px] md:text-sm">{checkInDate.toLocaleString("default", { month: "short" })}</p>
          </div>

          <div className="text-center">
            <p className="text-[10px] md:text-sm text-muted-foreground">Check-Out</p>
            <p className="text-lg md:text-2xl font-semibold">{checkOutDate.getDate()}</p>
            <p className="text-[10px] md:text-sm">{checkOutDate.toLocaleString("default", { month: "short" })}</p>
          </div>

          <div className="text-center">
            <Badge className="text-[10px] md:text-xs px-1 md:px-2 whitespace-nowrap">
              {status}
            </Badge>
            <p className="text-[10px] md:text-sm text-muted-foreground mt-1 md:mt-2">Rooms</p>
            <p className="text-lg md:text-2xl font-semibold">{roomsBooked}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AboutPropertySection({ booking }: { booking: BookingDetails }) {
  const { room, guests, hotel } = booking;
  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <h3 className="font-semibold">About this property</h3>
        <p className="text-sm text-muted-foreground">
          {guests.adults} adults · {guests.children} children
        </p>
        <p className="text-sm text-muted-foreground">Room Size: {room.roomSizeSqm} m²</p>
      </div>

      {/* Map: Full width on mobile, 1-col width on PC */}
      <div className="rounded-lg bg-background h-48 md:h-40 flex items-center justify-center border md:px-5">
        <AnimatedModalDemo cordinates={[hotel.coordinates[0], hotel.coordinates[1]]} />
      </div>
    </div>
  );
}

export function PriceSection({ booking }: { booking: BookingDetails }) {
  const { priceBreakdown } = booking;
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Price</h3>
      <div className="max-w-md space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Price per night</span>
          <span className="text-foreground">€ {priceBreakdown.pricePerNight}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tax</span>
          <span className="text-foreground">€ {priceBreakdown.taxAmount}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Cleaning Fee</span>
          <span className="text-foreground">€ {priceBreakdown.cleaningFee}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Discount</span>
          <span className="text-red-500">- € {priceBreakdown.discountAmount}</span>
        </div>
        <div className="flex justify-between font-semibold pt-2 border-t">
          <span>Total Price</span>
          <span>€ {priceBreakdown.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}

export function AmenitiesSection({ booking }: { booking: BookingDetails }) {
  const { room } = booking;
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Amenities</p>
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        {room.amenities.map((amenity: string, index: number) => (
          <div key={index} className="px-3 py-1 bg-muted rounded-md text-xs md:text-sm">
            {amenity}
          </div>
        ))}
      </div>
    </div>
  );
}