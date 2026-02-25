// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { CheckCircle2, Copy } from "lucide-react";
// import { useRef } from "react";
// import { usePaymentsContext } from "@/context/payments-form-provider";
// import { cn } from "@/lib/utils";
// import React from "react";
// import { VisitorsMembers } from "@/app/(home)/hotels/[hotel]/_components/tabs";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { PaymentProps, PaymentSchema } from "@/schema/payment.schema";
// import { Payment, useHotelStore } from "@/store/hotel.store";
// import { Field } from "@/components/ui/field";

// import { ScrollToTop } from "../../../../../../scrolltoto";
// // import { useHotelQuery } from "@/services/querys";
// import { PhoneInput } from "./phoneinput";
// import {
//   createBooking,
//   verifyPayment,
// } from "@/services/booking/booking.service";
// import { toast } from "sonner";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useRouter } from "next/navigation";
// import { useForm, useFormContext, UseFormReturn } from "react-hook-form";
// export interface GuestInfo {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
// }
// export type BookingData = {
//   hotelId: string;
//   roomTypeId: string;
//   checkIn: string;
//   checkOut: string;
//   guests: {
//     adults: number;
//     children: number;
//   };
//   roomsBooked: number;
//   primaryGuest: GuestInfo;
//   additionalGuests: {
//     firstName: string;
//     lastName: string;
//   }[];
//   specialRequest?: string | null;
// };
// export const BookingForm = ({ slug }: { slug: string[] }) => {
//   const { setPayments } = useHotelStore();
//   const { setCurrentStep, currentstep } = usePaymentsContext();

//   const [loading, setLoading] = React.useState<boolean>(false);

//   const navigate = useRouter();
//   const { date, guests } = useHotelStore();
//   const total = guests?.adults + guests?.children;

//   const methods = useForm<PaymentProps>({
//     resolver: zodResolver(PaymentSchema),
//     defaultValues: {
//       dates: {
//         checkin: date?.from?.toISOString() || "",
//         checkout: date?.to?.toISOString() || "",
//       },
//       guests: {
//         adults: guests?.adults || 0,
//         children: guests?.children || 0,
//       },
//       guestInformation: Array(total).fill({
//         firstname: "",
//         lastname: "",
//         email: "",
//         phone: "",
//       }),
//       specialRequest: "",
//       rooms: [],
//     },
//     mode: "onChange",
//   });

//   const onSubmit = async (data: PaymentProps) => {
//     try {
//       setLoading(true);
//       const bookingData = {
//         hotelId: slug[0],
//         roomTypeId: slug[1],
//         checkIn: data.dates.checkin,
//         checkOut: data.dates.checkout,

//         guests: {
//           adults: data.guests.adults,
//           children: data.guests.children,
//         },
//         roomsBooked: data.rooms.length || 1,

//         primaryGuest: {
//           firstName: data.guestInformation[0]?.firstname || "",
//           lastName: data.guestInformation[0]?.lastname || "",
//           email: data.guestInformation[0]?.email || "",
//           phoneNumber: data.guestInformation[0]?.phone || "",
//         },

//         additionalGuests: data.guestInformation.slice(1).map((guest) => ({
//           firstName: guest.firstname || "",
//           lastName: guest.lastname || "",
//         })),

//         specialRequest: data.specialRequest,
//       };

//       const result = await createBooking(bookingData);

//       if (result?.success) {
//         const { razorpayOrder, booking } = result.data;
//         setPayments({
//           razorpay_order_id: razorpayOrder.id,
//           razorpay_payment_id: razorpayOrder.id,
//           razorpay_signature: razorpayOrder.receipt,
//           amount: razorpayOrder.amount,
//           currency: razorpayOrder.currency,
//           status: razorpayOrder.status,
//           firstname: booking.primaryGuest.firstName,
//           contact: booking.primaryGuest.phoneNumber,
//           lastname: booking.primaryGuest.lastName,
//           email: booking.primaryGuest.email,
//           phone: booking.primaryGuest.phoneNumber,
//           createdAt: booking.createdAt,
//         });
//         setCurrentStep((val) => val + 1);
//         const options = {
//           key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//           amount: razorpayOrder.amount,
//           currency: razorpayOrder.currency,
//           name: "Hilex Booking",
//           description: `Booking for ${booking.bookingReference}`,
//           order_id: razorpayOrder.id,
//           handler: async function (response: {
//             razorpay_order_id: string;
//             razorpay_payment_id: string;
//             razorpay_signature: string;
//           }) {
//             try {
//               const verifyResult = await verifyPayment({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               });

//               if (verifyResult.success) {
//                 toast.success("Payment successful! Booking confirmed.");

