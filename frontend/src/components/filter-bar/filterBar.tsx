"use client"
import { IconSearch } from "@tabler/icons-react";
import type { FilterBarValues } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { Item, ItemContent, ItemDescription, ItemTitle } from "../ui/item";
import HotelFilterBar from "./HotelFilterBar";
import { Button } from "../ui/button";
import { useHotelStore } from "@/store/hotel.store";
import { useRouter } from "next/navigation";


export const PagesFilterBarButtons = ({
  origin,
  PagesFilterBarValues,
  link,
  type,
}: {
  origin?: "Hotels" | "Cabs" | "Tours" | "Adventures"|"Bikes";
  PagesFilterBarValues: FilterBarValues[];
  link?: string;
  type?: "filter" | "home";
}) => {
  const navigate = useRouter();
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-2 ">
      {PagesFilterBarValues.map((hv, i) => (
        <HotelFilterBar
          type={type}
          key={i}
          tagline={hv.tagline}
          content={hv.element}
        >
          <div className="flex flex-col items-center gap-2 md:flex-row ">
            <div
              className={cn(
                "bg-border relative ",
                i === 0 && "hidden",
                "h-px w-6 md:h-4 md:w-px ",

                type === "filter" && "md:h-18",
              )}
            />

            <Item>
              <ItemContent className="gap-0 text-center md:text-left md:ml-3 items-center">
                <ItemTitle>{hv.value}</ItemTitle>
                <ItemDescription>{hv.description}</ItemDescription>
               
               
             
              </ItemContent>
            </Item>
          </div>
        </HotelFilterBar>
      ))}

      {type === "home" && (
        <Button
          onClick={() => navigate.push(link || "/")}
          variant={"ghost"}
          className={cn(
            "mt-2 flex h-12 w-full items-center justify-center rounded-full bg-primary text-white md:mt-0 md:h-12 md:w-12",
          )}
        >
          <IconSearch size={20} />
        </Button>
      )}
    </div>
  );
};
