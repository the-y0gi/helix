// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { IconStarFilled } from "@tabler/icons-react";
// import React from "react";
// import { useRouter } from "next/navigation";
// import { LikeIcon } from "@/services/dailyfunctions";
// import { MapPin, Users, Moon, CheckCircle2 } from "lucide-react";
// import { useIsMobile } from "@/hooks/use-mobile";

// type HotelCardProps = {
//   hotelId: string;
//   image: string;
//   title: string;
//   location: string;
//   tag?: string;
//   rating: number;
//   reviews: {
//     text: string;
//     count: number;
//   };
//   roomInfo: string;
//   oldPrice?: string;
//   price: string;
//   favourite?: boolean;
//   discount: string;
//   nights?: number;
//   stars: number;
//   adults?: number;
//   wrap?: boolean; // We will use this to enforce horizontal layout
//   amenities?: string[];
//   left?: number;
// };

// export function HotelCard({
//   hotelId,
//   left,
//   amenities,
//   stars,
//   favourite,
//   wrap,
//   image,
//   title,
//   location,
//   tag,
//   rating,
//   reviews,
//   roomInfo,
//   oldPrice,
//   price,
//   discount,
//   nights = 1,
//   adults = 1,
// }: HotelCardProps) {
//   const navigate = useRouter();
//   const isMobile = useIsMobile();

//   // Desktop horizontal view logic, but also allows forced horizontal via wrap prop
//   const isHorizontal = (!wrap && !isMobile) || (wrap === false);

//   if (isMobile) {
//     // --- Optimized Compact Mobile View ---
//     return (
//       <Card
//         className="group overflow-hidden rounded-xl border bg-card w-full shadow-md"
//       >
//         {/* Compact Image Section */}
//         <div className="relative w-full h-[180px]">
//           <img
//             src={image || "/img2.png"}
//             alt={title}
//             className="h-full w-full object-cover rounded-t-xl"
//           />
//           {tag && (
//             <div className="absolute left-2.5 top-2.5 bg-green-600 text-white rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-sm">
//               {tag}
//             </div>
//           )}
//           <LikeIcon
//             _id={hotelId}
//             isFavourite={favourite || false}
//             name="card"
//             className="absolute right-2.5 top-2.5 h-7 w-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
//           />
//         </div>

//         {/* Optimized Compact Content Section */}
//         <CardContent className="p-3.5 flex flex-col gap-2">
//           {/* Header Row: Title, Stars, and Location */}
//           <div className="flex flex-col gap-1">
//             <div className="flex justify-between items-start gap-1">
//               <h3
//                 className="text-base font-bold leading-tight cursor-pointer line-clamp-1"
//                 onClick={() => navigate.push(`/hotels/${hotelId}`)}
//               >
//                 {title}
//               </h3>
//               {/* Stars on Mobile */}
//               <div className="flex shrink-0 gap-0.5 pt-1">
//                 {[...Array(5)].map((_, i) => (
//                   <IconStarFilled
//                     key={i}
//                     className={cn("w-3 h-3", i < stars ? "text-yellow-400" : "text-zinc-200")}
//                   />
//                 ))}
//               </div>
//             </div>
//             <div className="flex items-center gap-1 text-xs text-muted-foreground">
//               <MapPin className="h-3.5 w-3.5 text-blue-500" />
//               <span>{location}</span>
//             </div>
//           </div>

//           {/* Rating Block & Review Count */}
//           <div className="flex items-center justify-between gap-3 pt-1">
//             <div className="flex flex-col items-start gap-1">
//               <span className="text-xs font-bold text-blue-600">Excellent</span>
//               <span className="text-[10px] text-muted-foreground">{reviews.count} reviews</span>
//             </div>
//             <div className="bg-blue-600 text-white font-black h-8 w-8 flex items-center justify-center rounded-lg rounded-bl-none text-base shadow-inner">
//               {rating.toFixed(1)}
//             </div>
//           </div>

//           {/* Room Description - Compact */}
//           <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
//             {roomInfo}
//           </p>