//                 // navigate.push("/personal/bookings"); // change is route a success page
//               } else {
//                 toast.error("Payment verification failed.");
//               }
//             } catch (error) {
//               console.error("Verification Error:", error);
//               toast.error("Something went wrong during payment verification.");
//             }
//           },
//           prefill: {
//             name: `${data.guestInformation[0].firstname} ${data.guestInformation[0].lastname}`,
//             email: data.guestInformation[0].email,
//             contact: data.guestInformation[0].phone,
//           },
//           theme: {
//             color: "#EA580C",
//           },
//         };

//         const rzp = new (window as unknown as { Razorpay: any }).Razorpay(
//           options,
//         );
//         rzp.open();
//       } else {
//         toast.error(result?.message || "Failed to create booking.");
//       }
//     } catch (error) {
//       const err = error as { response?: { data?: { message?: string } } };
//       console.error("Booking Error:", error);
//       toast.error(
//         err.response?.data?.message || "An error occurred during booking.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <Form {...methods}>
//       <form onSubmit={methods.handleSubmit(onSubmit)}>
//         <StepsView />
//         {!loading ? (
//           <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
//             <PaymentForm methods={methods} />

//             {currentstep === 2 && (
//               <aside className="  lg:block lg:w-[320px] xl:w-[360px] flex-shrink-0 pt-6 lg:pt-10">
//                 <div className="sticky top-24 lg:top-28 z-10">
//                   <BookingDetailsCard
//                     hotelid={slug[0]}
//                     roomTypeId={slug[1]}
//                     loading={loading}
//                   />
//                 </div>
//               </aside>
//             )}
//           </div>
//         ) : (
//           <div className="w-full flex justify-center py-20">
//             <Spinner />
//           </div>
//         )}
//       </form>
//     </Form>
//   );
// };
// export const StepsView = () => {
//   // const { currentstep, setCurrentStep } = usePaymentsContext()

//   return (
//     <div className="w-full h-20 flex justify-center items-center">
//       <HighLightBar />
//     </div>
//   );
// };

// export const PaymentForm = ({
//   methods,
// }: {
//   methods: UseFormReturn<PaymentProps>;
// }) => {
//   const { currentstep } = usePaymentsContext();
//   switch (currentstep) {
//     case 2:
//       return <BookingDetails methods={methods} />;

//     default:
//       break;
//   }
//   return <FinalStep />;
// };
// export const FinalStep = () => {
//   const { payments } = useHotelStore();
//   return (
//     <div className="w-full flex items-center justify-center">
//       <ScrollToTop />
//       <PaymentSuccess
//         payment={{
//           razorpay_payment_id: payments.razorpay_payment_id,
//           razorpay_order_id: payments.razorpay_order_id,
//           razorpay_signature: payments.razorpay_signature,
//           amount: payments.amount,
//           currency: payments.currency,
//           status: payments.status,
//           email: payments.email,
//           contact: payments.contact,
//           createdAt: payments.createdAt,
//           firstname: payments.firstname,
//           lastname: payments.lastname,
//           phone: payments.phone,
//         }}
//       />
//     </div>
//   );
// };

// interface PaymentSuccessProps {
//   payment: Payment;
// }
// import html2pdf from "html2pdf.js";

// export default function PaymentSuccess({ payment }: PaymentSuccessProps) {
//   const receiptRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   const formatAmount = (amount: number) => {
//     return (amount / 100).toLocaleString("en-IN", {
//       style: "currency",
//       currency: payment.currency || "INR",
//       minimumFractionDigits: 2,
//     });
//   };

//   const formatDate = (iso: string) => {
//     return new Date(iso).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const handleDownload = async () => {
//     if (!receiptRef.current) {
//       console.warn("Receipt ref not found");
//       return;
//     }

//     try {
//       const opt = {
//         margin: 0.5,
//         type: "blob",
//         filename: "receipt.pdf",
//         image: { type: "jpeg", quality: 0.98 },
//         html2canvas: { scale: 2, useCORS: true, logging: true }, // ← turn logging on temporarily
//         jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//       } as const;

