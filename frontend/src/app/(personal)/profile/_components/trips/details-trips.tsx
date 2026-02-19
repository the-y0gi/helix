"use client"

import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Separator } from "@/components/ui/separator"

export default function ReservationDetailsPage({
    setDetails
}:{setDetails: Dispatch<SetStateAction<{
    id: string;
    open: boolean;
}>>}) {
  return (
    <div className="max-w-6xl mx-auto p-2 space-y-3">
      <Button variant="ghost" className="gap-2 px-0" onClick={()=>setDetails((val)=>({
            ...val,open:false
        }))}>
        <ArrowLeft size={16}  />
        Back to trips
      </Button>
      <PropertyHeaderCard />

      <div className="rounded-xl shadow-sm bg-background p-3 space-y-2">
        <AboutPropertySection />

        <Separator />

        <PriceSection />

        <Separator />

        <AmenitiesSection />

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
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function PropertyHeaderCard() {
  return (
    <Card className="rounded-xl bg-background border-none shadow-sm">
      <CardContent className="p-6 flex justify-between gap-6">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 rounded-md overflow-hidden">
            <Image
              src="/room1.png"
              alt="Hotel Arts Barcelona"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Hotel Arts Barcelona</h2>
            <p className="text-sm text-muted-foreground">
              Address: Marina, 19-21, Ciutat Vella, 08005 Barcelona, Spain
            </p>
            <p className="text-sm text-muted-foreground">
              Phone: +38 540 979 5428
            </p>
            <p className="text-sm text-muted-foreground">
              GPS: N 40° 50.963, E 14° 15.348
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Check-In</p>
            <p className="text-2xl font-semibold">14</p>
            <p className="text-sm">August</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Check-Out</p>
            <p className="text-2xl font-semibold">19</p>
            <p className="text-sm">August</p>
          </div>

          <div className="text-center">
            <Badge className="mb-2 bg-green-100 text-green-700 border-green-300">
              Confirmed
            </Badge>
            <p className="text-sm text-muted-foreground">Rooms</p>
            <p className="text-2xl font-semibold">15 / 5</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export function PriceSection() {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Price</h3>

      <div className="flex justify-between text-sm">
        <span>1 unit</span>
        <span>€ 168.55</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>10% VAT</span>
        <span>€ 16.85</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Cleaning fee per stay</span>
        <span>€ 35</span>
      </div>

      <div className="flex justify-between font-semibold pt-2">
        <span>Total Price</span>
        <span>€ 2,560</span>
      </div>
    </div>
  )
}

export function AboutPropertySection() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <h3 className="font-semibold">About this property</h3>
        <p className="text-sm text-muted-foreground">
          2 guests · Studio · 1 bed · 1.5 baths
        </p>
        <p className="text-sm text-muted-foreground">
          Welcome to my fully refurbished 17 m² studio, ideally located in
          Versailles, only a 10-minute walk to the Palace of Versailles and a
          5-minute walk to the Rive Gauche train station.
        </p>
      </div>

      <div className="rounded-lg bg-muted h-40 flex items-center justify-center">
         <div className="relative w-full h-full rounded-md overflow-hidden">
            <Image
              src="/map.png"
              alt="Hotel Arts Barcelona"
              fill
              className="object-cover"
            />
          </div>
      </div>
    </div>
  )
}
import {
  Wifi,
  Tv,
  Coffee,
  Wind,
  Refrigerator,
  Flame,
} from "lucide-react"
import { Dispatch, SetStateAction } from "react";

export function AmenitiesSection() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm">
          <span className="font-medium">Guest name:</span> Anna George
        </p>
        <p className="text-sm text-muted-foreground">
          There is no meal included in the rate for this apartment.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><Flame size={16}/> Hot tub</div>
        <div className="flex items-center gap-2"><Tv size={16}/> TV</div>
        <div className="flex items-center gap-2"><Wind size={16}/> Air conditioning</div>
        <div className="flex items-center gap-2"><Refrigerator size={16}/> Refrigerator</div>
        <div className="flex items-center gap-2"><Coffee size={16}/> Coffee machine</div>
        <div className="flex items-center gap-2"><Wifi size={16}/> Wifi</div>
      </div>
    </div>
  )
}
