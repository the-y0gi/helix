"use client"
import {
  Wifi,
  Tv,
  Coffee,
  Wind,
  Refrigerator,
  Flame,
} from "lucide-react"
import DetailsTripsProvider, { BookingDetails } from "./details-trips-provider"

import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dispatch, SetStateAction } from "react";
import { useBookingByIdQuery } from "@/services/querys";
export default function ReservationDetailsPage({
  setDetails, id
}: {
  id: string, setDetails: Dispatch<SetStateAction<{
    id: string;
    open: boolean;
  }>>
}) {
  const { data: bookingg } = useBookingByIdQuery({ id });
  // console.log(booking);
  const booking = bookingg?.data;
  if (!booking) return <p>no booking</p>
  // console.log(booking.hotel);


  return (

    <div className="max-w-6xl mx-auto p-2 space-y-3">
      <Button variant="ghost" className="gap-2 px-0" onClick={() => setDetails((val) => ({
        ...val, open: false
      }))}>
        <ArrowLeft size={16} />
        Back to trips
      </Button>
      <PropertyHeaderCard booking={booking} />

      <div className="rounded-xl shadow-sm bg-background p-3 space-y-2">

        <AboutPropertySection booking={booking} />

        <Separator />

        <PriceSection booking={booking} />

        <Separator />

        <AmenitiesSection booking={booking} />

        <Separator />

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel Booking</Button>
          <Button className="gap-2">
            <Download size={16} />
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}


export function PropertyHeaderCard({ booking }: { booking: BookingDetails }) {
  const {
    hotel,
    checkIn,
    checkOut,
    status,
    roomsBooked,
    guests,
  } = booking;
  console.log(hotel);

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  return (
    <Card className="rounded-xl bg-background border shadow-sm">
      <CardContent className="p-6 flex justify-between gap-6">
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-md overflow-hidden">
            <img
              src={hotel?.thumbnail}
              alt={hotel?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{hotel.name}</h2>
            <p className="text-sm text-muted-foreground">
              {hotel.address}
            </p>
            <p className="text-sm text-muted-foreground">
              Coordinates: {hotel.coordinates[1]}, {hotel.coordinates[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Check-In</p>
            <p className="text-2xl font-semibold">
              {checkInDate.getDate()}
            </p>
            <p className="text-sm">
              {checkInDate.toLocaleString("default", { month: "long" })}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Check-Out</p>
            <p className="text-2xl font-semibold">
              {checkOutDate.getDate()}
            </p>
            <p className="text-sm">
              {checkOutDate.toLocaleString("default", { month: "long" })}
            </p>
          </div>

          <div className="text-center">
            <Badge
              className={
                status === "confirmed"
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-yellow-100 text-yellow-700 border-yellow-300"
              }
            >
              {status}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">Rooms</p>
            <p className="text-2xl font-semibold">
              {roomsBooked}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export function PriceSection({ booking }: { booking: BookingDetails }) {
  const { priceBreakdown } = booking;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Price</h3>

      <div className="flex justify-between text-sm">
        <span>Price per night</span>
        <span>€ {priceBreakdown.pricePerNight}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Tax</span>
        <span>€ {priceBreakdown.taxAmount}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Cleaning Fee</span>
        <span>€ {priceBreakdown.cleaningFee}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Discount</span>
        <span>- € {priceBreakdown.discountAmount}</span>
      </div>

      <div className="flex justify-between font-semibold pt-2">
        <span>Total Price</span>
        <span>€ {priceBreakdown.totalAmount}</span>
      </div>
    </div>
  );
}

export function AboutPropertySection({ booking }: { booking: BookingDetails }) {
  const { room, guests } = booking;

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <h3 className="font-semibold">About this property</h3>
        <p className="text-sm text-muted-foreground">
          {guests.adults} adults · {guests.children} children
        </p>
        <p className="text-sm text-muted-foreground">
          Room Size: {room.roomSizeSqm} m²
        </p>
      </div>

      <div className="rounded-lg bg-background h-40  flex items-center justify-center px-5"> <div className="relative w-full h-full rounded-md overflow-hidden"> <Image src="/map.png" alt="Hotel Arts Barcelona" fill className="object-cover" /> </div> </div>
    </div>
  );
}


export function AmenitiesSection({ booking }: { booking: BookingDetails }) {
  const { room } = booking;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium">Amenities</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {room.amenities.map((amenity: string, index: number) => (
          <div key={index} className="px-3 py-1 bg-muted rounded-md">
            {amenity}
          </div>
        ))}
      </div>
    </div>
  );
}