//       await html2pdf().set(opt).from(receiptRef.current).save();
//     } catch (err) {
//       console.error("PDF generation failed:", err);
//       alert(
//         "Could not generate PDF – please try again or screenshot the receipt.",
//       );
//     }
//   };
//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6">
//       <div
//         className={cn(
//           "w-full max-w-6xl",
//           "bg-card text-card-foreground",
//           "border border-border rounded-xl shadow-xl",
//           "flex flex-col overflow-hidden",
//         )}
//         style={{ height: "600px" }}
//       >
//         {/* Header */}
//         <div className="bg-primary/10 border-b border-border px-6 py-7 md:px-10 md:py-8 shrink-0">
//           <div className="flex items-center justify-center gap-4">
//             <CheckCircle2 className="h-12 w-12 md:h-14 md:w-14 text-primary" />
//             <div className="text-center md:text-left">
//               <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
//                 Payment Successful
//               </h1>
//               <p className="mt-1.5 text-muted-foreground">
//                 Thank you! Your payment has been processed.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Main content */}
//         <div
//           className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 space-y-8 bg-background"
//           ref={receiptRef}
//         >
//           {/* Amount highlight */}
//           <Card className="bg-primary/5 border-primary/20 text-center">
//             <CardContent className="pt-8 pb-9">
//               <p className="text-muted-foreground text-lg mb-2">Amount Paid</p>
//               <p className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
//                 {formatAmount(payment.amount)}
//               </p>
//               <p className="mt-3 text-sm font-medium uppercase tracking-wider text-primary/80">
//                 {payment.status}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Details grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 bg-background">
//             <InfoItem
//               label="Payment ID"
//               value={payment.razorpay_payment_id}
//               copyable
//             />
//             <InfoItem
//               label="Order ID"
//               value={payment.razorpay_order_id}
//               copyable
//             />
//             <InfoItem
//               label="Signature"
//               value={payment.razorpay_signature}
//               copyable
//               long
//             />
//             <InfoItem
//               label="Date & Time"
//               value={formatDate(payment.createdAt)}
//             />
//             <InfoItem label="Email" value={payment.email} />
//             <InfoItem label="Phone" value={payment.phone} />
//           </div>

//           <div className="text-center text-sm text-muted-foreground pt-4">
//             A receipt has been sent to{" "}
//             <span className="font-medium">{payment.email}</span>
//           </div>
//         </div>

//         {/* Footer actions */}
//         <div className="border-t border-border bg-muted/40 px-6 py-6 md:px-10 md:py-7 flex flex-col sm:flex-row items-center justify-center gap-4 shrink-0">
//           <Button
//             className="min-w-[180px]"
//             size="lg"
//             // onClick={handleDownload}
//           >
//             Download Receipt
//           </Button>
//           <Button
//             variant="outline"
//             className="min-w-[180px]"
//             size="lg"
//             onClick={(e) => {
//               e.stopPropagation();

//               router.push("/");

//               // setPayments(null as unknown as Payment);
//             }}
//           >
//             Back to home
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// type InfoItemProps = {
//   label: string;
//   value: string;
//   copyable?: boolean;
//   long?: boolean;
// };

// function InfoItem({ label, value, copyable, long }: InfoItemProps) {
//   return (
//     <div className="bg-muted/40 rounded-lg border border-border p-4 hover:border-border/80 transition-colors">
//       <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
//         {label}
//       </dt>
//       <dd
//         className={cn(
//           "text-sm md:text-base break-all font-mono",
//           long && "line-clamp-2",
//         )}
//         title={value}
//       >
//         {value}
//       </dd>

//       {copyable && (
//         <button
//           onClick={() => navigator.clipboard.writeText(value)}
//           className="mt-2.5 text-xs text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors"
//           title="Copy to clipboard"
//         >
//           <Copy className="h-3.5 w-3.5" />
//           Copy
//         </button>
//       )}
//     </div>
//   );
// }

// // function InfoRow({ label, value }: { label: string; value: string }) {
// //   return (
// //     <div className="flex justify-between items-center border rounded-md px-4 py-2 bg-background">
// //       <span className="text-muted-foreground">{label}</span>
// //       <span className="font-medium break-all">{value}</span>
// //     </div>
// //   );
// // }
// export const BookingDetailsCard = ({
//   loading,
// }: {
//   loading?: boolean;
//   hotelid: string;
//   roomTypeId: string;
// }) => {
//   const { selectedRoom } = useHotelStore();
//   const methods = useFormContext<PaymentProps>();

//   const checkin = methods.watch("dates.checkin");
//   const checkout = methods.watch("dates.checkout");
//   const adults = methods.watch("guests.adults");
//   const children = methods.watch("guests.children");

//   const nights = selectedRoom?.nights || 0;
//   const pricePerNight = selectedRoom?.pricePerNight || 0;
//   const totalPrice = selectedRoom?.totalPrice || 0;
//   const navigate = useRouter();
//   if (!selectedRoom) {
//     return (
//       <Card className="p-4">
//         <p className="text-sm text-destructive">
//           Selected room not found. Please go back.
//         </p>
//         <Button onClick={() => navigate.back()}>Back</Button>
//       </Card>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-5">
//       <Card className="p-5 space-y-4">
//         <h3 className="font-semibold text-lg">{selectedRoom.title}</h3>

