
import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { useHotelStore } from "@/store/hotel.store";

export function Calendar05(
  { dateRange, setDateRange }: {
    dateRange: DateRange | undefined;
    setDateRange: (dateRange: DateRange | undefined) => void;
  }
) {

//   const today = new Date();
// today.setHours(0, 0, 0, 0);
  
  return (
    <Calendar
      mode="range"
      // fixedWeeks
      // disabled={{ before: today }}
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm"
    />
  );
}
export const HotelCalender =()=>{
  const {date , setDate}=useHotelStore()
  return (
    <Calendar05 setDateRange={setDate} dateRange={date} />
  );
}

