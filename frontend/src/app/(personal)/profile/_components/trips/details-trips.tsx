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
import { Skeleton } from "@/components/ui/skeleton";
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
  if (isLoading || isRefetching) return <TripsDetailsSkeleton />;
  if (!booking) return <MessageModal title="No Booking Found" description="Please return to home page" />;

  const handelCancelBooking = () => {
    cancelBooking(id)?.then(() => refetch());
    setCanceled("Cancelled");
  };
  const handelDownload = async () => {
    try {
      const res = await downloadBookings(id);

    } catch (error) {
      console.error(error)
    }
  }
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
          <Button className="gap-2 w-full sm:w-auto"
            onClick={() => {
              handelDownload()

            }}>
            <Download size={16} />
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
import NProgress from 'nprogress'
import { RouterPush } from "@/components/RouterPush";
import Rupee from "@/components/Rupee";
import { downloadBookings } from "@/app/(personal)/book/[[...slug]]/_components/book.service";
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
            onClick={() => {
              RouterPush(router, `/hotels/${hotel.hotelId}`)
            }}
          >
            <img src={hotel?.thumbnail} alt={hotel?.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-1 md:space-y-2">
            <h2
              className="text-base md:text-lg font-semibold cursor-pointer"
              onClick={() => {
                RouterPush(router, `/hotels/${hotel.hotelId}`)
              }}
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
          <span className="text-foreground"><Rupee /> {priceBreakdown.pricePerNight}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tax</span>
          <span className="text-foreground"><Rupee /> {priceBreakdown.taxAmount}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Cleaning Fee</span>
          <span className="text-foreground"><Rupee /> {priceBreakdown.cleaningFee}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Discount</span>
          <span className="text-red-500">- <Rupee /> {priceBreakdown.discountAmount}</span>
        </div>
        <div className="flex justify-between font-semibold pt-2 border-t">
          <span>Total Price</span>
          <span><Rupee /> {priceBreakdown.totalAmount}</span>
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

export function TripsDetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-3">
      {/* Back button */}
      <Skeleton className="h-9 w-32 rounded-md" />

      {/* PropertyHeaderCard Skeleton */}
      <Card className="rounded-xl bg-background border shadow-sm">
        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex gap-4">
            {/* Image */}
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-md shrink-0" />
            {/* Text */}
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 md:h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="hidden md:block h-4 w-40" />
            </div>
          </div>
          {/* Stats Row */}
          <div className="grid grid-cols-3 md:flex items-center gap-4 md:gap-10 border-t pt-4 md:border-t-0 md:pt-0">
            {/* Check-In */}
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-6 md:h-8 w-8" />
              <Skeleton className="h-3 w-10" />
            </div>
            {/* Check-Out */}
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-6 md:h-8 w-8" />
              <Skeleton className="h-3 w-10" />
            </div>
            {/* Rooms */}
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-3 w-10 mt-1" />
              <Skeleton className="h-6 md:h-8 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl shadow-sm bg-background p-4 md:p-6 space-y-4 border">
        {/* AboutPropertySection */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="rounded-lg h-48 md:h-40 flex items-center justify-center">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        </div>

        <Separator />

        {/* PriceSection */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-16" />
          <div className="max-w-md space-y-2">
            <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
            <div className="flex justify-between"><Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-16" /></div>
            <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
            <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-16" /></div>
            <div className="flex justify-between pt-2 border-t mt-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-20" /></div>
          </div>
        </div>

        <Separator />

        {/* AmenitiesSection */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-28 rounded-md" />
          </div>
        </div>

        <Separator />

        {/* Responsive Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
}