//         <img
//           src={selectedRoom.image || "/img1.png"}
//           alt={selectedRoom.title}
//           className="w-full h-40 object-cover rounded-md"
//         />

//         <div className="text-sm text-muted-foreground">
//           {checkin && checkout ? (
//             <>
//               {format(new Date(checkin), "dd MMM yyyy")} –{" "}
//               {format(new Date(checkout), "dd MMM yyyy")}
//             </>
//           ) : (
//             "Dates not selected"
//           )}
//         </div>

//         <div className="text-sm text-muted-foreground">
//           {adults} adult{adults > 1 ? "s" : ""} • {children} child
//           {children !== 1 ? "ren" : ""}
//         </div>

//         <div className="border-t pt-3 space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>
//               ₹{pricePerNight} × {nights} night{nights !== 1 ? "s" : ""}
//             </span>
//             <span>₹{(pricePerNight * nights).toLocaleString()}</span>
//           </div>

//           <div className="flex justify-between font-semibold text-base">
//             <span>Total</span>
//             <span>₹{totalPrice.toLocaleString()}</span>
//           </div>
//         </div>
//       </Card>

//       <Button
//         type="submit"
//         disabled={nights <= 0 || loading}
//         className="w-full font-semibold"
//       >
//         {nights <= 0 ? "Select valid dates" : "Proceed to Pay"}
//       </Button>
//     </div>
//   );
// };

// export function BookingDetails({
//   methods,
// }: {
//   methods: UseFormReturn<PaymentProps>;
// }) {
//   return (
//     <main className="flex-1 min-w-0 py-6 lg:py-10 space-y-10 lg:space-y-16 w-full">
//       <div className="max-w-2xl w-full space-y-6  flex flex-col gap-1 py-10">
//         <TripSummaryCard methods={methods} />
//         <Separator />
//         <GuestInfoCard methods={methods} />
//         <Separator />
//         <SpecialRequestCard methods={methods} />
//         <Separator />
//         <AddOnsCard />
//         <Separator />
//         <CancellationPolicyCard />
//       </div>
//     </main>
//   );
// }

// import { format } from "date-fns";
// function TripSummaryCard({
//   methods,
// }: {
//   methods: UseFormReturn<PaymentProps>;
// }) {
//   const checkin = methods.getValues("dates.checkin");
//   const checkout = methods.getValues("dates.checkout");
//   return (
//     <Card className="shadow-sm bg-background">
//       <CardHeader>
//         <CardTitle>Booking details</CardTitle>
//         <p className="text-sm text-muted-foreground">Your trip</p>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div className="flex justify-between">
//           <p className="font-medium">Dates</p>
//           <p className="text-muted-foreground text-sm">
//             {checkin ? format(new Date(checkin), "yyyy-MM-dd") : "—"} -{" "}
//             {checkout ? format(new Date(checkout), "yyyy-MM-dd") : "—"}
//           </p>
//           <DialougeEditDates
//             methods={methods}
//             trigger="Edit"
//             content={<div>sdsd</div>}
//           />
//         </div>

//         <div className="flex justify-between">
//           <div>
//             <p className="font-medium">Guests</p>
//             <p className="text-muted-foreground text-sm">
//               {methods.getValues("guests.adults")} adults{" "}
//               {methods.getValues("guests.children")} children
//             </p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// export function DialougeEditDates({
//   methods,
//   trigger,
// }: {
//   methods: UseFormReturn<PaymentProps>;
//   trigger: string;
//   content: React.ReactNode;
// }) {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="ghost" className="text-xs">
//           {trigger}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className=" w-[800px] max-w-[800px] border-none flex flex-col gap-4 ">
//         <DialogTitle>Edit Dates</DialogTitle>
//         <DialogDescription>Edit your dates and guests</DialogDescription>
//         <div className="flex gap-4">
//           <HotelCalender className="p-4" methods={methods} />
//           <VisitorsMembers showCalendar={false} methods={methods} />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function GuestInfoCard({ methods }: { methods: UseFormReturn<PaymentProps> }) {
//   const { control } = methods;

//   const { fields } = useFieldArray({
//     control,
//     name: "guestInformation",
//   });
//   const { date, guests } = useHotelStore();

