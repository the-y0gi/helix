"use client";

import Gallery from "@/app/(home)/(categories)/_componentsRoot_categories/gallery";
import { HotelImage } from "@/types";
import React, { Suspense } from "react";
const images = [
  {
    "url": "https://res.cloudinary.com/dwfolqpht/image/upload/v1771828468/general/p7pppjdfgwu6ewqtu9fh.jpg",
    "public_id": "general/sample",
    "resource_type": "image",
    "_id": "69b805d08eceb263ce97ccbd"
  },
  {
    "url": "https://res.cloudinary.com/dwfolqpht/image/upload/v1771828285/general/cfyshlynt5bbyyc0vvnv.jpg",
    "public_id": "general/sample",
    "resource_type": "image",
    "_id": "69b805d08eceb263ce97ccbe"
  },
  {
    "url": "https://res.cloudinary.com/dwfolqpht/image/upload/v1771828293/general/bjuj0gebkd7lhot7y7bj.jpg",
    "public_id": "general/sample",
    "resource_type": "image",
    "_id": "69b805d08eceb263ce97ccbf"
  },
  {
    "url": "https://res.cloudinary.com/dwfolqpht/image/upload/v1771828289/general/xrdjhqvzflmxoimk5qol.jpg",
    "public_id": "general/sample",
    "resource_type": "image",
    "_id": "69b805d08eceb263ce97ccc0"
  }
];

export function LayoutGridDemo({ images: imagelist, v = "default" }: { images: HotelImage[], v?: "base4" | "default" }) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full py-8 text-center text-muted-foreground">
        No hotel images available
      </div>
    );
  }
  const imagesb = imagelist.length > 1 ? imagelist : images;
  const imageUrls = imagesb.map((img) =>
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

      <Gallery sections={gallerySections} variant={v === "default" ? "default" : "base4"} />

    </div>
  );
}