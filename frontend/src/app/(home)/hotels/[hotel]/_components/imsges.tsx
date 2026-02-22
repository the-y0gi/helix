"use client";
import { LayoutGrid } from "@/components/ui/layout-grid";
import React from "react";

import { HotelImage } from "@/types";

export function LayoutGridDemo({ images }: { images: HotelImage[] }) {
  const mappedCards = images.slice(0, 4).map((img, index) => ({
    id: index + 1,
    content: <Skeleton index={index} />,
    className: index === 0 || index === 3 ? "md:col-span-2" : "col-span-1",
    thumbnail: typeof img === "string" ? img : img.url,
  }));

  return (
    <div className="h-[600px] py-2 w-full">
      <LayoutGrid cards={mappedCards.length > 0 ? mappedCards : defaultCards} />
    </div>

  );
}

const Skeleton = ({ index }: { index: number }) => {
  return (
    <div>
      <p className="font-bold md:text-2xl text-xl text-white">
        Hotel View {index + 1}
      </p>
    </div>
  );
};

const defaultCards = [
  {
    id: 1,
    content: <Skeleton index={0} />,
    className: "md:col-span-2 flex item-center",
    thumbnail: "/room1.png",
  },
  {
    id: 2,
    content: <Skeleton index={1} />,
    className: "col-span-1",
    thumbnail: "/room2.png",
  },
  {
    id: 3,
    content: <Skeleton index={2} />,
    className: "col-span-1",
    thumbnail: "/room3.png",
  },
  {
    id: 4,
    content: <Skeleton index={3} />,
    className: "md:col-span-2",
    thumbnail: "/room2.png",
  },
];
