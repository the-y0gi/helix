"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { destinations } from "@/constants/constants";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

import { Hotel } from "@/types";
import { getHotels } from "@/services/hotel.service";
import { useHotelsQuery } from "@/services/querys";

type Item = {
  title: string;
  location: string;
  image: string | StaticImageData;
  href?: string;
};

type Props = {
  type: "cabs" | "adventures" | "tours" | "bikes" | "hotels";
};

export const OnlyCarousel = ({ type }: Props) => {
  const navigate = useRouter();

  const { data: hotels, isLoading } = useHotelsQuery();

  const items: Item[] =
    type === "hotels" && hotels
      ? hotels.map((hotel) => ({
        title: hotel.name,
        location: `${hotel.city}, India`,
        image: hotel.images?.[0]?.url || "",
        href: `/hotels/${hotel._id}`,
      }))
      : type === "cabs"
        ? destinations
        : [];

  // if (isLoading) return <p>Loading...</p>;

  const scrollRef = useRef<HTMLDivElement>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const CARD_WIDTH = 220 + 16;
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -CARD_WIDTH : CARD_WIDTH,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      setCanLeft(el.scrollLeft > 0);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    update();
    el.addEventListener("scroll", update);
    return () => el.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="relative">
      {/* arrows */}
      <div className="mb-3 flex justify-end gap-2">
        <button
          onClick={() => scroll("left")}
          disabled={!canLeft}
          className="rounded-full border p-1.5 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => scroll("right")}
          disabled={!canRight}
          className="rounded-full border p-1.5 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* carousel */}
      <div
        ref={scrollRef}
        className="
          flex gap-4 overflow-x-auto pb-4
          snap-x snap-mandatory
          scrollbar-hide
        "
      >
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          items.map((item, i) => {
            return (
              <Card
                key={i}
                item={item}
                onClick={() => navigate.push(item.href || `/hotels/${i}`)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

type CardProps = {
  item: Item;
  onClick: () => void;
};

const Card = React.memo(({ item, onClick }: CardProps) => {
  return (
    <button onClick={onClick} className="min-w-[220px] snap-start text-left">
      <div className="aspect-[4/3] overflow-hidden rounded-xl">
        <Image
          width={220}
          height={150}
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>

      <div className="mt-2">
        <h3 className="text-sm font-medium">{item.title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {item.location}
        </div>
      </div>
    </button>
  );
});