//           {/* Compact Amenities - up to 3 for mobile */}
//           {amenities && (
//             <div className="flex flex-wrap gap-1.5 pt-1">
//               {amenities.slice(0, 3).map((item, idx) => (
//                 <div key={idx} className="flex items-center gap-1 text-[10px] font-medium text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 px-1.5 py-0.5 rounded-full">
//                   <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
//                   {item}
//                 </div>
//               ))}
//               {amenities.length > 3 && (
//                 <span className="text-[9px] text-muted-foreground self-center">+{amenities.length - 3}</span>
//               )}
//             </div>
//           )}

//           {/* Pricing Area - Compact */}
//           <div className="pt-3 border-t flex flex-col gap-1.5">
//             {left && (
//               <div className="inline-block bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-100 self-start">
//                 Only {left} rooms left!
//               </div>
//             )}
//             <div className="flex flex-row items-end justify-between">
//               <div className="flex flex-col items-start gap-1.5">
//                 <div className="flex items-center gap-2.5 text-[10px] font-medium text-zinc-500">
//                   <span className="flex items-center gap-1"><Moon className="w-3 h-3" /> {nights} N</span>
//                   <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {adults} A</span>
//                 </div>
//                 <p className="text-[10px] text-muted-foreground leading-none">+ taxes & fees</p>
//               </div>

//               <div className="text-right flex flex-col items-end">
//                 {discount && (
//                   <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px] px-1.5 py-0 mb-1 rounded">
//                     {discount} OFF
//                   </Badge>
//                 )}
//                 {oldPrice && (
//                   <span className="text-xs text-muted-foreground line-through opacity-70 mb-0.5">
//                     {oldPrice}
//                   </span>
//                 )}
//                 <span className="text-xl font-black text-foreground leading-none">{price}</span>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   } else {
//     // --- Optimized Laptop View (unchanged from previous version, as it's good) ---
//     return (
//       <Card
//         className={cn(
//           "group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg",
//           isHorizontal ? "flex flex-row w-full min-h-[260px]" : "flex flex-col w-full"
//         )}
//       >
//         {/* Image Container */}
//         <div
//           className={cn(
//             "relative",
//             isHorizontal ? "w-[350px] shrink-0" : "w-full h-[230px]"
//           )}
//         >
//           <img
//             src={image || "/img2.png"}
//             alt={title}
//             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//           />
//           {tag && (
//             <div className="absolute left-3 top-3 bg-green-600 text-white rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase shadow-md">
//               {tag}
//             </div>
//           )}
//           <LikeIcon
//             _id={hotelId}
//             isFavourite={favourite || false}
//             name="card"
//             className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-sm"
//           />
//         </div>

//         {/* Content Container */}
//         <CardContent className={cn("p-5 flex flex-col flex-1 gap-3", isHorizontal ? "justify-between" : "")}>

//           <div className="flex flex-col md:flex-row justify-between gap-4">
//             {/* Info Side */}
//             <div className="space-y-2 flex-1">
//               <div className="flex items-center gap-2">
//                 <h3
//                   className="text-xl font-bold leading-tight cursor-pointer hover:text-blue-600 transition-colors line-clamp-1"
//                   onClick={() => navigate.push(`/hotels/${hotelId}`)}
//                 >
//                   {title}
//                 </h3>
//                 <div className="flex shrink-0">
//                   {[...Array(5)].map((_, i) => (
//                     <IconStarFilled key={i} className={cn("w-3 h-3", i < stars ? "text-yellow-400" : "text-zinc-200")} />
//                   ))}
//                 </div>
//               </div>

//               <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
//                 <MapPin className="h-4 w-4 text-blue-500" />
//                 <span className="underline underline-offset-2 decoration-dotted">{location}</span>
//               </div>

//               <p className="text-sm text-muted-foreground line-clamp-2 max-w-[500px]">
//                 {roomInfo}
//               </p>

//               {/* Amenities - Trimmed to 5 */}
//               {amenities && (
//                 <div className="flex flex-wrap gap-2 pt-1">
//                   {amenities.slice(0, 5).map((item, idx) => (
//                     <div key={idx} className="flex items-center gap-1 text-[11px] font-medium text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-full">
//                       <CheckCircle2 className="w-3 h-3 text-green-500" />
//                       {item}
//                     </div>
//                   ))}
//                   {amenities.length > 5 && (
//                     <span className="text-[10px] text-muted-foreground self-center">+{amenities.length - 5} more</span>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Rating & Review Side (Right side on Desktop) */}
//             <div className={cn("flex items-center md:items-end gap-3 shrink-0", isHorizontal ? "flex-col justify-start" : "flex-row")}>
//               <div className="text-right hidden md:block">
//                 <p className="font-bold text-blue-600 leading-none">Excellent</p>
//                 <p className="text-xs text-muted-foreground">{reviews.count} reviews</p>
//               </div>
//               <div className="bg-blue-600 text-white font-bold h-10 w-10 flex items-center justify-center rounded-lg rounded-bl-none text-lg shadow-sm">
//                 {rating.toFixed(1)}
//               </div>
//             </div>
//           </div>

