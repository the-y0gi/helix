"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IconStarFilled } from "@tabler/icons-react";
import React from "react";
import { useRouter } from "next/navigation";
import { LikeIcon } from "@/services/dailyfunctions";
import { MapPin, Navigation, Building2, ZoomIn, Clock, Percent, Mountain } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Activity } from "@/context/AdventureContextProvider";
import { ImagePreview } from "@/app/(personal)/profile/_components/image-preview";
import { RouterPush } from "@/components/RouterPush";

type AdventuresCardProps = {
  adventure: Activity;
  wrap?: boolean;
  favourite?: boolean;
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

const formatCurrency = (v: number) =>
  `₹${v.toLocaleString("en-IN")}`;

const ratingLabel = (r: number) =>
  r >= 4.5 ? "Excellent" : r >= 3.5 ? "Very Good" : r >= 2.5 ? "Good" : "Average";

// ─── AdventuresCard ─────────────────────────────────────────────────────────────

export const AdventuresCard = ({ adventure, wrap, favourite }: AdventuresCardProps) => {
  const navigate = useRouter();
  const isMobile = useIsMobile();
  const isHorizontal = !isMobile && !wrap;

  const {
    _id,
    category,
    city,
    description, features, image, name, priceStart, rating, reviews,
  } = adventure;

  const idToUse = _id;

  const imagee =
    image && image.length > 50 ? image : "/hotels/hotel-temp.png";

  // ── Mobile ──────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <Card className="group overflow-hidden rounded-xl border bg-card w-full shadow-md pt-0">
        <ImagePreview src={imagee} alt={name}>
          <div className="relative w-full h-[180px]">
            <img
              src={imagee}
              alt={name}
              className="h-full w-full object-cover rounded-t-xl"
            />
            {/* Category badge */}
            {category && (
              <div className="absolute left-2.5 top-2.5 bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-sm border">
                {category}
              </div>
            )}
            <LikeIcon
              _id={idToUse!}
              isFavourite={favourite || false}
              name="card"
              className="absolute right-2.5 top-2.5 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
            />
          </div>
        </ImagePreview>

        <CardContent className="p-3.5 flex flex-col gap-2">
          {/* Title */}
          <h3
            className="text-base font-bold leading-tight cursor-pointer line-clamp-2"
            onClick={() => RouterPush(navigate, `/adventures/${idToUse}`)}
          >
            {name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{city}</span>
            </div>
          </div>

          {/* Features info */}
          {features && features.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-medium line-clamp-1 truncate">
                {features[0]}
              </span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-xs font-bold text-primary">
                {ratingLabel(rating || 0)}
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <IconStarFilled
                    key={i}
                    size={11}
                    className={cn(
                      i < Math.round(rating || 0)
                        ? "text-yellow-400"
                        : "text-zinc-200 dark:text-zinc-700"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="bg-primary text-white font-black h-8 w-8 flex items-center justify-center rounded-lg rounded-bl-none text-sm shadow-inner">
              {(rating || 0).toFixed(1)}
            </div>
          </div>

          {/* Pricing */}
          <div className="pt-3 border-t flex flex-row items-end justify-between mt-1">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500">
                <Mountain size={12} />
                <span>Adventure</span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-xl font-black text-foreground leading-none">
                {formatCurrency(priceStart)}
              </span>
              <p className="text-[10px] text-muted-foreground leading-none mt-1">
                Per Person
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Desktop ─────────────────────────────────────────────────────────────────
  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg",
        isHorizontal
          ? "flex flex-row w-full min-h-[240px]"
          : "flex flex-col w-full"
      )}
    >
      {/* Image */}
      <ImagePreview src={imagee} alt={name}>
        <div
          className={cn(
            "relative cursor-zoom-in group",
            isHorizontal ? "w-[250px] shrink-0" : "w-full h-[200px]"
          )}
        >
          <img
            src={imagee}
            alt={name}
            className="h-full w-full aspect-video rounded-md object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
            <ZoomIn className="text-white drop-shadow-md" size={32} />
          </div>
          {/* Category badge */}
          {category && (
            <div className="absolute left-3 top-3 bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800 rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase shadow-md border">
              {category}
            </div>
          )}
          <LikeIcon
            _id={idToUse!}
            isFavourite={favourite || false}
            name="card"
            className="absolute right-3 top-3 h-9 w-9 rounded-full bg-transparent backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-sm"
          />
        </div>
      </ImagePreview>

      {/* Content */}
      <CardContent
        className={cn(
          "p-5 flex flex-col flex-1 gap-3",
          isHorizontal ? "justify-between" : ""
        )}
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Info */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className="text-xl font-bold leading-tight cursor-pointer hover:text-primary transition-colors line-clamp-2"
                onClick={() => RouterPush(navigate, `/adventures/${idToUse}`)}
              >
                {name}
              </h3>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="underline underline-offset-2 decoration-dotted">
                  {city}
                </span>
              </div>
            </div>

            {/* Features */}
            {features && features.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 shrink-0">
                  <Clock className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground line-clamp-1">
                  {features[0]}
                </span>
              </div>
            )}

            {/* Stars row */}
            <div className="flex items-center gap-2 pt-1.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <IconStarFilled
                    key={i}
                    size={14}
                    className={cn(
                      i < Math.round(rating || 0)
                        ? "text-yellow-400"
                        : "text-zinc-200 dark:text-zinc-700"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {ratingLabel(rating || 0)} ({reviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* Rating badge */}
          <div
            className={cn(
              "flex items-center md:items-end gap-3 shrink-0",
              isHorizontal ? "flex-col justify-start" : "flex-row"
            )}
          >
            <div
              className={cn(
                "text-right hidden md:block",
                isHorizontal ? "text-right" : "text-left"
              )}
            >
              <p className="font-bold text-primary leading-none">
                {ratingLabel(rating || 0)}
              </p>
            </div>
            <div className="bg-primary text-white font-bold h-10 w-10 flex items-center justify-center rounded-lg rounded-bl-none text-lg shadow-sm">
              {(rating || 0).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-4 border-t flex flex-row items-end justify-between mt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
              <span className="flex items-center gap-1">
                <Mountain size={14} /> Activity
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex flex-col">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-black text-foreground">
                  {formatCurrency(priceStart)}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  /person
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Skeleton ───────────────────────────────────────────────────────────────────

export const AdventuresCardSkeleton = ({ wrap }: { wrap?: boolean }) => {
  const isMobile = useIsMobile();
  const isHorizontal = !isMobile && !wrap;

  if (isMobile) {
    return (
      <Card className="group overflow-hidden rounded-xl border bg-card w-full shadow-md pt-0">
        <Skeleton className="w-full h-[180px] rounded-t-xl rounded-b-none" />
        <CardContent className="p-3.5 flex flex-col gap-2">
          <Skeleton className="h-5 w-2/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <div className="flex flex-col gap-2 mt-1">
            <Skeleton className="h-3.5 w-full" />
          </div>
          <div className="flex items-center justify-between pt-1 mt-2">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-16" />
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-3 w-3 rounded-full" />
                ))}
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-lg rounded-bl-none" />
          </div>
          <div className="pt-3 border-t flex flex-row items-end justify-between mt-2">
            <div className="flex flex-col gap-1 w-20">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-14" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-2.5 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border bg-card transition-all duration-300",
        isHorizontal
          ? "flex flex-row w-full min-h-[240px]"
          : "flex flex-col w-full min-h-[380px]"
      )}
    >
      <Skeleton
        className={cn(
          "shrink-0",
          isHorizontal
            ? "w-[250px] h-full rounded-l-2xl rounded-r-none"
            : "w-full h-[200px] rounded-t-2xl rounded-b-none"
        )}
      />
      <CardContent
        className={cn(
          "p-5 flex flex-col flex-1 gap-3",
          isHorizontal ? "justify-between" : ""
        )}
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-4 flex-1">
            <Skeleton className="h-6 w-[70%]" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <Skeleton className="h-4 w-[85%]" />
            </div>
            <div className="flex gap-0.5 pt-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-3.5 w-3.5 rounded-full" />
              ))}
            </div>
          </div>
          <div
            className={cn(
              "flex items-center md:items-end gap-3 shrink-0",
              isHorizontal ? "flex-col justify-start" : "flex-row"
            )}
          >
            <div className="flex flex-col gap-1.5 hidden md:flex items-end">
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg rounded-bl-none" />
          </div>
        </div>
        <div className="pt-4 border-t flex flex-row items-end justify-between mt-2">
          <div className="space-y-2 w-32">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};