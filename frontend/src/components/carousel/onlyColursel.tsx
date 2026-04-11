// "use client";

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
// import { destinations } from "@/constants/constants";
// import Image, { StaticImageData } from "next/image";
// import { useRouter } from "next/navigation";
// import { useHotelsQuery } from "@/services/hotel/querys";
// import { GalleryCard, HotelGalleryCard } from "../comet-card-demo";
// import { RouterPush } from "../RouterPush";
// import { useHotelStore } from "@/store/hotel.store";
// // import { GalleryCard } from "../comet-card-demo";
// // import HotelGalleryCard from "../comet-card-demo";

// export type Item = {
//   title: string;
//   location: string;
//   image: string | StaticImageData;
//   href: string;
// };

// type Props = {
//   type: "cabs" | "adventures" | "tours" | "bikes" | "hotels";
//   tagline?: string;
//   items: Item[];
//   isLoading?: boolean;
// };



// export const OnlyCarousel = ({ type, tagline, items, isLoading }: Props) => {
//   const router = useRouter();
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Tracking touch for overscroll redirect
//   const touchStartRef = useRef<number>(0);
//   const [canLeft, setCanLeft] = useState(false);
//   const [canRight, setCanRight] = useState(false);

//   const updateScrollButtons = useCallback(() => {
//     const el = scrollRef.current;
//     if (el) {
//       const { scrollLeft, scrollWidth, clientWidth } = el;
//       setCanLeft(scrollLeft > 5);
//       setCanRight(scrollLeft + clientWidth < scrollWidth - 5);
//     }
//   }, []);

//   // --- OVERSCROLL REDIRECT LOGIC ---
//   const handleTouchStart = (e: React.TouchEvent) => {
//     touchStartRef.current = e.touches[0].clientX;
//   };
//   const { city, setCity } = useHotelStore();
//   const handleTouchMove = (e: React.TouchEvent) => {
//     const el = scrollRef.current;
//     if (!el) return;

//     const touchCurrent = e.touches[0].clientX;
//     const touchDiff = touchStartRef.current - touchCurrent;

//     const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;

//     if (isAtEnd && touchDiff > 100) {
//       setCity(tagline?.split(" ")?.[tagline.split(" ").length - 1] || "indore");
//       RouterPush(router, "/hotels/find");
//     }
//   };

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     updateScrollButtons();
//     el.addEventListener("scroll", updateScrollButtons);
//     window.addEventListener("resize", updateScrollButtons);

//     return () => {
//       el.removeEventListener("scroll", updateScrollButtons);
//       window.removeEventListener("resize", updateScrollButtons);
//     };
//   }, [items, updateScrollButtons]);

//   const scroll = (dir: "left" | "right") => {
//     if (!scrollRef.current) return;
//     const scrollAmount = scrollRef.current.clientWidth * 0.8;
//     scrollRef.current.scrollBy({
//       left: dir === "left" ? -scrollAmount : scrollAmount,
//       behavior: "smooth",
//     });
//   };

//   if (!isLoading && items.length === 0) return null;

//   return (
//     <div className="relative group bg-transparent">
//       <div className="mb-4 flex items-center justify-between px-2 md:px-0">
//         <h2 className="text-md md:text-xl font-semibold capitalize flex gap-2 items-center text-nowrap">
//           {tagline}
//         </h2>
//         <div className="flex gap-2">
//           <CarouselButton
//             onClick={() => scroll("left")}
//             disabled={!canLeft}
//             icon={<ChevronLeft className="h-4 w-4" />}
//           />
//           <CarouselButton
//             onClick={() => scroll("right")}
//             disabled={!canRight}
//             icon={<ChevronRight className="h-4 w-4" />}
//           />
//         </div>
//       </div>

//       <div
//         ref={scrollRef}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth pt-5 px-3"
//       >
//         {isLoading ? (
//           Array.from({ length: 7 }).map((_, i) => (
//             <div key={i} className="min-w-[220px] h-[200px] animate-pulse bg-gray-200 rounded-xl" />
//           ))
//         ) : (
//           <>
//             {items.map((item, i) => (
//               <Card
//                 key={`${item.title}-${i}`}
//                 item={item}
//                 onClick={() => RouterPush(router, item.href)}
//               />
//             ))}
//             <div className="min-w-[240px]">
//               <GalleryCard handleTouchMove={() => { RouterPush(router, "/hotels/find") }} images={["/hotels/room1.png", "/hotels/room2.png", "/hotels/room3.png"]} />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// const CarouselButton = ({ onClick, disabled, icon }: { onClick: () => void, disabled: boolean, icon: React.ReactNode }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled}
//     className="rounded-full border bg-background p-2 shadow-sm transition-all hover:bg-primary disabled:opacity-30 disabled:cursor-not-allowed"
//   >
//     {icon}
//   </button>
// );

// const Card = React.memo(({ item, onClick }: { item: Item; onClick: () => void }) => {
//   return (
//     <div
//       onClick={onClick}
//       className="min-w-[220px] snap-start cursor-pointer group/card pl-1"
//     >
//       <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
//         <Image
//           width={220} // Higher width for better resolution on high-DPI screens
//           height={165}
//           src={item.image}
//           alt={item.title}
//           className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-110"
//         />
//       </div>

