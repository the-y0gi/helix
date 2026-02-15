"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"
import { useHotelStore } from "@/store/hotel.store"

export function BookingCalender({ className, setDateRange, dateRange }: { className?: string, setDateRange: (dateRange: DateRange | undefined) => void, dateRange: DateRange | undefined }) {


    return (
        <Card className="mx-auto w-fit p-0">
            <CardContent className="p-0">
                <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                    }
                />
            </CardContent>
        </Card>
    )
}
export const HotelCalender = ({ className }: { className?: string }) => {
    const { checkIn, setCheckIn } = useHotelStore()
    return (
        <BookingCalender setDateRange={setCheckIn} dateRange={checkIn} className={className} />
    );
}