//           {/* Pricing Area */}
//           <div className="pt-4 border-t flex flex-row items-end justify-between">
//             <div className="space-y-1">
//               {left && (
//                 <div className="inline-block bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100 mb-1">
//                   Hurry! Only {left} rooms left
//                 </div>
//               )}
//               <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
//                 <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5" /> {nights} Nights</span>
//                 <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {adults} Adults</span>
//               </div>
//             </div>

//             <div className="text-right">
//               {discount && (
//                 <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[11px] mb-1">
//                   {discount} OFF
//                 </Badge>
//               )}
//               <div className="flex flex-col">
//                 {oldPrice && (
//                   <span className="text-sm text-muted-foreground line-through opacity-70">
//                     {oldPrice}
//                   </span>
//                 )}
//                 <div className="flex items-baseline justify-end gap-1">
//                   <span className="text-2xl font-black text-foreground">{price}</span>
//                 </div>
//                 <p className="text-[10px] text-muted-foreground">+ taxes & fees</p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }
// }

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IconStarFilled } from "@tabler/icons-react";
import React from "react";
import { useRouter } from "next/navigation";
import { LikeIcon } from "@/services/dailyfunctions";
import { MapPin, Users, Moon, CheckCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  favourite?: boolean;
  discount: string;
  nights?: number;
  stars: number;
  adults?: number;
  wrap?: boolean; // false = horizontal (list), true = vertical (grid)
  amenities?: string[];
  left?: number;
};