//   return (
//     <Card className="shadow-sm bg-background">
//       <CardHeader>
//         <CardTitle>Guest Info</CardTitle>
//         <p className="text-xs text-muted-foreground">
//           Guest names must match the valid ID used at check-in.
//         </p>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         <div className="flex justify-end">
//           {/* <Button
//             type="button"
//             onClick={() =>
//               append({
//                 firstname: "",
//                 lastname: "",
//                 email: "",
//                 phone: "",
//               })
//             }
//           >
//             <PlusIcon className="mr-2 h-4 w-4" /> Add Guest
//           </Button> */}
//         </div>
//         {fields.map((field, index) => (
//           <div className="space-y-4 border p-4 rounded-lg" key={field.id}>
//             <div className="flex justify-between items-center">
//               <p className="font-medium text-sm">
//                 {index === 0 ? "Primary Guest" : `Guest ${index + 1}`}
//               </p>
//               {/* {index !== 0 && (
//                 <IconTrash
//                   onClick={() => remove(index)}
//                   className="h-4 w-4 cursor-pointer text-destructive"
//                 />
//               )} */}
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <Field>
//                 <FormField
//                   control={control}
//                   name={`guestInformation.${index}.firstname`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>First Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="First Name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </Field>

//               <Field>
//                 <FormField
//                   control={control}
//                   name={`guestInformation.${index}.lastname`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Last Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Last Name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </Field>

//               {index === 0 && (
//                 <>
//                   <Field className="col-span-2">
//                     <FormField
//                       control={control}
//                       name={`guestInformation.${index}.email`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="email"
//                               placeholder="Enter email"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </Field>

//                   <Field className="col-span-2">
//                     <FormField
//                       control={control}
//                       name={`guestInformation.${index}.phone`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Phone</FormLabel>
//                           <FormControl>
//                             <PhoneInput
//                               value={field.value}
//                               onChange={field.onChange}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </Field>
//                 </>
//               )}
//             </div>
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }

// function SpecialRequestCard({
//   methods,
// }: {
//   methods: UseFormReturn<PaymentProps>;
// }) {
//   return (
//     <Card className="shadow-sm bg-background">
//       <CardHeader>
//         <CardTitle>
//           Special Requests{" "}
//           <span className="text-xs text-muted-foreground">(optional)</span>
//         </CardTitle>
//       </CardHeader>

//       <CardContent>
//         <Textarea
//           placeholder="Let the property know if there’s anything they can assist you with."
//           className="min-h-[120px]"
//           {...methods.register("specialRequest")}
//         />
//       </CardContent>
//     </Card>
//   );
// }
// import { useFieldArray } from "react-hook-form";
// import { HotelCalender } from "@/app/(home)/hotels/[hotel]/_components/calander-booking";
// import { type } from "os";
// import { Spinner } from "@/components/spinner";

// function AddOnsCard() {
//   return (
//     <Card className="shadow-sm bg-background">
//       <CardContent className="space-y-6 pt-6">
//         <div className="flex justify-between items-start">
//           <div>
//             <p className="font-medium">Add travel insurance?</p>
//             <p className="text-xs text-muted-foreground">
//               Yes, add for $100. Only available when booking.
//             </p>
//           </div>
//           <Button variant="outline" size="sm">
//             Add
//           </Button>
//         </div>

//         <div className="flex justify-between items-start">
//           <div>
//             <p className="font-medium">Required for your trip</p>
//             <p className="text-xs text-muted-foreground">
//               Add and confirm your phone number to get updates.
//             </p>
//           </div>
//           <Button variant="outline" size="sm">
//             Add
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
// function CancellationPolicyCard() {
//   return (
//     <Card className="shadow-sm bg-background">
//       <CardHeader>
//         <CardTitle>Cancellation policy</CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-2 text-sm">
//         <p className="text-muted-foreground">
//           Free cancellation before Aug 1. Cancel before check-in on Jul 10 for a
//           partial refund.
//         </p>
//         <Button variant="link" size="sm" className="px-0">
//           Learn more
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

// export const HighLightBar = () => {
//   const { currentstep: currentStep } = usePaymentsContext();

//   return (
//     <div className="flex w-full justify-center items-center">
//       {/* {currentStep > 2 && (
//         <div
//           className=" bg-muted rounded-md p-2 absolute left-20 cursor-pointer"
//           onClick={() => {
//             setCurrentStep(currentStep - 1);
//           }}
//         >
//           <p> {"<"} back</p>
//         </div>
//       )} */}
//       {[1, 2, 3].map((step) => (
//         <div key={step} className="flex items-center">
//           <div
//             className={cn(
//               "rounded-full h-12 w-12 flex items-center justify-center text-white font-semibold transition-all duration-300",
//               currentStep > step && "bg-zinc-800", // completed
//               currentStep === step && "bg-orange-500 h-17 w-17", // active
//               currentStep < step && "bg-gray-300 text-black", // upcoming
//             )}
//           >
//             {step}
//           </div>

