"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHotelStore } from "@/store/hotel.store";

type GuestType = "adults" | "children";

export default function GuestSelector() {
  const { guests, setGuests } = useHotelStore();

  const handleChange = (type: GuestType, operation: "inc" | "dec") => {
    const value = guests[type];
    if (operation === "dec" && value === 0) return;
    if (type === "adults" && operation === "dec" && value === 1) return;

    setGuests({
      ...guests,
      [type]: operation === "inc" ? value + 1 : value - 1,
    });
  };

  const Row = ({
    title,
    subtitle,
    type,
  }: {
    title: string;
    subtitle?: string;
    type: GuestType;
  }) => (
    /* Reduced vertical padding on mobile (py-3 vs py-4) */
    <div className="flex items-center justify-between py-3 md:py-4 px-1">
      <div className="flex flex-col">
        {/* Shrunk text size for mobile (text-sm vs text-base) */}
        <p className="text-sm md:text-base font-semibold text-foreground leading-tight">
          {title}
        </p>
        {subtitle && (
          /* Shrunk subtitle text for mobile */
          <p className="text-[11px] md:text-sm text-muted-foreground mt-0.5 leading-tight">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={() => handleChange(type, "dec")}
          disabled={
            guests[type] === 0 || (type === "adults" && guests.adults === 1)
          }
          /* Shrunk button size for mobile (h-7 vs h-9) */
          className={cn(
            "flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full border border-border transition active:scale-95",
            guests[type] === 0 || (type === "adults" && guests.adults === 1)
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>

        {/* Shrunk count text for mobile */}
        <span className="w-4 md:w-5 text-center text-sm md:text-base font-medium text-foreground tabular-nums">
          {guests[type]}
        </span>

        <button
          onClick={() => handleChange(type, "inc")}
          className="flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full border border-border transition hover:bg-accent hover:text-accent-foreground active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );

  return (
    /* Added a bit of responsive padding to the container */
    <div className="w-full max-w-md mx-auto rounded-2xl bg-background p-1 md:p-0">
      <Row title="Adults" subtitle="Ages 13 or above" type="adults" />
      <div className="border-t border-border" />
      <Row title="Children" subtitle="Ages 2–12" type="children" />
    </div>
  );
}