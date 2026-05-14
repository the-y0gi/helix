"use client";

import React, { useState } from "react";
import { useForm, useFormContext, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Check,
  CreditCard,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/spinner";
import { ScrollToTop } from "../../../../../../scrolltoto";
import { Form } from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { usePaymentsContext } from "@/context/payments-form-provider";
import { PaymentProps, PaymentSchema } from "@/schema/payment.schema";
import {
  createServiceBooking,
  verifyServicePayment,
} from "@/services/booking/service-booking.service";
import { handleRefresh } from "@/services/dailyfunctions";
import { useQueryClient } from "@tanstack/react-query";
import { hooksSupplier } from "@/components/navbar/filter-nav-bar/calander05";
import { HighLightBar } from "./HightLightBar";
import { CancellationPolicyCard } from "./CanclePolicy";
import {
  AddOnsCard,
  GuestInfoCard,
  SpecialRequestCard,
  TripSummaryCard,
} from "./Addoncards";
import { PaymentSuccess } from "./PaymentSuccess";

// ─── Types ────────────────────────────────────────────────────────────────────
type ServiceType = "tour" | "bike" | "adventure" | "cab";

// ─── Main BookingForm ────────────────────────────────────────────────────────
export const BookingForm = ({
  slug,
  hookname,
  serviceType,
  initialDate,
  initialGuests,
}: {
  slug: string[];
  hookname: keyof typeof hooksSupplier;
  serviceType: string;
  initialDate?: string;
  initialGuests?: string;
}) => {
  const store = hooksSupplier[hookname]();
  const { date, guests, setPayments } = store;

  const { setCurrentStep, currentstep } = usePaymentsContext();
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const ismobile = useIsMobile();

  const total = (guests?.adults || 0) + (guests?.children || 0);

  const methods = useForm<PaymentProps>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      dates: {
        checkin: date?.from ? format(date.from, "yyyy-MM-dd") : "",
        checkout: date?.to ? format(date.to, "yyyy-MM-dd") : "",
      },
      guests: {
        adults: guests?.adults || 0,
        children: guests?.children || 0,
      },
      guestInformation: Array(total || 1).fill({
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

  React.useEffect(() => {
    if (date?.from && date?.to) {
      methods.setValue("dates.checkin", format(date.from, "yyyy-MM-dd"));
      methods.setValue("dates.checkout", format(date.to, "yyyy-MM-dd"));
    }
  }, [date, methods]);

  const buildPayload = (data: PaymentProps) => {
    const serviceId = slug[0];

    const primaryCustomer = {
      firstName: data.guestInformation[0]?.firstname || "",
      lastName: data.guestInformation[0]?.lastname || "",
      email: data.guestInformation[0]?.email || "",
      phoneNumber: data.guestInformation[0]?.phone || "",
    };

    const participants = data.guestInformation.map((g) => ({
      name: `${g.firstname} ${g.lastname}`.trim(),
      age: 25,
      gender: "male" as const,
    }));

    const bookingDate = data.dates.checkin || format(new Date(), "yyyy-MM-dd");

    let meta: Record<string, any> = { note: data.specialRequest || "" };
    let extra: Record<string, any> = {};

    switch (serviceType as ServiceType) {
      case "bike":
        meta = {
          ...meta,
          startDate: data.dates.checkin,
          endDate: data.dates.checkout,
          pickupTime: "09:00 AM",
          dropTime: "08:00 PM",
          pickupLocation: (store as any).city || "",
          dropLocation: (store as any).city || "",
          helmetRequired: true,
          extraHelmet: false,
          fuelPreference: "full-to-full",
          licenseNumber: "",
        };
        break;
      case "cab":
        meta = {
          ...meta,
          pickup: (store as any).PickupCity || "",
          drop: (store as any).DropoffCity || "",
          pickupTime: "08:30 AM",
          pickupDate: data.dates.checkin,
          luggageCount: 0,
          tripType: "oneway",
          specialRequest: data.specialRequest || "",
        };
        break;
      case "tour":
        meta = {
          ...meta,
          startDate: data.dates.checkin,
          mealPreference: "veg"
        };
        break;
      case "adventure":
        extra = { timeSlot: "10:00 AM" };
        break;
    }

    return { serviceType, serviceId, bookingDate, primaryCustomer, participants, meta, ...extra };
  };

  const onSubmit = async (data: PaymentProps) => {
    try {
      setLoading(true);
      const payload = buildPayload(data);
      const result = await createServiceBooking(payload);

      if (result?.success !== false) {
        const { razorpayOrder, booking } = result.data || result;

        setPayments({
          ...result.data,
          razorpay_order_id: razorpayOrder.id,
          razorpay_payment_id: razorpayOrder.id,
          razorpay_signature: razorpayOrder.receipt,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          status: razorpayOrder.status,
          firstname: booking.primaryCustomer.firstName,
          lastname: booking.primaryCustomer.lastName,
          email: booking.primaryCustomer.email,
          phone: booking.primaryCustomer.phoneNumber,
          createdAt: booking.createdAt,
          bookingId: booking._id,
        });

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Hilex Booking",
          description: `Booking for ${booking.bookingReference}`,
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            try {
              const verifyResult = await verifyServicePayment(response);
              if (verifyResult.success !== false) {
                toast.success("Payment successful! Booking confirmed.");
                setCurrentStep((val) => val + 1);
                handleRefresh(queryClient, ["bookings"]);
                setLoading(false);

              } else {
                toast.error("Payment verification failed.");
              }
            } catch {
              toast.error("Payment verification failed.");
            } finally {
            }
          },
          prefill: {
            name: `${data.guestInformation[0].firstname} ${data.guestInformation[0].lastname}`,
            email: data.guestInformation[0].email,
            contact: data.guestInformation[0].phone,
          },
          theme: { color: "#EA580C" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();

      } else {
        toast.error(result?.message || "Failed to create booking.");
        setLoading(false);

      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "An error occurred.");
      setLoading(false);

    }
  };

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn("container max-w-7xl mx-auto px-4", ismobile && "pb-32")}
      >
        {/* Steps bar */}
        <div className="w-full py-8 overflow-x-auto">
          <HighLightBar />
        </div>

        {!loading ? (
          <div
            className={cn(
              "grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 w-full",
              currentstep === 3 && "grid-cols-1 lg:grid-cols-1"
            )}
          >
            <div className="lg:col-span-8">
              <PaymentFormContent methods={methods} serviceType={serviceType} />
            </div>
            {currentstep === 2 && (
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  {ismobile ? (
                    <div className="fixed bottom-0 left-0 right-0 z-50 w-full border-t bg-background/95 backdrop-blur-sm p-4 animate-in slide-in-from-bottom duration-300">
                      <BookingCard
                        loading={loading}
                        hookname={hookname}
                        serviceType={serviceType}
                      />
                    </div>
                  ) : (
                    <BookingDetailsCard
                      loading={loading}
                      hookname={hookname}
                      serviceType={serviceType}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-screen flex flex-col items-center justify-center py-32 space-y-4">
            <Spinner />
            <p className="text-muted-foreground animate-pulse">
              Processing your request...
            </p>
          </div>
        )}
      </form>
    </Form>
  );
};

// ─── Steps / inner form switcher ─────────────────────────────────────────────
export const PaymentFormContent = ({
  methods,
  serviceType,
}: {
  methods: UseFormReturn<PaymentProps>;
  serviceType: string;
}) => {
  const { currentstep } = usePaymentsContext();
  if (currentstep === 2)
    return <BookingDetails methods={methods} serviceType={serviceType} />;
  return <FinalStep />;
};

// ─── Final Step ───────────────────────────────────────────────────────────────
// We call all store hooks individually (cannot call in a loop — rules of hooks)
export const FinalStep = () => {
  const toursStore = hooksSupplier["tours"]();
  const adventureStore = hooksSupplier["adventures"]();
  const bikesStore = hooksSupplier["bikes"]();
  const cabsStore = hooksSupplier["cabs"]();
  const hotelsStore = hooksSupplier["hotels"]();

  const payments = [
    toursStore.payments,
    adventureStore.payments,
    bikesStore.payments,
    cabsStore.payments,
    hotelsStore.payments,
  ].find((p) => p?.razorpay_order_id);

  if (!payments) return null;

  return (
    <>
      <ScrollToTop />
      <div className="w-full flex items-center justify-center relative">
        <PaymentSuccess payment={payments} />
        <div className="h-[1200px] hidden md:flex justify-center">
          <div className="sticky top-10 right-0 h-[600px] self-start">
            <img
              src="/story/payment-done.png"
              alt="Thank you for payment"
              className="w-full h-full object-contain hover:scale-105 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Mobile bottom bar ────────────────────────────────────────────────────────
export const BookingCard = ({
  loading,
  hookname,
  serviceType,
}: {
  loading: boolean;
  hookname: keyof typeof hooksSupplier;
  serviceType: string;
}) => {
  const store = hooksSupplier[hookname]();
  const { guests } = store;
  const methods = useFormContext<PaymentProps>();
  const totalGuests = (guests?.adults || 0) + (guests?.children || 0);
  const checkin = methods.watch("dates.checkin");
  const checkout = methods.watch("dates.checkout");

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight capitalize">
          {serviceType} Booking
        </span>
        <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
          {checkin && checkout
            ? `${format(new Date(checkin), "dd MMM")} - ${format(new Date(checkout), "dd MMM")}`
            : "Select dates"}{" "}
          · {totalGuests} guests
        </p>
        <div className="flex items-center gap-1 mt-1">
          <Check className="w-3 h-3 text-emerald-500 stroke-[3px]" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
            Free cancellation
          </span>
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white text-base font-black shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reserve"}
      </Button>
    </div>
  );
};

// ─── Desktop sidebar card ─────────────────────────────────────────────────────
export const BookingDetailsCard = ({
  loading,
  hookname,
  serviceType,
}: {
  loading?: boolean;
  hookname: keyof typeof hooksSupplier;
  serviceType: string;
}) => {
  const store = hooksSupplier[hookname]();
  const { date, guests } = store;
  const methods = useFormContext<PaymentProps>();
  const checkin = methods.watch("dates.checkin");
  const checkout = methods.watch("dates.checkout");
  const totalGuests = (guests?.adults || 0) + (guests?.children || 0);

  const serviceLabel: Record<string, string> = {
    tour: "Tour Package",
    bike: "Bike Rental",
    adventure: "Adventure Activity",
    cab: "Cab Ride",
  };

  return (
    <Card className="shadow-lg border-primary/10 overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <h3 className="text-xl font-bold capitalize">
          {serviceLabel[serviceType] || serviceType}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Booking Summary</p>
      </div>
      <CardContent className="p-6 space-y-6">
        <div>
          {checkin && (
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              {checkin && checkout
                ? `${format(new Date(checkin), "dd MMM")} - ${format(new Date(checkout), "dd MMM yyyy")}`
                : format(new Date(checkin), "dd MMM yyyy")}
            </p>
          )}
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Users className="h-4 w-4" /> {totalGuests}{" "}
            {totalGuests === 1 ? "Guest" : "Guests"}
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Service Type</span>
            <span className="font-semibold capitalize">{serviceType}</span>
          </div>
          <div className="text-xs text-muted-foreground italic">
            Final price will be calculated after booking confirmation.
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-lg font-bold"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" /> Proceed to Pay
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Booking Details (form step) ──────────────────────────────────────────────
export function BookingDetails({
  methods,
  serviceType,
}: {
  methods: UseFormReturn<PaymentProps>;
  serviceType: string;
}) {
  return (
    <div className="space-y-8 pb-20">
      <TripSummaryCard methods={methods} serviceType={serviceType} />
      <GuestInfoCard methods={methods} />
      <SpecialRequestCard methods={methods} />
      <AddOnsCard />
      <CancellationPolicyCard />
    </div>
  );
}

export default BookingCard;
