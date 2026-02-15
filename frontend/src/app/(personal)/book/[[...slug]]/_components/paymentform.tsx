'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, PlusIcon } from "lucide-react"
import { usePaymentsContext } from '@/context/payments-form-provider'
import { cn } from '@/lib/utils'
import React from 'react'
import BookingCard from "@/app/(home)/hotels/[hotel]/_components/tabs"
import { IconTrash } from "@tabler/icons-react"
import { Hotel } from "@/types"
import { getHotelById } from "@/services/hotel.service"
import { ScrollToTop } from "../../../../../../scrolltoto"

type Props = {}

export const StepsView = (props: Props) => {
  // const { currentstep, setCurrentStep } = usePaymentsContext()

  return (
    <div className='w-full h-20 flex justify-center items-center'>
      <HighLightBar />


    </div>
  )
}


export const PaymentForm = () => {
  const { currentstep, setCurrentStep } = usePaymentsContext()
  switch (currentstep) {
    case 2:
      return <BookingDetails />

      break;

    default:
      break;
  }
  return (
    <FinalStep />
  )
}
export const FinalStep = () => {
  return (
    <div>
      <ScrollToTop />
      final
    </div>
  )
}
export const BookingDetailsCard = ({ hotelid: hotelId }: { hotelid: string }) => {
  const [hotel, setHotel] = React.useState<Hotel | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { setCurrentStep } = usePaymentsContext()
  React.useEffect(() => {
    if (!hotelId) return;
    if (hotelId && typeof hotelId === "string") {
      getHotelById(hotelId)
        .then((data) => setHotel(data)).then(() => {
          console.log(hotel);
        })
        .finally(() => setLoading(false));
    }
  }, [hotelId]);

  if (loading) return <p>Loading...</p>;
  if (!hotel) return <p>Hotel not found</p>;

  return (
    <div className="flex flex-col gap-5">
      <BookingCard hotel={hotel} />
      <Button onClick={() => setCurrentStep(3)}>Next</Button>
    </div>
  )
}
export function BookingDetails() {
  return (
    <main className="flex-1 min-w-0 py-6 lg:py-10 space-y-10 lg:space-y-16 w-full">
      <div className="max-w-2xl w-full space-y-6  flex flex-col gap-1 py-10">
        <TripSummaryCard />
        <Separator />
        <GuestInfoCard />
        <Separator />
        <SpecialRequestCard />
        <Separator />
        <AddOnsCard />
        <Separator />
        <CancellationPolicyCard />
      </div>
    </main>



  )
}


function TripSummaryCard() {
  return (
    <Card className="shadow-sm bg-background">
      <CardHeader>
        <CardTitle>Booking details</CardTitle>
        <p className="text-sm text-muted-foreground">Your trip</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Dates</p>
            <p className="text-muted-foreground text-sm">Jul 10–14</p>
          </div>
          <Button variant="link" size="sm">Edit</Button>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-medium">Guests</p>
            <p className="text-muted-foreground text-sm">1 guest</p>
          </div>
          <Button variant="link" size="sm">Edit</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function GuestInfoCard() {
  const [guests, setGuests] = React.useState<{
    firstname: string,
    lastname: string,

    email: string
    phone: string
  }[]>([])
  return (
    <Card className="shadow-sm bg-background">
      <CardHeader>
        <CardTitle>Guest Info</CardTitle>
        <p className="text-xs text-muted-foreground">
          Guest names must match the valid ID used at check-in.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setGuests([...guests, { firstname: "", lastname: "", email: "", phone: "" }])}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Guest
          </Button>
        </div>

        {guests.map((guest, index) => <div className="space-y-4" key={index}>
          <span>
            <IconTrash onClick={() => setGuests(guests.filter((_, i) => i !== index))} className="mr-2 h-4 w-4" />
          </span>
          <p className="font-medium text-sm">Guest {index + 1}</p>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="First Name" value={guest.firstname} onChange={(e) => setGuests((prev) => {
              const newGuests = [...prev]
              newGuests[index] = { ...guest, firstname: e.target.value }
              return newGuests
            })} />
            <Input placeholder="Last Name" value={guest.lastname} onChange={(e) => setGuests((prev) => {
              const newGuests = [...prev]
              newGuests[index] = { ...guest, lastname: e.target.value }
              return newGuests
            })} />
          </div>
        </div>)}



      </CardContent>
    </Card>
  )
}

function SpecialRequestCard() {
  return (
    <Card className="shadow-sm bg-background">
      <CardHeader>
        <CardTitle>
          Special Requests{" "}
          <span className="text-xs text-muted-foreground">
            (optional)
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Textarea
          placeholder="Let the property know if there’s anything they can assist you with."
          className="min-h-[120px]"
        />
      </CardContent>
    </Card>
  )
}
function AddOnsCard() {
  return (
    <Card className="shadow-sm bg-background">
      <CardContent className="space-y-6 pt-6">

        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">Add travel insurance?</p>
            <p className="text-xs text-muted-foreground">
              Yes, add for $100. Only available when booking.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Add
          </Button>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">Required for your trip</p>
            <p className="text-xs text-muted-foreground">
              Add and confirm your phone number to get updates.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Add
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}
function CancellationPolicyCard() {
  return (
    <Card className="shadow-sm bg-background">
      <CardHeader>
        <CardTitle>Cancellation policy</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground">
          Free cancellation before Aug 1. Cancel before check-in on Jul 10 for a partial refund.
        </p>
        <Button variant="link" size="sm" className="px-0">
          Learn more
        </Button>
      </CardContent>
    </Card>
  )
}


export const HighLightBar = () => {
  const { currentstep: currentStep, setCurrentStep } = usePaymentsContext()

  return (
    <div className="flex w-full justify-center items-center">
      {currentStep > 2 && <div className=" bg-muted rounded-md p-2 absolute left-20 cursor-pointer" onClick={() => { setCurrentStep(currentStep - 1) }}>
        <p> {"<"} back</p>
      </div>}
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">

          <div
            className={cn(
              "rounded-full h-12 w-12 flex items-center justify-center text-white font-semibold transition-all duration-300",
              currentStep > step && "bg-zinc-800",          // completed
              currentStep === step && "bg-orange-500 h-17 w-17",      // active
              currentStep < step && "bg-gray-300 text-black" // upcoming
            )}
          >
            {step}
          </div>

          {step !== 3 && (
            <div
              className={cn(
                "h-1 w-80 transition-all duration-300",
                currentStep > step ? "bg-orange-500" : "bg-gray-300"
              )}
            />
          )}
        </div>
      ))}
    </div>

  )
}
