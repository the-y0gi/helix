"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, PlusIcon } from "lucide-react";
import { usePaymentsContext } from "@/context/payments-form-provider";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import BookingCard, {
  VisitorsMembers,
} from "@/app/(home)/hotels/[hotel]/_components/tabs";
import { IconTrash } from "@tabler/icons-react";
import { Hotel } from "@/types";

import { ScrollToTop } from "../../../../../../scrolltoto";
// import { useHotelQuery } from "@/services/querys";
import { PhoneInput } from "./phoneinput";
import { createBooking, verifyPayment } from "@/services/booking.service";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm, useFormContext, UseFormReturn } from "react-hook-form";

type Props = {};

export const BookingForm = ({ slug }: { slug: string[] }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useRouter();
  const { date, guests } = useHotelStore();
  const methods = useForm<PaymentProps>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      dates: {
        checkin: date?.from?.toISOString() || "",
        checkout: date?.to?.toISOString() || "",
      },
      guests: {
        adults: guests?.adults || 0,
        children: guests?.children || 0,
      },
      guestInformation: [],
      specialRequest: "",
      rooms: [],
    },
    mode: "onChange",
  });

  const onSubmit = async (data: PaymentProps) => {
    try {
      setLoading(true);
      const bookingData = {
        hotelId: slug[0],
        roomTypeId: slug[1],
        checkIn: data.dates.checkin,
        checkOut: data.dates.checkout,
        guests: data.guests,
        roomsBooked: data.rooms.length || 1,

        primaryGuest: {
          firstName: data.guestInformation[0]?.firstname,
          lastName: data.guestInformation[0]?.lastname,
          email: data.guestInformation[0]?.email,
          phoneNumber: data.guestInformation[0]?.phone,
        },

        additionalGuests: data.guestInformation.slice(1).map((guest) => ({
          firstName: guest.firstname,
          lastName: guest.lastname,
          email: guest.email,
          phoneNumber: guest.phone,
        })),

        specialRequest: data.specialRequest,
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        const { razorpayOrder, booking } = result.data;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Hilex Booking",
          description: `Booking for ${booking.bookingReference}`,
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            try {
              const verifyResult = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyResult.success) {
                toast.success("Payment successful! Booking confirmed.");
                navigate.push("/personal/bookings"); // change is route a success page
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (error) {
              console.error("Verification Error:", error);
              toast.error("Something went wrong during payment verification.");
            }
          },
          prefill: {
            name: `${data.guestInformation[0].firstname} ${data.guestInformation[0].lastname}`,
            email: data.guestInformation[0].email,
            contact: data.guestInformation[0].phone,
          },
          theme: {
            color: "#EA580C",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        toast.error(result.message || "Failed to create booking.");
      }
    } catch (error: any) {
      console.error("Booking Error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during booking.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <StepsView />
        <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
          <PaymentForm methods={methods} />

          <aside className="hidden  lg:block lg:w-[320px] xl:w-[360px] flex-shrink-0 pt-6 lg:pt-10">
            <div className="sticky top-24 lg:top-28 z-10">
              <BookingDetailsCard hotelid={slug[0]} roomTypeId={slug[1]} />
            </div>
          </aside>
        </div>
      </form>
    </Form>
  );
};
export const StepsView = (props: Props) => {
  // const { currentstep, setCurrentStep } = usePaymentsContext()

  return (
    <div className="w-full h-20 flex justify-center items-center">
      <HighLightBar />
    </div>
  );
};

export const PaymentForm = ({
  methods,
}: {
  methods: UseFormReturn<PaymentProps>;
}) => {
  const { currentstep, setCurrentStep } = usePaymentsContext();
  switch (currentstep) {
    case 2:
      return <BookingDetails methods={methods} />;

      break;

    default:
      break;
  }
  return <FinalStep />;
};
export const FinalStep = () => {
  return (
    <div>
      <ScrollToTop />
      final
    </div>
  );
};

export const BookingDetailsCard = ({
  hotelid,
  roomTypeId,
}: {
  hotelid: string;
  roomTypeId: string;
}) => {
  const { selectedRoom } = useHotelStore();
  const methods = useFormContext<PaymentProps>();

  const checkin = methods.watch("dates.checkin");
  const checkout = methods.watch("dates.checkout");
  const adults = methods.watch("guests.adults");
  const children = methods.watch("guests.children");

  const nights = selectedRoom?.nights || 0;
  const pricePerNight = selectedRoom?.pricePerNight || 0;
  const totalPrice = selectedRoom?.totalPrice || 0;

  if (!selectedRoom) {
    return (
      <Card className="p-4">
        <p className="text-sm text-destructive">
          Selected room not found. Please go back.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-lg">{selectedRoom.title}</h3>

        <img
          src={selectedRoom.image || "/img1.png"}
          alt={selectedRoom.title}
          className="w-full h-40 object-cover rounded-md"
        />

        <div className="text-sm text-muted-foreground">
          {checkin && checkout ? (
            <>
              {format(new Date(checkin), "dd MMM yyyy")} –{" "}
              {format(new Date(checkout), "dd MMM yyyy")}
            </>
          ) : (
            "Dates not selected"
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {adults} adult{adults > 1 ? "s" : ""} • {children} child
          {children !== 1 ? "ren" : ""}
        </div>

        <div className="border-t pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              ₹{pricePerNight} × {nights} night{nights !== 1 ? "s" : ""}
            </span>
            <span>₹{(pricePerNight * nights).toLocaleString()}</span>
          </div>

          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <Button
        type="submit"
        disabled={nights <= 0}
        className="w-full font-semibold"
      >
        {nights <= 0 ? "Select valid dates" : "Proceed to Pay"}
      </Button>
    </div>
  );
};

import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentProps, PaymentSchema } from "@/schema/payment.schema";
import { useHotelStore } from "@/store/hotel.store";
import { Field, FieldGroup } from "@/components/ui/field";

export function BookingDetails({
  methods,
}: {
  methods: UseFormReturn<PaymentProps>;
}) {
  return (
    <main className="flex-1 min-w-0 py-6 lg:py-10 space-y-10 lg:space-y-16 w-full">
      <div className="max-w-2xl w-full space-y-6  flex flex-col gap-1 py-10">
        <TripSummaryCard methods={methods} />
        <Separator />
        <GuestInfoCard methods={methods} />
        <Separator />
        <SpecialRequestCard methods={methods} />
        <Separator />
        <AddOnsCard />
        <Separator />
        <CancellationPolicyCard />
      </div>
    </main>
  );
}

import { differenceInDays, format } from "date-fns";
function TripSummaryCard({
  methods,
}: {
  methods: UseFormReturn<PaymentProps>;
}) {
  const checkin = methods.getValues("dates.checkin");
  const checkout = methods.getValues("dates.checkout");
  return (
    <Card className="shadow-sm bg-background">
      <CardHeader>
        <CardTitle>Booking details</CardTitle>
        <p className="text-sm text-muted-foreground">Your trip</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <p className="font-medium">Dates</p>
          <p className="text-muted-foreground text-sm">
            {checkin ? format(new Date(checkin), "yyyy-MM-dd") : "—"} -{" "}
            {checkout ? format(new Date(checkout), "yyyy-MM-dd") : "—"}
          </p>
          <DialougeEditDates
            methods={methods}
            trigger="Edit"
            content={<div>sdsd</div>}
          />
        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-medium">Guests</p>
            <p className="text-muted-foreground text-sm">
              {methods.getValues("guests.adults")} adults{" "}
              {methods.getValues("guests.children")} children
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function DialougeEditDates({
  methods,
  trigger,
  content,
}: {
  methods: UseFormReturn<PaymentProps>;
  trigger: string;
  content: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-xs">
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className=" w-[800px] max-w-[800px] border-none flex flex-col gap-4 ">
        <DialogTitle>Edit Dates</DialogTitle>
        <DialogDescription>Edit your dates and guests</DialogDescription>
        <div className="flex gap-4">
          <HotelCalender className="p-4" methods={methods} />
          <VisitorsMembers showCalendar={false} methods={methods} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GuestInfoCard({ methods }: { methods: UseFormReturn<PaymentProps> }) {
  const { control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guestInformation",
  });

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
          <Button
            type="button"
            onClick={() =>
              append({
                firstname: "",
                lastname: "",
                email: "",
                phone: "",
              })
            }
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Guest
          </Button>
        </div>
        {fields.map((field, index) => (
          <div className="space-y-4 border p-4 rounded-lg" key={field.id}>
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">
                {index === 0 ? "Primary Guest" : `Guest ${index + 1}`}
              </p>
              {index !== 0 && (
                <IconTrash
                  onClick={() => remove(index)}
                  className="h-4 w-4 cursor-pointer text-destructive"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FormField
                  control={control}
                  name={`guestInformation.${index}.firstname`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              <Field>
                <FormField
                  control={control}
                  name={`guestInformation.${index}.lastname`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              {index === 0 && (
                <>
                  <Field className="col-span-2">
                    <FormField
                      control={control}
                      name={`guestInformation.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>

                  <Field className="col-span-2">
                    <FormField
                      control={control}
                      name={`guestInformation.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SpecialRequestCard({
  methods,
}: {
  methods: UseFormReturn<PaymentProps>;
}) {
  return (
    <Card className="shadow-sm bg-background">
      <CardHeader>
        <CardTitle>
          Special Requests{" "}
          <span className="text-xs text-muted-foreground">(optional)</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Textarea
          placeholder="Let the property know if there’s anything they can assist you with."
          className="min-h-[120px]"
          {...methods.register("specialRequest")}
        />
      </CardContent>
    </Card>
  );
}
import { useFieldArray } from "react-hook-form";
import { HotelCalender } from "@/app/(home)/hotels/[hotel]/_components/calander-booking";

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
  );
}
function CancellationPolicyCard() {
  return (
    <Card className="shadow-sm bg-background">
      <CardHeader>
        <CardTitle>Cancellation policy</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground">
          Free cancellation before Aug 1. Cancel before check-in on Jul 10 for a
          partial refund.
        </p>
        <Button variant="link" size="sm" className="px-0">
          Learn more
        </Button>
      </CardContent>
    </Card>
  );
}

export const HighLightBar = () => {
  const { currentstep: currentStep, setCurrentStep } = usePaymentsContext();

  return (
    <div className="flex w-full justify-center items-center">
      {currentStep > 2 && (
        <div
          className=" bg-muted rounded-md p-2 absolute left-20 cursor-pointer"
          onClick={() => {
            setCurrentStep(currentStep - 1);
          }}
        >
          <p> {"<"} back</p>
        </div>
      )}
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "rounded-full h-12 w-12 flex items-center justify-center text-white font-semibold transition-all duration-300",
              currentStep > step && "bg-zinc-800", // completed
              currentStep === step && "bg-orange-500 h-17 w-17", // active
              currentStep < step && "bg-gray-300 text-black", // upcoming
            )}
          >
            {step}
          </div>

          {step !== 3 && (
            <div
              className={cn(
                "h-1 w-80 transition-all duration-300",
                currentStep > step ? "bg-orange-500" : "bg-gray-300",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