//           {step !== 3 && (
//             <div
//               className={cn(
//                 "h-1 w-80 transition-all duration-300",
//                 currentStep > step ? "bg-orange-500" : "bg-gray-300",
//               )}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFormContext, UseFormReturn, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { CheckCircle2, Copy, CreditCard, Calendar, Users, Info, Plus, Mail, Download, Home, Smartphone, User } from "lucide-react";
import html2pdf from "html2pdf.js";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/spinner";
import { ScrollToTop } from "../../../../../../scrolltoto";
import { PhoneInput } from "./phoneinput";
import { Field } from "@/components/ui/field";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { usePaymentsContext } from "@/context/payments-form-provider";
import { Payment, useHotelStore } from "@/store/hotel.store";
import { PaymentProps, PaymentSchema } from "@/schema/payment.schema";
import { createBooking, verifyPayment } from "@/services/booking/booking.service";
import { VisitorsMembers } from "@/app/(home)/hotels/[hotel]/_components/tabs";
import { HotelCalender } from "@/app/(home)/hotels/[hotel]/_components/calander-booking";

export const BookingForm = ({ slug }: { slug: string[] }) => {
  const { setPayments, date, guests } = useHotelStore();
  const { setCurrentStep, currentstep } = usePaymentsContext();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useRouter();
  
  const total = (guests?.adults || 0) + (guests?.children || 0);

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

  const onSubmit = async (data: PaymentProps) => {
    try {
      setLoading(true);
      const bookingData = {
        hotelId: slug[0],
        roomTypeId: slug[1],
        checkIn: data.dates.checkin,
        checkOut: data.dates.checkout,
        guests: { adults: data.guests.adults, children: data.guests.children },
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
        })),
        specialRequest: data.specialRequest,
      };

      const result = await createBooking(bookingData);

      if (result?.success) {
        const { razorpayOrder, booking } = result.data;
        setPayments({
          ...result.data, // assuming spread for basic fields
          razorpay_order_id: razorpayOrder.id,
          razorpay_payment_id: razorpayOrder.id,
          razorpay_signature: razorpayOrder.receipt,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          status: razorpayOrder.status,
          firstname: booking.primaryGuest.firstName,
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
          handler: async function (response: any) {
            const verifyResult = await verifyPayment(response);
            if (verifyResult.success) {
              toast.success("Payment successful! Booking confirmed.");
            } else {
              toast.error("Payment verification failed.");
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
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="container max-w-7xl mx-auto px-4">
        <StepsView />
        {!loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            <div className="lg:col-span-8">
              <PaymentForm methods={methods} />
            </div>
            {currentstep === 2 && (
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <BookingDetailsCard
                    hotelid={slug[0]}
                    roomTypeId={slug[1]}
                    loading={loading}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-32 space-y-4">
            <Spinner />
            <p className="text-muted-foreground animate-pulse">Processing your request...</p>
          </div>
        )}
      </form>
    </Form>
  );
};

export const StepsView = () => (
  <div className="w-full py-8 overflow-x-auto">
    <HighLightBar />
  </div>
);

export const PaymentForm = ({ methods }: { methods: UseFormReturn<PaymentProps> }) => {
  const { currentstep } = usePaymentsContext();
  if (currentstep === 2) return <BookingDetails methods={methods} />;
  return <FinalStep />;
};

export const FinalStep = () => {
  const { payments } = useHotelStore();
  if (!payments) return null;
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <ScrollToTop />
      <PaymentSuccess payment={payments} />
    </div>
  );
};



export function PaymentSuccess({ payment }: { payment: any }) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const formatAmount = (amount: number) =>
    (amount / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: payment.currency || "INR",
      maximumFractionDigits: 0,
    });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4 md:p-8">
      <Card className="w-full overflow-hidden shadow-2xl border-none ring-1 ring-black/5 dark:ring-white/10">
        
        {/* Modern Success Header */}
        <div className="relative bg-primary text-primary-foreground p-8 md:p-12 text-center overflow-hidden ">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-12 -left-12 w-18 h-18 sm:w-24 sm:h-24 md:w-48 md:h-48 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-12 -right-12  w-18 h-18 sm:w-24 sm:h-24 md:w-48 md:h-48 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="bg-white/20 backdrop-blur-lg w-10 h-10 md:20 md:h-20 rounded-3xl flex items-center justify-center mx-auto mb-3 rotate-12 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-4 w-4 md:h-12 md:w-12 text-white -rotate-12" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Payment Successful!</h1>
            <p className="text-primary-foreground/80 max-w-xs mx-auto text-xs md:text-base font-medium">
              Your booking is confirmed. Check your email for details.
            </p>
          </div>
        </div>

        <CardContent className="p-0 bg-white dark:bg-zinc-900" ref={receiptRef}>
          {/* Main Receipt Body */}
          <div className="p-6 md:p-10 space-y-8">
            
            {/* Amount & Status Section */}
            <div className="text-center py-6 border-b border-dashed border-slate-200 dark:border-zinc-800 relative">
               {/* Receipt "Punch Holes" on the sides */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 hidden md:block" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 hidden md:block" />
              
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/60">Total Paid</span>
              <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter my-2">
                {formatAmount(payment.amount)}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {payment.status}
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <InfoItem label="Guest Name" value={`${payment.firstname} ${payment.lastname || ""}`} icon={<User size={14} />} />
              <InfoItem label="Booking Date" value={formatDate(payment.createdAt)} icon={<Calendar size={14} />} />
              <InfoItem label="Contact Email" value={payment.email} icon={<Mail size={14} />} />
              <InfoItem label="Phone Number" value={payment.phone} icon={<Smartphone size={14} />} />
              
              {/* ID Section (Span 2) */}
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                 <InfoItem label="Payment ID" value={payment.razorpay_payment_id} copyable long />
                 <InfoItem label="Order ID" value={payment.razorpay_order_id} copyable long />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Action Footer */}
        <div className="p-6 md:p-8 bg-slate-50/80 dark:bg-zinc-900/50 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-12 font-bold gap-2 order-2 sm:order-1 transition-all active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");

            }}
          >
            <Home size={18} />
            Go Home
          </Button>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              // router.push("/");
            }}
            className="flex-1 h-12 font-bold gap-2 order-1 sm:order-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            <Download size={18} />
            Download PDF
          </Button>
        </div>
      </Card>
    </div>
  );
}

