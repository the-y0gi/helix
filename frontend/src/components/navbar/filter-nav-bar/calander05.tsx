import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { useHotelStore } from "@/store/hotel.store";
import { cn } from "@/lib/utils";

export function Calendar05({
  dateRange,
  setDateRange,
}: {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
}) {
  //   const today = new Date();
  // today.setHours(0, 0, 0, 0);
const today = new Date();
today.setHours(0, 0, 0, 0);
  return (
    <Calendar
    disabled={{ before: today }}
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      // Optional: show 1 month on mobile, 2 on desktop for better fit
      numberOfMonths={
        typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2
      }
      className={cn(
        "border-none shadow-none",
        // Mobile: Take up the space you liked
        "w-[85vw] h-auto min-h-[300px]",
        // PC (md): Reset to a standard size
        "md:w-full md:max-w-none md:h-auto",
      )}
      classNames={{
        // Ensures the two months sit side-by-side on PC and stack on mobile
        months: "flex flex-col md:flex-row  md:space-x-2 md:space-y-0",
        month: "space-y-2",
        table: "w-full border-collapse space-y-1",
        head_cell:
          "text-muted-foreground rounded-md w-4 font-normal text-[0.8rem]",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
      }}
    />
  );
}
export default function HotelCalender () {
  const { date, setDate } = useHotelStore();
  return <Calendar05 setDateRange={setDate} dateRange={date} />;
};
