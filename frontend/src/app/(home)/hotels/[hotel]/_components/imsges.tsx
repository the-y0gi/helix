"use client";

import React from "react";

import { HotelImage } from "@/types";
import Gallery from "@/components/gallery";

export function LayoutGridDemo({ images }: { images: HotelImage[] }) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full py-8 text-center text-muted-foreground">
        No hotel images available
      </div>
    );
  }

  const imageUrls = images.map((img) =>
    typeof img === "string" ? img : img.url
  );

  const featuredImage = imageUrls[0];

  const gridImages = imageUrls
    .slice(1, 5)
    .map((src, idx) => ({
      src,
      alt: `Hotel view ${idx + 2}`,
    }));

  while (gridImages.length < 4) {
    gridImages.push({
      src: featuredImage,
      alt: "Featured hotel view (repeated)",
    });
  }

  const gallerySections = [
    {
      images: [
        {
          src: featuredImage,
          alt: "Featured hotel view",
        },
      ],
    },
    {
      type: "grid",
      images: gridImages,
    },
  ];

  return (
    <div className="py-2 w-full ">
      <Gallery sections={gallerySections} />
    </div>
  );
}