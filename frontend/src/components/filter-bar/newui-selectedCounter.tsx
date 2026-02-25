"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type GuestType = "adults" | "children" | "infants" | "pets";

export default function GuestSelector() {
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const handleChange = (type: GuestType, operation: "inc" | "dec") => {
    setGuests((prev) => {
      const value = prev[type];

      if (operation === "dec" && value === 0) return prev;
      if (type === "adults" && operation === "dec" && value === 1) return prev;

      return {
        ...prev,
        [type]: operation === "inc" ? value + 1 : value - 1,
      };
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
    <div className="flex items-center justify-between py-4 px-1">
      <div className="flex flex-col">
        <p className="text-base font-semibold text-foreground leading-tight">
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Decrease Button */}
        <button
          onClick={() => handleChange(type, "dec")}
          disabled={
            guests[type] === 0 ||
            (type === "adults" && guests.adults === 1)
          }
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border border-border transition active:scale-95",
            guests[type] === 0 ||
              (type === "adults" && guests.adults === 1)
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Minus size={16} />
        </button>

        {/* Count */}
        <span className="w-5 text-center text-base font-medium text-foreground tabular-nums">
          {guests[type]}
        </span>

        {/* Increase Button */}
        <button
          onClick={() => handleChange(type, "inc")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:bg-accent hover:text-accent-foreground active:scale-95"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl bg-background">
      <Row title="Adults" subtitle="Ages 13 or above" type="adults" />
      <div className="border-t border-border" />

      <Row title="Children" subtitle="Ages 2–12" type="children" />
      <div className="border-t border-border" />

      <Row title="Infants" subtitle="Under 2" type="infants" />
      <div className="border-t border-border" />

      <Row
        title="Pets"
        subtitle="Bringing a service animal?"
        type="pets"
      />
    </div>
  );
}