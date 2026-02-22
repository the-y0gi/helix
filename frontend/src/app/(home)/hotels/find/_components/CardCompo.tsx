"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IconStarFilled } from "@tabler/icons-react";
import React from "react";
import { useRouter } from "next/navigation";
import { LikeIcon } from "@/services/dailyfunctions";
import { MapPin } from "lucide-react";

type HotelCardProps = {
  hotelId: string;
  image: string;
  title: string;
  location: string;
  tag?: string;
  rating: number;
  reviews: {
    text: string;
    count: number;
  };
  roomInfo: string;
  oldPrice?: string;
  price: string;
  discount: string;
  nights?: number;
  stars: number;
  adults?: number;
  wrap?: boolean;
  amenities?: string[];
  left?: number;
};
export function HotelCard({
  hotelId,
  left,
  amenities,
  stars,
  wrap,
  image,
  title,
  location,
  tag,
  rating,
  reviews,
  roomInfo,
  oldPrice,
  price,
  discount,
  nights = 1,
  adults = 1,
}: HotelCardProps) {
  const navigate = useRouter();
  const [heart, setHeart] = React.useState(false);
  return (
    <Card
      className={cn(
        "w-[290px] overflow-hidden rounded-2xl border shadow-sm hover:scale-101 transition-transform duration-100",
        wrap ? "flex-col " : "flex-row w-full",
      )}

    >
      <div
        className={cn(
          "relative h-[255px] w-full pt-1 px-3  overflow-hidden",
          !wrap ? "w-1/2" : "w-full",
        )}
      >
        <img

          src='/img2.png'
          alt={title}
          className="h-full w-full object-cover rounded-2xl"
        />

        {tag && (
          <div className="absolute left-3  bg-green-600 text-white rounded-2xl px-3 py-1 text-sm font-medium top-1">
            {tag}
          </div>
        )}

        {/* <Button
          onClick={() => setHeart(!heart)}
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 h-8 w-8 rounded-full"
        >
          {
            heart ? (
              <Heart
                color="red"
                fill="red"

              />
            ) : (
              <Heart
              />
            )
          }
        </Button> */}
        <LikeIcon _id={hotelId} isFavourite={false} name="card" className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/50 flex items-center justify-center" />

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
        </div>
      </div>

      <CardContent className={cn("space-y-2 p-3 w-full ", wrap ? "" : "px-2 pr-8")}>
        <div
          className={cn(
            "flex flex-col",
            wrap ? "" : "flex-row justify-between w-full",
          )}
        >
          <div>
            <div className="flex items-center justify-between gap-5">
              <h3 className="text-base font-semibold leading-tight text-xl cursor-pointer" onClick={() => navigate.push(`/hotels/${hotelId}`)} >{title}</h3>
              <div className="flex">
                {wrap ? (
                  <span className="flex gap-1 items-center">
                    {stars}
                    <IconStarFilled color="yellow" size={15} />
                  </span>
                ) : (
                  [...Array(stars)].map((_, i) => (
                    <IconStarFilled key={i} fill="gold" size={15} />
                  ))
                )}
              </div>
            </div>

            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {location}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-white">
              {rating.toFixed(1)}
            </span>
            <div
              className={cn("flex items-end", wrap ? "" : "items-end flex-col")}
            >
              <span className="text-md  text-blue-500">{reviews.text}</span>
              <span className="text-sm text-muted-foreground">
                {reviews.count} reviews
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{roomInfo}</p>

        <div className={cn(wrap ? "flex-col flex " : "flex-row justify-between w-full flex items-end")}>
          <div>
            {amenities && !wrap && (
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <Badge
                    key={index}
                    className="border border-zinc-500 dark:border-zinc-300/20  text-foreground px-2 py-1 dark:bg-zinc-700 bg-white rounded-full text-sm"
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            )}
            {left && (
              <p className="text-sm text-red-300/90">
                Only {left} left at this price
              </p>
            )}
          </div>

          <div
            className={cn(
              "flex items-start pt-5 justify-between",
              wrap ? "" : "flex-col items-end gap-2",
            )}
          >
            {discount && (
              <Badge
                variant="secondary"
                className="rounded-2xl bg-green-100 text-green-700"
              >
                {discount}
              </Badge>
            )}
            <div>
              <div className="flex gap-1 items-center">
                {oldPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    {oldPrice}
                  </p>
                )}
                <p className="text-lg font-semibold">{price}</p>
              </div>
              <div className="flex">
                <span className="text-sm text-muted-foreground">
                  {nights} nights
                </span>
                ,
                <span className="text-sm text-muted-foreground">
                  {adults} adults
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
