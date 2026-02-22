"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Copy } from "lucide-react";
import { useRef } from "react";
import { usePaymentsContext } from "@/context/payments-form-provider";
import { cn } from "@/lib/utils";
import React from "react";
import { VisitorsMembers } from "@/app/(home)/hotels/[hotel]/_components/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentProps, PaymentSchema } from "@/schema/payment.schema";
import { Payment, useHotelStore } from "@/store/hotel.store";
import { Field } from "@/components/ui/field";

import { ScrollToTop } from "../../../../../../scrolltoto";
// import { useHotelQuery } from "@/services/querys";
import { PhoneInput } from "./phoneinput";
import {
  createBooking,
  verifyPayment,
} from "@/services/booking/booking.service";
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
export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
export type BookingData = {
  hotelId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomsBooked: number;
  primaryGuest: GuestInfo;
  additionalGuests: GuestInfo[];
  specialRequest?: string | null;
};
export const BookingForm = ({ slug }: { slug: string[] }) => {
  const { setPayments } = useHotelStore();
  const { setCurrentStep, currentstep } = usePaymentsContext();

  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useRouter();
  const { date, guests } = useHotelStore();
  console.log("lalaal", date, guests);
  const total = guests?.adults + guests?.children;

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
      guestInformation: Array(total).fill({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
      }),
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
        guests: data.guests.adults + data.guests.children,
        roomsBooked: data.rooms.length || 1,

        primaryGuest: {
          firstName: data.guestInformation[0]?.firstname || "",
          lastName: data.guestInformation[0]?.lastname || "",
          email: data.guestInformation[0]?.email || "",
          phoneNumber: data.guestInformation[0]?.phone || "",
        },

        additionalGuests: data.guestInformation.slice(1).map((guest) => ({
          firstName: guest.firstname || "",
          lastName: guest.lastname || "",
          email: guest.email || "",
          phoneNumber: guest.phone || "",
        })),

        specialRequest: data.specialRequest,
      };

      const result = await createBooking(bookingData);
      console.log("mohit rajput", result);

      if (result?.success) {
        const { razorpayOrder, booking } = result.data;
        setPayments({
          razorpay_order_id: razorpayOrder.id,
          razorpay_payment_id: razorpayOrder.id,
          razorpay_signature: razorpayOrder.receipt,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          status: razorpayOrder.status,
          firstname: booking.primaryGuest.firstName,
          contact: booking.primaryGuest.phoneNumber,
          lastname: booking.primaryGuest.lastName,
          email: booking.primaryGuest.email,
          phone: booking.primaryGuest.phoneNumber,
          createdAt: booking.createdAt,
        });
        setCurrentStep((val) => val + 1);
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Hilex Booking",
          description: `Booking for ${booking.bookingReference}`,
          order_id: razorpayOrder.id,
          handler: async function (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) {
            try {
              const verifyResult = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyResult.success) {
                toast.success("Payment successful! Booking confirmed.");
                console.log("verifyResult", verifyResult);

                // navigate.push("/personal/bookings"); // change is route a success page
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

        const rzp = new (window as unknown as { Razorpay: any }).Razorpay(
          options,
        );
        rzp.open();
      } else {
        toast.error(result?.message || "Failed to create booking.");
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Booking Error:", error);
      toast.error(
        err.response?.data?.message || "An error occurred during booking.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <StepsView />
        {!loading ? (
          <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
            <PaymentForm methods={methods} />

            {currentstep === 2 && (
              <aside className="  lg:block lg:w-[320px] xl:w-[360px] flex-shrink-0 pt-6 lg:pt-10">
                <div className="sticky top-24 lg:top-28 z-10">
                  <BookingDetailsCard
                    hotelid={slug[0]}
                    roomTypeId={slug[1]}
                    loading={loading}
                  />
                </div>
              </aside>
            )}
          </div>
        ) : (
          <div className="w-full flex justify-center py-20">
            <Spinner />
          </div>
        )}
      </form>
    </Form>
  );
};
export const StepsView = () => {
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
  const { currentstep } = usePaymentsContext();
  switch (currentstep) {
    case 2:
      return <BookingDetails methods={methods} />;

    default:
      break;
  }
  return <FinalStep />;
};
export const FinalStep = () => {
  const { payments } = useHotelStore();
  return (
    <div className="w-full flex items-center justify-center">
      <ScrollToTop />
      <PaymentSuccess
        payment={{
          razorpay_payment_id: payments.razorpay_payment_id,
          razorpay_order_id: payments.razorpay_order_id,
          razorpay_signature: payments.razorpay_signature,
          amount: payments.amount,
          currency: payments.currency,
          status: payments.status,
          email: payments.email,
          contact: payments.contact,
          createdAt: payments.createdAt,
          firstname: payments.firstname,
          lastname: payments.lastname,
          phone: payments.phone,
        }}
      />
    </div>
  );
};

interface PaymentSuccessProps {
  payment: Payment;
}
import html2pdf from "html2pdf.js";

export default function PaymentSuccess({ payment }: PaymentSuccessProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const formatAmount = (amount: number) => {
    return (amount / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: payment.currency || "INR",
      minimumFractionDigits: 2,
    });
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDownload = async () => {
    if (!receiptRef.current) {
      console.warn("Receipt ref not found");
      return;
    }

    try {
      const opt = {
        margin: 0.5,
        type: "blob",
        filename: "receipt.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: true }, // ← turn logging on temporarily
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      } as const;

      await html2pdf().set(opt).from(receiptRef.current).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert(
        "Could not generate PDF – please try again or screenshot the receipt.",
      );
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6">
      <div
        className={cn(
          "w-full max-w-6xl",
          "bg-card text-card-foreground",
          "border border-border rounded-xl shadow-xl",
          "flex flex-col overflow-hidden",
        )}
        style={{ height: "600px" }}
      >
        {/* Header */}
        <div className="bg-primary/10 border-b border-border px-6 py-7 md:px-10 md:py-8 shrink-0">
          <div className="flex items-center justify-center gap-4">
            <CheckCircle2 className="h-12 w-12 md:h-14 md:w-14 text-primary" />
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Payment Successful
              </h1>
              <p className="mt-1.5 text-muted-foreground">
                Thank you! Your payment has been processed.
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div
          className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 space-y-8 bg-background"
          ref={receiptRef}
        >
          {/* Amount highlight */}
          <Card className="bg-primary/5 border-primary/20 text-center">
            <CardContent className="pt-8 pb-9">
              <p className="text-muted-foreground text-lg mb-2">Amount Paid</p>
              <p className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                {formatAmount(payment.amount)}
              </p>
              <p className="mt-3 text-sm font-medium uppercase tracking-wider text-primary/80">
                {payment.status}
              </p>
            </CardContent>
          </Card>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 bg-background">
            <InfoItem
              label="Payment ID"
              value={payment.razorpay_payment_id}
              copyable
            />
            <InfoItem
              label="Order ID"
              value={payment.razorpay_order_id}
              copyable
            />
            <InfoItem
              label="Signature"
              value={payment.razorpay_signature}
              copyable
              long
            />
            <InfoItem
              label="Date & Time"
              value={formatDate(payment.createdAt)}
            />
            <InfoItem label="Email" value={payment.email} />
            <InfoItem label="Phone" value={payment.phone} />
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4">
            A receipt has been sent to{" "}
            <span className="font-medium">{payment.email}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-border bg-muted/40 px-6 py-6 md:px-10 md:py-7 flex flex-col sm:flex-row items-center justify-center gap-4 shrink-0">
          <Button
            className="min-w-[180px]"
            size="lg"
            // onClick={handleDownload}
          >
            Download Receipt
          </Button>
          <Button
            variant="outline"
            className="min-w-[180px]"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();

              router.push("/");

              // setPayments(null as unknown as Payment);
              console.log("payment cleared");
            }}
          >
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}

type InfoItemProps = {
  label: string;
  value: string;
  copyable?: boolean;
  long?: boolean;
};

function InfoItem({ label, value, copyable, long }: InfoItemProps) {
  return (
    <div className="bg-muted/40 rounded-lg border border-border p-4 hover:border-border/80 transition-colors">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </dt>
      <dd
        className={cn(
          "text-sm md:text-base break-all font-mono",
          long && "line-clamp-2",
        )}
        title={value}
      >
        {value}
      </dd>

      {copyable && (
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="mt-2.5 text-xs text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors"
          title="Copy to clipboard"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </button>
      )}
    </div>
  );
}

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex justify-between items-center border rounded-md px-4 py-2 bg-background">
//       <span className="text-muted-foreground">{label}</span>
//       <span className="font-medium break-all">{value}</span>
//     </div>
//   );
// }
export const BookingDetailsCard = ({
  loading,
}: {
  loading?: boolean;
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
  const navigate = useRouter();
  if (!selectedRoom) {
    return (
      <Card className="p-4">
        <p className="text-sm text-destructive">
          Selected room not found. Please go back.
        </p>
        <Button onClick={() => navigate.back()}>Back</Button>
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
        disabled={nights <= 0 || loading}
        className="w-full font-semibold"
      >
        {nights <= 0 ? "Select valid dates" : "Proceed to Pay"}
      </Button>
    </div>
  );
};

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

import { format } from "date-fns";
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
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DialougeEditDates({
  methods,
  trigger,
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

  const { fields } = useFieldArray({
    control,
    name: "guestInformation",
  });
  const { date, guests } = useHotelStore();

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
          {/* <Button
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
          </Button> */}
        </div>
        {fields.map((field, index) => (
          <div className="space-y-4 border p-4 rounded-lg" key={field.id}>
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">
                {index === 0 ? "Primary Guest" : `Guest ${index + 1}`}
              </p>
              {/* {index !== 0 && (
                <IconTrash
                  onClick={() => remove(index)}
                  className="h-4 w-4 cursor-pointer text-destructive"
                />
              )} */}
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
import { type } from "os";
import { Spinner } from "@/components/spinner";

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
  const { currentstep: currentStep } = usePaymentsContext();

  return (
    <div className="flex w-full justify-center items-center">
      {/* {currentStep > 2 && (
        <div
          className=" bg-muted rounded-md p-2 absolute left-20 cursor-pointer"
          onClick={() => {
            setCurrentStep(currentStep - 1);
          }}
        >
          <p> {"<"} back</p>
        </div>
      )} */}
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