export function HotelCard({
  hotelId,
  left,
  amenities,
  stars,
  favourite,
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
  const isMobile = useIsMobile();

  // Desktop horizontal view logic
  const isHorizontal = !isMobile && !wrap;

  if (isMobile) {
    // --- Optimized Compact Mobile View ---
    return (
      <Card className="group overflow-hidden rounded-xl border bg-card w-full shadow-md pt-0">
        {/* Compact Image Section */}
        <div className="relative w-full h-[180px]">
          <img
            src={image || "/img2.png"}
            alt={title}
            className="h-full w-full object-cover rounded-t-xl"
          />
          {tag && (
            <div className="absolute left-2.5 top-2.5 bg-green-600 text-white rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-sm">
              {tag}
            </div>
          )}
          <LikeIcon
            _id={hotelId}
            isFavourite={favourite || false}
            name="card"
            className="absolute right-2.5 top-2.5 h-7 w-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
          />
        </div>

        {/* Optimized Compact Content Section */}
        <CardContent className="p-3.5 flex flex-col gap-2">
          {/* Header Row: Title and Stars */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-start gap-1">
              <h3
                className="text-base font-bold leading-tight cursor-pointer line-clamp-1"
                onClick={() => navigate.push(`/hotels/${hotelId}`)}
              >
                {title}
              </h3>
              <div className="flex shrink-0 gap-0.5 pt-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <IconStarFilled
                    key={i}
                    size={12}
                    className={cn(i < stars ? "text-yellow-400" : "text-zinc-200")}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              <span>{location}</span>
            </div>
          </div>

          {/* Rating Block & Review Count */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-xs font-bold text-blue-600">{reviews.text}</span>
              <span className="text-[10px] text-muted-foreground">{reviews.count} reviews</span>
            </div>
            <div className="bg-blue-600 text-white font-black h-8 w-8 flex items-center justify-center rounded-lg rounded-bl-none text-sm shadow-inner">
              {rating.toFixed(1)}
            </div>
          </div>

          {/* Room Description - Compact */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
            {roomInfo}
          </p>

          {/* Compact Amenities - up to 3 for mobile */}
          {amenities && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {amenities.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1 text-[10px] font-medium text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 px-1.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
                  {item}
                </div>
              ))}
              {amenities.length > 3 && (
                <span className="text-[9px] text-muted-foreground self-center">+{amenities.length - 3}</span>
              )}
            </div>
          )}

          {/* Pricing Area - Compact */}
          <div className="pt-3 border-t flex flex-col gap-1.5">
            {left && (
              <div className="inline-block bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-100 self-start">
                Only {left} left at this price!
              </div>
            )}
            <div className="flex flex-row items-end justify-between">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2.5 text-[10px] font-medium text-zinc-500">
                  <span className="flex items-center gap-1"><Moon size={12} /> {nights}N</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {adults}A</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-none">+ taxes & fees</p>
              </div>

              <div className="text-right flex flex-col items-end">
                {discount && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px] px-1.5 py-0 mb-1 rounded">
                    {discount} OFF
                  </Badge>
                )}
                {oldPrice && (
                  <span className="text-xs text-muted-foreground line-through opacity-70 mb-0.5">
                    {oldPrice}
                  </span>
                )}
                <span className="text-xl font-black text-foreground leading-none">{price}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Laptop/Desktop View (Flexible List or Grid) ---
  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg",
        isHorizontal ? "flex flex-row w-full min-h-[260px]" : "flex flex-col w-full"
      )}
    >
      {/* Image Container */}
      <div
        className={cn(
          "relative",
          isHorizontal ? "w-[250px] shrink-0" : "w-full h-[200px]"
        )}
      >
        <img
          src={image || "/img2.png"}
          alt={title}
          className="h-full w-full aspect-video rounded-md object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {tag && (
          <div className="absolute left-3 top-3 bg-green-600 text-white rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase shadow-md">
            {tag}
          </div>
        )}
        <LikeIcon
          _id={hotelId}
          isFavourite={favourite || false}
          name="card"
          className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-sm"
        />
      </div>

      {/* Content Container */}
      <CardContent className={cn("p-5 flex flex-col flex-1 gap-3", isHorizontal ? "justify-between" : "")}>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Info Side */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className="text-xl font-bold leading-tight cursor-pointer hover:text-blue-600 transition-colors line-clamp-1"
                onClick={() => navigate.push(`/hotels/${hotelId}`)}
              >
                {title}
              </h3>
              <div className="flex shrink-0 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <IconStarFilled key={i} size={14} className={cn(i < stars ? "text-yellow-400" : "text-zinc-200")} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="underline underline-offset-2 decoration-dotted">{location}</span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 max-w-[500px]">
              {roomInfo}
            </p>

            {/* Amenities - Trimmed to 5 */}
            {amenities && (
              <div className="flex flex-wrap gap-2 pt-1">
                {amenities.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-[11px] font-medium text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    {item}
                  </div>
                ))}
                {amenities.length > 5 && (
                  <span className="text-[10px] text-muted-foreground self-center">+{amenities.length - 5} more</span>
                )}
              </div>
            )}
          </div>

          {/* Rating & Review Side (Right side on Desktop List) */}
          <div className={cn("flex items-center md:items-end gap-3 shrink-0", isHorizontal ? "flex-col justify-start" : "flex-row")}>
            <div className={cn("text-right hidden md:block", isHorizontal ? "text-right" : "text-left")}>
              <p className="font-bold text-blue-600 leading-none">{reviews.text}</p>
              <p className="text-xs text-muted-foreground">{reviews.count} reviews</p>
            </div>
            <div className="bg-blue-600 text-white font-bold h-10 w-10 flex items-center justify-center rounded-lg rounded-bl-none text-lg shadow-sm">
              {rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Pricing Area */}
        <div className="pt-4 border-t flex flex-row items-end justify-between">
          <div className="space-y-1">
            {left && (
              <div className="inline-block bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100 mb-1">
                Only {left} left at this price
              </div>
            )}
            <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
              <span className="flex items-center gap-1"><Moon size={14} /> {nights} Nights</span>
              <span className="flex items-center gap-1"><Users size={14} /> {adults} Adults</span>
            </div>
          </div>

          <div className="text-right">
            {discount && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[11px] mb-1">
                {discount} OFF
              </Badge>
            )}
            <div className="flex flex-col">
              {oldPrice && (
                <span className="text-sm text-muted-foreground line-through opacity-70">
                  {oldPrice}
                </span>
              )}
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-black text-foreground">{price}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-none mt-1">+ taxes & fees</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}