"use client";

import Gallery from "@/app/(home)/(categories)/_componentsRoot_categories/gallery";
import { HotelImage } from "@/types";
import React, { Suspense } from "react";


export function LayoutGridDemo({ images: imagelist, v = "default" }: { images: HotelImage[], v?: "base4" | "default" }) {
  if (!imagelist || imagelist.length === 0) {
    return (
      <div className="w-full py-8 text-center text-muted-foreground">
        No tour images available
      </div>
    );
  }
  console.log("imagelist", imagelist)

  const imageUrls = imagelist
    ?.map((img) => img?.url)
    ?.filter(Boolean);

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

      <Gallery sections={gallerySections} variant={v === "default" ? "default" : "base4"} />

    </div>
  );
}