function InfoItem({ 
  label, 
  value, 
  copyable, 
  long, 
  icon 
}: { 
  label: string; 
  value: string; 
  copyable?: boolean; 
  long?: boolean; 
  icon?: React.ReactNode 
}) {
  return (
    <div className="p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muted-foreground/60">{icon}</span>
        <dt className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</dt>
      </div>
      <dd className={cn(
        "text-sm font-bold text-foreground truncate leading-relaxed", 
        long && "font-mono text-xs text-muted-foreground",
        !long && "text-base"
      )}>
        {value}
      </dd>
      {copyable && (
        <button 
          onClick={() => { 
            navigator.clipboard.writeText(value); 
            toast.success("Copied!"); 
          }}
          className="mt-3 text-[10px] text-primary flex items-center gap-1.5 font-black hover:opacity-70 transition-opacity"
        >
          <Copy size={12} /> CLICK TO COPY
        </button>
      )}
    </div>
  );
}
export const BookingDetailsCard = ({ loading }: { loading?: boolean; hotelid: string; roomTypeId: string }) => {
  const { selectedRoom } = useHotelStore();
  const methods = useFormContext<PaymentProps>();
  const navigate = useRouter();

  if (!selectedRoom) return null;

  const nights = selectedRoom?.nights || 0;
  const totalPrice = selectedRoom?.totalPrice || 0;

  return (
    <Card className="shadow-lg border-primary/10 overflow-hidden">
      <img src={selectedRoom.image || "/img1.png"} alt="Room" className="w-full h-48 object-cover" />
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold">{selectedRoom.title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
            <Calendar className="h-4 w-4" /> 
            {format(new Date(methods.watch("dates.checkin")), "dd MMM")} - {format(new Date(methods.watch("dates.checkout")), "dd MMM yyyy")}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Users className="h-4 w-4" /> {methods.watch("guests.adults")} Adults, {methods.watch("guests.children")} Children
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Price for {nights} nights</span>
            <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-black border-t pt-3 text-primary">
            <span>Total Payable</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <Button type="submit" disabled={nights <= 0 || loading} className="w-full h-12 text-lg font-bold shadow-orange-200">
          {loading ? <Spinner  /> : <CreditCard className="mr-2 h-5 w-5" />}
          Proceed to Pay
        </Button>
      </CardContent>
    </Card>
  );
};

export function BookingDetails({ methods }: { methods: UseFormReturn<PaymentProps> }) {
  return (
    <div className="space-y-8 pb-20">
      <TripSummaryCard methods={methods} />
      <GuestInfoCard methods={methods} />
      <SpecialRequestCard methods={methods} />
      <AddOnsCard />
      <CancellationPolicyCard />
    </div>
  );
}

