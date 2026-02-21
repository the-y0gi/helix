"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useBookingByIdQuery, useMyBookingsQuery } from "@/services/querys"


import { useEffect, useState } from "react"
import ReservationDetailsPage from "./details-trips"

import Image from "next/image"
type ReservationStatus = "confirmed" | "pending" | "cancelled" | "completed" | "active" | "all"

export interface ReservationCardProps {
  _id: string
  hotelName: string
  thumbnail: string
  checkIn: string
  checkOut: string
  guests: {
    adults: number
    children: number
  }
  bookingId: string
  status: ReservationStatus
  onCheckDetails?: () => void
}


export function AllReservations({ variant }: { variant: "cancelled" | "all" | "completed" | "active" }) {
  const { data: tripsdata_unfiltered, isLoading } = useMyBookingsQuery();
  const trips = tripsdata_unfiltered?.data ?? [];
  console.log("hahaha", trips);

  const tripsdata =
    variant === "all"
      ? trips
      : trips.filter((val: ReservationCardProps) =>
        variant === "active"
          ? val.status === "confirmed" ||val.status ==="pending"
          : val.status === variant
      );
  const [details, setDetails] = useState<{ id: string, open: boolean }>({
    id: "",
    open: false
  })
  // console.log(tripsdata);
  if (isLoading) return <p>loading</p>
  if (!tripsdata) return <p>no bookings</p>

  if (details.open) return <ReservationDetailsPage setDetails={setDetails} id={details.id} />
  return (
    <div className="rounded-xl shadow-sm  p-8 space-y-6  max-h-screen overflow-y-scroll">
      <div>
        <h2 className="text-xl font-semibold">All Reservations</h2>
        <p className="text-sm text-muted-foreground">
          View and manage your current bookings here.
        </p>
      </div>

      {tripsdata?.map((val: ReservationCardProps) => {
        return (
          <div key={val._id}>
            <ReservationCard
              _id={val._id}
              hotelName={val.hotelName}
              thumbnail={val.thumbnail}
              checkIn={val.checkIn}
              checkOut={val.checkOut}
              guests={
                {
                  adults: val.guests.adults,
                  children: val.guests.children
                }
              }
              bookingId={val.bookingId}
              status={val.status}
              onCheckDetails={() => setDetails({ id: val._id, open: true })} />
            <Separator />
          </div>
        )
      })}

    </div>
  )
}





export function ReservationCard({
  hotelName,
  thumbnail,
  checkIn,
  checkOut,
  guests,
  bookingId,
  status,
  onCheckDetails,
}: ReservationCardProps) {
  const isConfirmed = status === "confirmed"
  // console.log(thumbnail);


  return (
    <Card className="rounded-xl bg-background shadow-none border-none">
      <CardContent className=" flex flex-col gap-4">
        <div className="flex items-start justify-between gap-6">
          {/* Left Section */}
          <div className="flex gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-md">
              <img
                src={thumbnail || "/room1.png"}
                alt={hotelName}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-base">{hotelName}</h3>
              <Separator />
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Check in:</span>{" "}
                  {new Date(checkIn).toDateString()}
                </p>
                <p>
                  <span className="font-medium text-foreground">Check out:</span>{" "}
                  {new Date(checkOut).toDateString()}
                </p>
                <p>
                  <span className="font-medium text-foreground">Guests:</span>{" "}
                  {guests.adults + guests.children}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={
                  isConfirmed
                    ? "border-green-500 text-green-600"
                    : "border-orange-500 text-orange-600"
                }
              >
                {isConfirmed ? "Confirmed" : "Pending"}
              </Badge>

              <span className="text-sm text-muted-foreground">
                ID {bookingId}
              </span>
            </div>

            <Button variant="link" className="px-0" onClick={onCheckDetails}>
              Check Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
