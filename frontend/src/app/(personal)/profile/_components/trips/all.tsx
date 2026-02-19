"use client"


import { useEffect, useState } from "react"
import ReservationDetailsPage from "./details-trips"

type ReservationStatus = "confirmed" | "pending"

export interface ReservationCardProps {
  hotelName: string
  image: string
  checkIn: string
  checkOut: string
  guests: string
  bookingId: string
  status: ReservationStatus
  onCheckDetails?: () => void
}


export function AllReservations({ variant }: { variant: "cancelled" | "all" | "completed" | "active" }) {
  const { data: tripsdata, isLoading } = useTripsQuery();


  const [details, setDetails] = useState({
    id: "",
    open: false
  })
  if (details.open) return <ReservationDetailsPage setDetails={setDetails} />
  return (
    <div className="rounded-xl shadow-sm  p-8 space-y-6  max-h-screen overflow-y-scroll">
      <div>
        <h2 className="text-xl font-semibold">All Reservations</h2>
        <p className="text-sm text-muted-foreground">
          View and manage your current bookings here.
        </p>
      </div>

      {tripsdata?.map((val, i) => {
        return (
          <div key={i}>
            <ReservationCard

              hotelName={val.hotelName}
              image={val.image}
              checkIn={val.checkIn}
              checkOut={val.checkOut}
              guests={val.guests}
              bookingId={val.bookingId}
              status={val.status}
              onCheckDetails={() => setDetails({ id: val.bookingId, open: true })}
            />
            <Separator />
          </div>
        )
      })}

    </div>
  )
}

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useTripsQuery } from "@/services/querys"




export function ReservationCard({
  hotelName,
  image,
  checkIn,
  checkOut,
  guests,
  bookingId,
  status,
  onCheckDetails,
}: ReservationCardProps) {
  const isConfirmed = status === "confirmed"

  return (
    <Card className="rounded-xl bg-background shadow-none border-none">
      <CardContent className=" flex flex-col gap-4">
        <div className="flex items-start justify-between gap-6">
          {/* Left Section */}
          <div className="flex gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-md">
              <Image
                src="/room1.png"
                alt={hotelName}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-base">{hotelName}</h3>
              <Separator />
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Check in:</span>{" "}
                  {checkIn}
                </p>
                <p>
                  <span className="font-medium text-foreground">Check out:</span>{" "}
                  {checkOut}
                </p>
                <p>
                  <span className="font-medium text-foreground">Guests:</span>{" "}
                  {guests}
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
