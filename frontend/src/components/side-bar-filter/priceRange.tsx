import { Slider } from "@/components/ui/slider";
import { useHotelContext } from "@/context/hotel/HotelContextProvider";
import React from "react";

// type Props = {
//   value: number[];
//   setValue: React.Dispatch<React.SetStateAction<number[]>>;
// };

export default function PriceRange() {
  const {filters , setFilters} = useHotelContext();
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Nightly prices including fees and taxes
      </p>

      <Slider
        value={filters.price}
        onValueChange={(value) => setFilters({price:value as [number, number]})}
        max={100}
        step={1}
        className="w-full"
      />

      <div className="flex justify-between px-3 text-sm">
          <div className="flex-col gap-2 items-center flex">
            <p className="text-zinc-50/50">minimum</p>
            <span className="p-2 border dark:border-zinc-100/20 rounded-md w-20 ">${filters.price?.[0]}</span>
          </div>
          <div className="flex-col gap-2 items-center flex">
            <p className="text-zinc-50/50">maximum</p>
            <span className="p-2 border dark:border-zinc-100/20 rounded-md w-20">${filters.price?.[1]}+</span>
          </div>
      </div>
    </div>
  );
}