//       <div className="mt-2 space-y-1">
//         <h3 className="text-sm font-semibold line-clamp-1">{item.title}</h3>
//         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//           <MapPin className="h-3 w-3 shrink-0" />
//           <span className="line-clamp-1">{item.location}</span>
//         </div>
//       </div>
//     </div>
//   );
// });













"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { RouterPush } from "../RouterPush";
import { useHotelStore } from "@/store/hotel.store";
import { cn } from "@/lib/utils";
import { HotelsCardSkleton, PageSkeleton } from "../loader/skeleton";
import { Skeleton } from "../ui/skeleton";

export type Item = {
  title: string;
  location: string;
  image: string | StaticImageData;
  href: string;
};

type Props = {
  type: "cabs" | "adventures" | "tours" | "bikes" | "hotels";
  tagline?: string;
  items: Item[];
  isLoading?: boolean;
};

export const OnlyCarousel = ({ type, tagline, items, isLoading }: Props) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const touchStartRef = useRef<number>(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanLeft(scrollLeft > 5);
      setCanRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  const { setCity } = useHotelStore();

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    const touchCurrent = e.touches[0].clientX;
    const touchDiff = touchStartRef.current - touchCurrent;

    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;

    if (isAtEnd && touchDiff > 100 && tagline) {
      const lastWord = tagline.split(" ").pop() || "indore";
      setCity(lastWord.toLowerCase());
      RouterPush(router, "/hotels/find");
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [items, updateScrollButtons]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!isLoading && items.length === 0) return null;

  return (
    <div className="relative group bg-transparent">
      <div className="mb-4 flex items-center justify-between px-2 md:px-0">
        <h2 className="text-lg md:text-xl font-semibold capitalize flex gap-2 items-center text-nowrap">
          {tagline}
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

      {/* Fixed: Added pl-1 for 1px left padding as requested */}
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={cn("flex gap-1 md:gap-3 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth pt-2  pr-3", isLoading&&"pl-1")}
      >
        {isLoading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[170px] md:min-w-[216px] h-[165px] gap-1 flex flex-col  md:h-[195px]   rounded-xl"
            >
              <Skeleton className="aspect-video w-full" />
              <div className="mt-2.5 md:mt-3 space-y-1 px-1 flex flex-col gap-2">

      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
            </div>
            </div>
          ))
        ) : (
          <>
            {items.map((item, i) => (
              <Card
                key={`${item.title}-${i}`}
                item={item}
                onClick={() => RouterPush(router, item.href)}
              />
            ))}

            {/* See All Card - GalleryCard */}
            <div className="min-w-[190px] md:min-w-[235px] snap-start">
              <GalleryCard
                handleTouchMove={() => RouterPush(router, "/hotels/find")}
                images={[
                  "/hotels/room1.png",
                  "/hotels/room2.png",
                  "/hotels/room3.png",
                ]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CarouselButton = ({
  onClick,
  disabled,
  icon,
}: {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "rounded-full border border-border bg-background p-2.5 shadow-sm transition-all",
      "hover:bg-accent hover:text-accent-foreground",
      "disabled:opacity-40 disabled:cursor-not-allowed"
    )}
  >
    {icon}
  </button>
);

const Card = React.memo(({ item, onClick }: { item: Item; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className=" pl-1 min-w-[170px] md:min-w-[216px] snap-start cursor-pointer group/card"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-card border border-border shadow-sm">
        <Image
          width={220}
          height={165}
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
        />
      </div>

      <div className="mt-2.5 md:mt-3 space-y-1 px-1">
        <h3 className="text-sm font-semibold line-clamp-1 text-card-foreground">
          {item.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
      </div>
    </div>
  );
});

// Updated GalleryCard with better responsive sizing
interface GalleryCardProps {
  images: string[];
  label?: string;
  className?: string;
  handleTouchMove?: (e: React.TouchEvent) => void;
}

export function GalleryCard({
  images = [],
  label = "See all",
  className = "",
  handleTouchMove,
}: GalleryCardProps) {
  const displayImages = images.slice(0, 3);
  const router = useRouter();

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-neutral-900/60 to-black/80",
        "shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02]",
        "h-[145px] md:h-[155px]",
        className
      )}
      onTouchMove={handleTouchMove}
    >
      <div className="relative h-[145px] md:h-[155px] w-full">
        {/* Background blurred image */}
        {displayImages[0] && (
          <Image
            src={displayImages[0]}
            alt="Background"
            fill
            className="object-cover blur-sm brightness-50"
          />
        )}

        {/* Stacked sharp images */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
          {displayImages.map((src, idx) => (
            <div
              key={idx}
              className={`
                relative aspect-[4/5] w-1/3 overflow-hidden rounded-xl border border-white/20 shadow-xl
                transition-transform duration-300 group-hover:scale-105
              `}
              style={{
                transform: `rotate(${idx === 0 ? "-8deg" : idx === 2 ? "8deg" : "0deg"})`,
              }}
            >
              <Image
                src={src}
                alt={`Room view ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* See All Label */}
      <div
        className="absolute bottom-4 left-0 right-0 text-center cursor-pointer"
        onClick={() => RouterPush(router, "/hotels/find")}
      >
        <span className="rounded-full bg-black/70 px-6 py-1.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/80">
          {label}
        </span>
      </div>
    </div>
  );
}