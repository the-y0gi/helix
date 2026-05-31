import { useRouter } from "next/navigation";
import { downloadBookings } from "./book.service";
import { useRef } from "react";
import { Calendar, CheckCircle2, Copy, Download, Home, Mail, Smartphone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RouterPush } from "@/components/RouterPush";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

    const handelDownload = async () => {
        try {
            const res = await downloadBookings(payment.bookingId);

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="min-h-screen w-full  dark:bg-zinc-950 flex items-center justify-center p-4 md:p-8">
            <Card className="w-full overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-101 border-none ring-1 ring-black/5 dark:ring-white/10">

                {/* Modern Success Header */}
                <div className="relative bg-green-600 text-primary-foreground p-8 md:p-12 text-center overflow-hidden ">
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
                            RouterPush(router, "/");

                        }}
                    >
                        <Home size={18} />
                        Go Home
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            handelDownload();
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
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
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