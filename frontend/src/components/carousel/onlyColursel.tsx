"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { destinations } from "@/constants/constants";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useHotelsQuery } from "@/services/hotel/querys";

type Item = {
  title: string;
  location: string;
  image: string | StaticImageData;
  href: string;
};

type Props = {
  type: "cabs" | "adventures" | "tours" | "bikes" | "hotels";
  tagline?: string;
  item?:Item[]
};

export const OnlyCarousel = ({ type, tagline,item }: Props) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const { data: hotels, isLoading } = useHotelsQuery();

  const items: Item[] = React.useMemo(() => {
    if (type === "hotels" && hotels) {
      return hotels.map((hotel) => ({
        title: hotel.name,
        location: `${hotel.city}, India`,
        image: hotel.images?.[0]?.url || "/placeholder-hotel.jpg",
        href: `/hotels/${hotel._id}`,
      }));
    }
    if (type === "cabs") return destinations as Item[];
    return [];
  }, [type, hotels]);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanLeft(scrollLeft > 5); // 5px buffer for sub-pixel rendering
      setCanRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    
    // Listen for scroll and window resize
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [items, updateScrollButtons]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8; // Scroll 80% of view
    scrollRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!isLoading && items.length === 0) return null;

  return (
    <div className="relative group">
      {/* Header & Controls */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold capitalize flex gap-2 items-center">{tagline} 
          {/* <ChevronRight className="h-4 w-4" /> */}
          </h2>
        <div className="flex gap-2">
          <CarouselButton 
            onClick={() => scroll("left")} 
            disabled={!canLeft} 
            icon={<ChevronLeft className="h-4 w-4" />} 
          />
          <CarouselButton 
            onClick={() => scroll("right")} 
            disabled={!canRight} 
            icon={<ChevronRight className="h-4 w-4" />} 
          />
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        {isLoading ? (
          // Simple Skeleton Loader
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="min-w-[220px] h-[200px] animate-pulse bg-gray-200 rounded-xl" />
          ))
        ) : (
          items.map((item, i) => (
            <Card
              key={`${item.title}-${i}`}
              item={item}
              onClick={() => router.push(item.href)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const CarouselButton = ({ onClick, disabled, icon }: { onClick: () => void, disabled: boolean, icon: React.ReactNode }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="rounded-full border bg-background p-2 shadow-sm transition-all hover:bg-primary disabled:opacity-30 disabled:cursor-not-allowed"
  >
    {icon}
  </button>
);

const Card = React.memo(({ item, onClick }: { item: Item; onClick: () => void }) => {
  return (
    <div 
      onClick={onClick} 
      className="min-w-[220px] snap-start cursor-pointer group/card"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
        <Image
          width={400} // Higher width for better resolution on high-DPI screens
          height={300}
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-110"
        />
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-semibold line-clamp-1">{item.title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
      </div>
    </div>
  );
});