function TripSummaryCard({ methods }: { methods: UseFormReturn<PaymentProps> }) {
  const checkin = methods.getValues("dates.checkin");
  const checkout = methods.getValues("dates.checkout");
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl">Your Trip Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Confirm your dates and guests</p>
        </div>
        {/* <DialougeEditDates methods={methods} trigger="Edit Trip" content={null} /> */}
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs font-bold uppercase text-muted-foreground">Check-in / Out</p>
          <p className="text-sm font-medium">
            {checkin ? format(new Date(checkin), "MMM dd") : "—"} - {checkout ? format(new Date(checkout), "MMM dd") : "—"}
          </p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs font-bold uppercase text-muted-foreground">Guests</p>
          <p className="text-sm font-medium">
            {methods.watch("guests.adults")} Adults, {methods.watch("guests.children")} Children
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function GuestInfoCard({ methods }: { methods: UseFormReturn<PaymentProps> }) {
  const { control } = methods;
  const { fields } = useFieldArray({ control, name: "guestInformation" });

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Guest Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <div className="space-y-4 p-5 rounded-xl border bg-zinc-50/50 dark:bg-zinc-900/50" key={field.id}>
            <p className="font-bold text-sm flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {index + 1}
              </span>
              {index === 0 ? "Primary Guest (Booking Holder)" : `Guest ${index + 1}`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`guestInformation.${index}.firstname`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input placeholder="John" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`guestInformation.${index}.lastname`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {index === 0 && (
                <>
                  <FormItem className="md:col-span-2">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input type="email" placeholder="john@example.com" {...methods.register(`guestInformation.${index}.email`)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem className="md:col-span-2">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput defaultCountry="IN" value={methods.watch(`guestInformation.${index}.phone`)} onChange={(val) => methods.setValue(`guestInformation.${index}.phone`, val)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SpecialRequestCard({ methods }: { methods: UseFormReturn<PaymentProps> }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Any Special Requests?</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Early check-in, dietary requirements, etc. (Optional)" 
          className="min-h-[100px] bg-muted/20" 
          {...methods.register("specialRequest")} 
        />
      </CardContent>
    </Card>
  );
}

function AddOnsCard() {
  return (
    <Card className="shadow-sm border-dashed">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-3">
            <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <Info className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-bold text-sm">Travel Insurance</p>
              <p className="text-xs text-muted-foreground italic">Add protection for your trip for ₹1,000</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-full px-4" onClick={(e)=>{
            e.preventDefault()
          }}><Plus className="h-3 w-3 mr-1"/> Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CancellationPolicyCard() {
  return (
    <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300">Cancellation Policy</h4>
            <p className="text-xs text-blue-800/70 dark:text-blue-400">
              Free cancellation before Aug 1. Get a partial refund if cancelled before Jul 10.
            </p>
            <Button variant="link" size="sm" className="h-auto p-0 text-blue-700 font-bold" onClick={(e)=>{
            e.preventDefault()
          }}>View full policy</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const HighLightBar = () => {
  const { currentstep: currentStep } = usePaymentsContext();
  const steps = [
    { id: 1, label: "Selection" },
    { id: 2, label: "Details" },
    { id: 3, label: "Confirm" }
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-3xl mx-auto px-4">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center relative">
            <div className={cn(
              "h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 z-10",
              currentStep > step.id ? "bg-zinc-900 text-white" : 
              currentStep === step.id ? "bg-orange-500 text-white ring-4 ring-orange-100 scale-110" : 
              "bg-zinc-200 text-zinc-500"
            )}>
              {currentStep > step.id ? <CheckCircle2 className="h-6 w-6" /> : step.id}
            </div>
            <span className={cn(
              "absolute -bottom-6 text-[10px] md:text-xs font-bold uppercase tracking-tighter whitespace-nowrap",
              currentStep === step.id ? "text-orange-600" : "text-muted-foreground"
            )}>
              {step.label}
            </span>
          </div>
          {idx !== steps.length - 1 && (
            <div className={cn(
              "flex-1 h-1 mx-2 md:mx-4 rounded-full transition-colors duration-500",
              currentStep > step.id ? "bg-zinc-900" : "bg-zinc-200"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export function DialougeEditDates({ methods, trigger }: { methods: UseFormReturn<PaymentProps>; trigger: string; content: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs font-bold">
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] md:max-w-[900px] p-0 overflow-hidden">
        <div className="p-6 border-b">
          <DialogTitle>Update Your Stay</DialogTitle>
          <DialogDescription>Modify dates or guest count to see updated pricing.</DialogDescription>
        </div>
        <div className="flex flex-col md:flex-row gap-0">
          <div className="flex-1 p-6 border-b md:border-b-0 md:border-r">
            <HotelCalender methods={methods} />
          </div>
          <div className="flex-1 p-6 bg-muted/20">
            <VisitorsMembers showCalendar={false} methods={methods} />
          </div>
        </div>
        <div className="p-4 bg-zinc-50 flex justify-end">
          <Button onClick={() => window.location.reload()}>Apply Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}