"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"
import { useHotelStore } from "@/store/hotel.store"
import { UseFormReturn } from "react-hook-form"
import { PaymentProps } from "@/schema/payment.schema"

export function BookingCalender({ className, setDateRange, dateRange, methods }: { className?: string, setDateRange: (dateRange: DateRange | undefined) => void, dateRange: DateRange | undefined, methods?: UseFormReturn<PaymentProps> }) {

const today = new Date();
today.setHours(0, 0, 0, 0);
    return (
        <Card className="mx-auto w-fit p-0">
            <CardContent className="p-0">
                <Calendar
                    mode="range"
                    disabled={{ before: today }}
                    // defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(dateRange) => {
                        setDateRange(dateRange)
                        methods?.setValue("dates", {
                            checkin: dateRange?.from?.toISOString() || "",
                            checkout: dateRange?.to?.toISOString() || ""
                        })
                    }}
                    numberOfMonths={2}
                    // disabled={(date) =>
                    //     date > new Date() || date < new Date("1900-01-01")
                    // }
                    className="border-none shadow-none"
                />
            </CardContent>
        </Card>
    )
}
export const HotelCalender = ({ className, methods }: { className?: string, methods?: UseFormReturn<PaymentProps> }) => {
    const { date, setDate } = useHotelStore()
    return (
        <BookingCalender setDateRange={setDate} dateRange={date} className={className} methods={methods} />
    );
}