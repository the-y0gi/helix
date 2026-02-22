// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import {
//   BedDouble,
//   Users,
//   Square,
//   Bed,
// } from "lucide-react";
// import { amenityIconMap } from "@/components/ui/icons";
// import { useRouter } from "next/navigation";
// import { useHotelStore } from "@/store/hotel.store";

// export interface RoomCardProps {
//   id: string;
//   title: string;
//   imageUrl: string;
//   originalPrice: number;
//   discountedPrice: number;
//   totalPrice: number;
//   nights: number;
//   rating: number;
//   reviewCount: number;
//   beds: number;
//   dubleBeds: number;
//   guests: number;
//   size: number;
//   amenities: {
//     name: string;
//     icon: string;
//   }[];
//   roomsLeft: number;
//   discountPercent?: number;
// }

// export function HotelRoomCard({
//   title = "Superior Twin Room",
//   imageUrl,
//   id,
//   originalPrice = 350,
//   discountedPrice = 290,
//   totalPrice = 1450,
//   nights = 5,
//   rating = 5.0,
//   reviewCount = 1260,
//   beds,
//   dubleBeds,
//   guests = 2,
//   size = 30,
//   amenities,
//   roomsLeft = 2,
//   discountPercent = 10,
// }: RoomCardProps) {
//   const router = useRouter();
//   const { setHotel } = useHotelStore();

//   const handleReserve = () => {
//     setHotel({
//       id: id,
//       image: imageUrl,
//       name: title,
//       rating: rating,
//       price: discountedPrice,
//       reviewCount: reviewCount,
//       totalPrice: totalPrice,
//     });
//     router.push(`/book/${id}`);
//   };

//   return (
//     <Card className="w-full flex flex-col md:flex-row overflow-hidden border-border bg-card hover:shadow-md transition-shadow">
//       <div className="w-full md:w-[300px] lg:w-[340px] shrink-0 h-48 md:h-auto relative">
//         <img
//           src={imageUrl}
//           alt={title}
//           className="w-full h-full object-cover rounded-r-lg"
//         />
//         {roomsLeft <= 3 && (
//           <Badge className="absolute top-0 left-0 bg-red-400 hover:bg-red-600 text-white border-0 shadow-sm rounded-sm">
//             Only {roomsLeft} room{roomsLeft > 1 ? "s" : ""} left!
//           </Badge>
//         )}
//       </div>

//       <div className="flex flex-1 flex-col md:flex-row">
//         <div className="flex-1 p-5 flex flex-col gap-4">
//           <div className="flex flex-col gap-2">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="font-bold text-xl leading-tight text-foreground">{title}</h3>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge variant="secondary" className="text-xs font-normal">
//                     {rating} ★
//                   </Badge>
//                   <span className="text-xs text-muted-foreground">
//                     ({reviewCount.toLocaleString()} reviews)
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-4 text-sm text-foreground/80">
//             <div className="flex items-center gap-1.5">
//               <Square className="h-4 w-4 text-muted-foreground" />
//               <span>{size} m²</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <Users className="h-4 w-4 text-muted-foreground" />
//               <span>{guests} guest{guests > 1 ? "s" : ""}</span>
//             </div>
//             {(beds > 0 || dubleBeds > 0) && (
//               <div className="flex items-center gap-1.5">
//                 <Bed className="h-4 w-4 text-muted-foreground" />
//                 <span>
//                   {[
//                     beds > 0 ? `${beds} Single` : null,
//                     dubleBeds > 0 ? `${dubleBeds} Double` : null
//                   ].filter(Boolean).join(" & ")} Bed{beds + dubleBeds > 1 ? "s" : ""}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-wrap gap-2 mt-auto">
//             {amenities.slice(0, 5).map((amenity) => {
//               const Icon = amenityIconMap[amenity.icon];
//               return (
//                 <Badge
//                   key={amenity.name}
//                   variant="outline"
//                   className="px-2 py-1 h-auto font-normal text-muted-foreground bg-muted/30 gap-1.5"
//                 >
//                   {Icon && <Icon className="h-3 w-3" />}
//                   {amenity.name}
//                 </Badge>
//               );
//             })}
//             {amenities.length > 5 && (
//               <Badge variant="outline" className="px-2 py-1 h-auto font-normal text-muted-foreground bg-muted/30">
//                 +{amenities.length - 5} more
//               </Badge>
//             )}
//           </div>
//         </div>

//         <div className="hidden md:block w-px bg-border my-4" />

//         <div className="p-5 md:w-[240px] shrink-0 flex flex-col justify-between items-end bg-muted/10">
//           <div className="text-right space-y-1">
//             {discountPercent && (
//               <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">
//                 {discountPercent}% OFF
//               </Badge>
//             )}
//             <div className="mt-2">
//               <span className="text-muted-foreground text-sm line-through decoration-muted-foreground/50">
//                 ${originalPrice}
//               </span>
//               <div className="text-2xl font-bold text-primary">
//                 ${discountedPrice}
//               </div>
//             </div>
//             <p className="text-xs text-muted-foreground">
//               for {nights} night{nights > 1 ? "s" : ""}
//             </p>
//             <div className="text-sm font-medium mt-1 text-foreground/80">
//               Total: ${totalPrice.toLocaleString()}
//             </div>
//           </div>

//           <div className="w-full mt-4">
//             <Button
//               size="lg"
//               className="w-full font-semibold shadow-sm"
//               onClick={handleReserve}
//             >
//               Reserve
//             </Button>
//             <p className="text-[10px] text-center text-muted-foreground mt-2">
//               Includes taxes & fees
//             </p>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Users, Square, Bed } from "lucide-react";
// import { amenityIconMap } from "@/components/ui/icons";
// import { useRouter } from "next/navigation";
// import { useHotelStore } from "@/store/hotel.store";

// export interface RoomCardProps {
//   hotelId: string;
//   id: string; // roomTypeId
//   title: string;
//   imageUrl: string;
//   originalPrice: number;
//   discountedPrice: number; // finalPrice
//   totalPrice: number;
//   nights: number;
//   rating: number;
//   reviewCount: number;
//   beds: number;
//   dubleBeds: number;
//   guests: number;
//   size: number;
//   amenities: {
//     name: string;
//     icon: string;
//   }[];
//   roomsLeft: number;
//   discountPercent?: number;
// }

// export function HotelRoomCard({
//   hotelId,
//   id,
//   title,
//   imageUrl,
//   originalPrice,
//   discountedPrice,
//   totalPrice,
//   nights,
//   rating,
//   reviewCount,
//   beds,
//   dubleBeds,
//   guests,
//   size,
//   amenities,
//   roomsLeft,
//   discountPercent = 0,
// }: RoomCardProps) {
//   const router = useRouter();
//   const { setSelectedRoom } = useHotelStore();

//   const handleReserve = () => {
//     if (roomsLeft === 0) return;

//     setSelectedRoom({
//       hotelId: hotelId,
//       roomTypeId: id,
//       title,
//       image: imageUrl,
//       pricePerNight: discountedPrice,
//       totalPrice,
//       nights,
//     });

//     // router.push(`/book/${id}`);
//     router.push(`/book/${hotelId}/${id}`);

//   };

//   return (
//     <Card className="w-full flex flex-col md:flex-row overflow-hidden border-border bg-card hover:shadow-md transition-shadow">
//       {/* Image Section */}
//       <div className="w-full md:w-[300px] lg:w-[340px] shrink-0 h-48 md:h-auto relative">
//         <img
//           src={imageUrl || "/img1.png"}
//           alt={title}
//           className="w-full h-full object-cover rounded-r-lg"
//         />

//         {roomsLeft > 0 && roomsLeft <= 3 && (
//           <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
//             Only {roomsLeft} room{roomsLeft > 1 ? "s" : ""} left!
//           </Badge>
//         )}

//         {roomsLeft === 0 && (
//           <Badge className="absolute top-2 left-2 bg-gray-500 text-white border-0">
//             Sold Out
//           </Badge>
//         )}
//       </div>

//       {/* Content Section */}
//       <div className="flex flex-1 flex-col md:flex-row">
//         {/* Left Info */}
//         <div className="flex-1 p-5 flex flex-col gap-4">
//           <div>
//             <h3 className="font-bold text-xl">{title}</h3>
//             <div className="flex items-center gap-2 mt-1">
//               <Badge variant="secondary" className="text-xs">
//                 {rating} ★
//               </Badge>
//               <span className="text-xs text-muted-foreground">
//                 ({reviewCount.toLocaleString()} reviews)
//               </span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
//             <div className="flex items-center gap-1">
//               <Square className="h-4 w-4" />
//               <span>{size} m²</span>
//             </div>

//             <div className="flex items-center gap-1">
//               <Users className="h-4 w-4" />
//               <span>
//                 {guests} guest{guests > 1 ? "s" : ""}
//               </span>
//             </div>

//             {(beds > 0 || dubleBeds > 0) && (
//               <div className="flex items-center gap-1">
//                 <Bed className="h-4 w-4" />
//                 <span>
//                   {[
//                     beds > 0 ? `${beds} Single` : null,
//                     dubleBeds > 0 ? `${dubleBeds} Double` : null,
//                   ]
//                     .filter(Boolean)
//                     .join(" & ")}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {amenities.slice(0, 5).map((amenity) => {
//               const Icon = amenityIconMap[amenity.icon];
//               return (
//                 <Badge
//                   key={amenity.name}
//                   variant="outline"
//                   className="text-xs flex items-center gap-1"
//                 >
//                   {Icon && <Icon className="h-3 w-3" />}
//                   {amenity.name}
//                 </Badge>
//               );
//             })}

//             {amenities.length > 5 && (
//               <Badge variant="outline" className="text-xs">
//                 +{amenities.length - 5} more
//               </Badge>
//             )}
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="hidden md:block w-px bg-border my-4" />

//         {/* Right Pricing Section */}
//         <div className="p-5 md:w-[240px] shrink-0 flex flex-col justify-between items-end bg-muted/10">
//           <div className="text-right space-y-1">
//             {discountPercent > 0 && (
//               <Badge className="bg-green-600 text-white border-0">
//                 {discountPercent}% OFF
//               </Badge>
//             )}

//             {originalPrice > discountedPrice && (
//               <div className="text-sm text-muted-foreground line-through">
//                 ₹{originalPrice}
//               </div>
//             )}

//             <div className="text-2xl font-bold text-primary">
//               ₹{discountedPrice}
//             </div>

//             <p className="text-xs text-muted-foreground">
//               for {nights} night{nights > 1 ? "s" : ""}
//             </p>

//             {/* <div className="text-sm font-medium mt-1">
//               Total: ₹{totalPrice.toLocaleString()}
//             </div> */}

//             {typeof totalPrice === "number" && (
//               <div className="text-sm font-medium mt-1">
//                 Total: ₹{totalPrice.toLocaleString()}
//               </div>
//             )}
//           </div>

//           <div className="w-full mt-4">
//             <Button
//               size="lg"
//               disabled={roomsLeft === 0}
//               className="w-full font-semibold disabled:opacity-50"
//               onClick={handleReserve}
//             >
//               {roomsLeft === 0 ? "Sold Out" : "Reserve"}
//             </Button>

//             <p className="text-[10px] text-center text-muted-foreground mt-2">
//               Includes taxes & fees
//             </p>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }

// "use client";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { Users, Square, Bed } from "lucide-react";
// import { amenityIconMap } from "@/components/ui/icons";
// import { useRouter } from "next/navigation";
// import { useHotelStore } from "@/store/hotel.store";

// export interface RoomCardProps {
//   hotelId: string;
//   id: string;
//   title: string;
//   imageUrl: string;
//   originalPrice: number;
//   discountedPrice: number;
//   totalPrice?: number;
//   nights: number;
//   rating: number;
//   reviewCount: number;
//   beds: string; // formatted string
//   guests: number;
//   size: number;
//   amenities: {
//     name: string;
//     icon: string;
//   }[];
//   roomsLeft: number;
//   discountPercent?: number;
//   isBookingMode: boolean;
// }

// export function HotelRoomCard({
//   hotelId,
//   id,
//   title,
//   imageUrl,
//   originalPrice,
//   discountedPrice,
//   totalPrice,
//   nights,
//   rating,
//   reviewCount,
//   beds,
//   guests,
//   size,
//   amenities,
//   roomsLeft,
//   discountPercent = 0,
//   isBookingMode,
// }: RoomCardProps) {
//   const router = useRouter();
//   const { setSelectedRoom } = useHotelStore();

//   const handleReserve = () => {
//     if (isBookingMode && roomsLeft === 0) return;

//     setSelectedRoom({
//       hotelId,
//       roomTypeId: id,
//       title,
//       image: imageUrl,
//       pricePerNight: discountedPrice,
//       totalPrice: totalPrice || discountedPrice,
//       nights,
//     });

//     router.push(`/book/${hotelId}/${id}`);
//   };

//   return (
//     <Card className="w-full overflow-hidden border bg-card hover:shadow-md transition-shadow">
//       <div className="grid md:grid-cols-[320px_1fr_240px]">
//         {/* ---------------- Image ---------------- */}
//         <div className="h-56 md:h-full">
//           <img
//             src={imageUrl || "/img1.png"}
//             alt={title}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* ---------------- Info Section ---------------- */}
//         <div className="p-6 flex flex-col gap-4">
//           {/* Title + Rooms Left */}
//           <div>
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-semibold">{title}</h3>

//               {isBookingMode && roomsLeft > 0 && roomsLeft <= 3 && (
//                 <span className="text-sm text-red-500 font-medium">
//                   {roomsLeft} room{roomsLeft > 1 ? "s" : ""} left
//                 </span>
//               )}

//               {isBookingMode && roomsLeft === 0 && (
//                 <span className="text-sm text-gray-500 font-medium">
//                   Sold Out
//                 </span>
//               )}
//             </div>

//             <div className="flex items-center gap-2 mt-1">
//               <Badge variant="secondary" className="text-xs">
//                 {rating} ★
//               </Badge>
//               <span className="text-xs text-muted-foreground">
//                 ({reviewCount.toLocaleString()} reviews)
//               </span>
//             </div>
//           </div>

//           {/* Size / Guests / Beds */}
//           <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
//             <div className="flex items-center gap-1">
//               <Square className="h-4 w-4" />
//               <span>{size} m²</span>
//             </div>

//             <div className="flex items-center gap-1">
//               <Users className="h-4 w-4" />
//               <span>
//                 {guests} guest{guests > 1 ? "s" : ""}
//               </span>
//             </div>

//             {beds && (
//               <div className="flex items-center gap-1">
//                 <Bed className="h-4 w-4" />
//                 <span>{beds}</span>
//               </div>
//             )}
//           </div>

//           {/* Amenities */}
//           <div className="flex flex-wrap gap-2">
//             {amenities.slice(0, 4).map((amenity) => {
//               const Icon = amenityIconMap[amenity.icon];
//               return (
//                 <Badge
//                   key={amenity.name}
//                   variant="outline"
//                   className="text-xs flex items-center gap-1"
//                 >
//                   {Icon && <Icon className="h-3 w-3" />}
//                   {amenity.name}
//                 </Badge>
//               );
//             })}

//             {amenities.length > 4 && (
//               <Badge variant="outline" className="text-xs">
//                 +{amenities.length - 4} more
//               </Badge>
//             )}
//           </div>
//         </div>

//         {/* ---------------- Pricing Section ---------------- */}
//         <div className="border-l p-6 flex flex-col justify-between items-end">
//           <div className="text-right space-y-1">
//             {discountPercent > 0 && (
//               <Badge className="bg-green-600 text-white border-0">
//                 {discountPercent}% OFF
//               </Badge>
//             )}

//             {originalPrice > discountedPrice && (
//               <div className="text-sm text-muted-foreground line-through">
//                 ₹{originalPrice}
//               </div>
//             )}

//             <div className="text-2xl font-bold text-primary">
//               ₹{discountedPrice}
//             </div>

//             {!isBookingMode && (
//               <p className="text-xs text-muted-foreground">per night</p>
//             )}

//             {isBookingMode && (
//               <>
//                 <p className="text-xs text-muted-foreground">
//                   {nights} night{nights > 1 ? "s" : ""}
//                 </p>

//                 {typeof totalPrice === "number" && (
//                   <div className="text-sm font-medium">
//                     Total: ₹{totalPrice.toLocaleString()}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           <div className="w-full mt-6">
//             <Button
//               size="lg"
//               disabled={isBookingMode && roomsLeft === 0}
//               className="w-full font-semibold disabled:opacity-50"
//               onClick={handleReserve}
//             >
//               {isBookingMode && roomsLeft === 0 ? "Sold Out" : "Reserve"}
//             </Button>

//             <p className="text-[10px] text-center text-muted-foreground mt-2">
//               Includes taxes & fees
//             </p>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, Square, Bed, ChevronRight } from "lucide-react";
import { amenityIconMap } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { useHotelStore } from "@/store/hotel.store";
import { cn } from "@/lib/utils";
import { useRoutingStore } from "@/store/routing.store";
import { Sign_in_hover } from "@/components/auth/_components/sign-in-hover";
import { toast } from "sonner";
import { useSliderIfNotChooseDate } from "../_providers_context/SliderIfNotChooseDate";
export interface RoomCardProps {
  hotelId: string;
  showReserveButton?:boolean,
  id: string;
  title: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  totalPrice?: number;
  nights: number;
  rating: number;
  reviewCount: number;
  beds: string;
  guests: number;
  size: number;
  amenities: { name: string; icon: string }[];
  roomsLeft: number;
  discountPercent?: number;
  isBookingMode: boolean;
}

// export function HotelRoomCard({
//   hotelId, id, title, imageUrl, originalPrice, discountedPrice, totalPrice,
//   nights, rating, reviewCount, beds, guests, size, amenities, roomsLeft,
//   discountPercent = 0, isBookingMode,
// }: RoomCardProps) {
//   const router = useRouter();
//   const { setSelectedRoom } = useHotelStore();

//   const handleReserve = () => {
//     if (isBookingMode && roomsLeft === 0) return;
//     setSelectedRoom({
//       hotelId, roomTypeId: id, title, image: imageUrl,
//       pricePerNight: discountedPrice, totalPrice: totalPrice || discountedPrice, nights,
//     });
//     router.push(`/book/${hotelId}/${id}`);
//   };

//   return (
//     <Card className="w-full overflow-hidden border border-slate-200 bg-white hover:shadow-xl transition-all duration-300 rounded-3xl mb-6">
//       <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_220px]">

//         {/* 1. Image Section with Slider Logic (Placeholder) */}
//         <div className="relative h-60 md:h-full overflow-hidden group">
//           <img
//             src={imageUrl || "/img1.png"}
//             alt={title}
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//           />
//           {/* Discount Badge on Image */}
//           {discountPercent > 0 && (
//             <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
//               {discountPercent}% OFF
//             </div>
//           )}
//         </div>

//         {/* 2. Content Section */}
//         <div className="p-6 flex flex-col justify-between">
//           <div className="space-y-4">
//             {/* Header: Title & Availability */}
//             <div className="flex items-start justify-between">
//               <div>
//                 <h3 className="text-xl font-bold text-slate-900">{title}</h3>
//                 {isBookingMode && roomsLeft > 0 && roomsLeft <= 3 && (
//                   <p className="text-xs text-red-500 font-semibold mt-1 animate-pulse">
//                     🔥 Only {roomsLeft} room{roomsLeft > 1 ? "s" : ""} left
//                   </p>
//                 )}
//               </div>

//               {/* Rating Badge (Figma Style) */}
//               <div className="flex flex-col items-end">
//                 <div className="flex items-center gap-1.5">
//                   <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Excellent</span>
//                   <div className="bg-blue-600 text-white text-xs font-bold px-1.5 py-1 rounded-md">
//                     {rating.toFixed(1)}
//                   </div>
//                 </div>
//                 <span className="text-[10px] text-slate-400 mt-1">{reviewCount.toLocaleString()} reviews</span>
//               </div>
//             </div>

//             {/* Main Specs (Beds, Capacity, Size) */}
//             <div className="flex items-center gap-6 py-2 border-y border-slate-50">
//               <div className="flex flex-col gap-1">
//                 <div className="flex items-center gap-2 text-slate-600">
//                   <Bed size={16} />
//                   <span className="text-xs font-semibold">{beds}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-slate-600">
//                   <Users size={16} />
//                   <span className="text-xs font-semibold">{guests} Persons</span>
//                 </div>
//               </div>
//               <div className="w-[1px] h-8 bg-slate-200" />
//               <div className="flex items-center gap-2 text-slate-600">
//                 <Square size={16} />
//                 <span className="text-xs font-semibold">{size} m²</span>
//               </div>
//             </div>

//             {/* Details/Amenities (Icons only like Figma) */}
//             <div className="space-y-2">
//                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Details</p>
//                <div className="flex flex-wrap gap-x-4 gap-y-2">
//                 {amenities.slice(0, 6).map((amenity) => {
//                   const Icon = amenityIconMap[amenity.icon];
//                   return (
//                     <div key={amenity.name} className="flex items-center gap-1.5 text-slate-500">
//                       {Icon && <Icon className="h-3.5 w-3.5" />}
//                       <span className="text-[11px] font-medium">{amenity.name}</span>
//                     </div>
//                   );
//                 })}
//                </div>
//             </div>
//           </div>

//           <button className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:gap-2 transition-all mt-4">
//             More details <ChevronRight size={14} />
//           </button>
//         </div>

//         {/* 3. Pricing & CTA Section */}
//         <div className="bg-slate-50/50 p-6 flex flex-col justify-between border-l border-slate-100 items-end">
//           <div className="text-right flex flex-col h-full justify-center space-y-2">

//             {/* Price Row */}
//             <div className="space-y-0">
//                {originalPrice > discountedPrice && (
//                  <span className="text-xs text-slate-400 line-through block">₹{originalPrice}</span>
//                )}
//                <div className="flex items-baseline justify-end gap-1">
//                  <span className="text-2xl font-black text-slate-900">₹{discountedPrice}</span>
//                  <span className="text-[10px] text-slate-500 font-bold uppercase">/ night</span>
//                </div>
//             </div>

//             {/* Total Price for Booking Mode */}
//             {isBookingMode && typeof totalPrice === "number" && (
//               <div className="bg-orange-50 p-2 rounded-lg">
//                 <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wide">Total for {nights} nights</p>
//                 <p className="text-sm font-bold text-orange-700">₹{totalPrice.toLocaleString()}</p>
//               </div>
//             )}
//           </div>

//           <div className="w-full">
//             <Button
//               disabled={isBookingMode && roomsLeft === 0}
//               className={`w-full font-bold h-12 rounded-2xl transition-all shadow-md ${
//                 isBookingMode && roomsLeft === 0
//                 ? "bg-slate-200 text-slate-400"
//                 : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-100"
//               }`}
//               onClick={handleReserve}
//             >
//               {isBookingMode && roomsLeft === 0 ? "Not Available" : "Reserve"}
//             </Button>
//             <p className="text-[9px] text-center text-slate-400 mt-2 font-medium">Free cancellation available</p>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }

export function HotelRoomCard({
  hotelId,
  id,
  title,
  imageUrl,
  originalPrice,
  discountedPrice,
  totalPrice,
  nights,
  rating,
  reviewCount,
  beds,
  guests,
  size,
  amenities,
  roomsLeft,
  discountPercent = 0,
  isBookingMode,
}: RoomCardProps) {
  const router = useRouter();
  const { setSelectedRoom , date } = useHotelStore();
  const {handleClick} = useSliderIfNotChooseDate()
  const bothdate = !!date?.to && !!date?.from;

  const handleReserve = () => {
    
     const route = `/book/${hotelId}/${id}`;
    
    localStorage.setItem("nextRoute", route);
    if (isBookingMode && roomsLeft === 0) return;
    setSelectedRoom({
      hotelId,
      roomTypeId: id,
      title,
      image: imageUrl,
      pricePerNight: discountedPrice,
      totalPrice: totalPrice || discountedPrice,
      nights,
    });
    
  };
   const handleReserve_with_Alrady_Login = () => {

    if(!bothdate){
      handleClick()
     toast.message("Please select date first")
     return 
    }
    
    
    const route = `/book/${hotelId}/${id}`;
    localStorage.setItem("nextRoute", route);
    if (isBookingMode && roomsLeft === 0) return;
    setSelectedRoom({
      hotelId,
      roomTypeId: id,
      title,
      image: imageUrl,
      pricePerNight: discountedPrice,
      totalPrice: totalPrice || discountedPrice,
      nights,
    });
    const nextRoute = localStorage.getItem("nextRoute");
    router.push(nextRoute || "/");
  };
const token = localStorage.getItem("accessToken")
  return (
    <Card
      className={cn(
        "w-full overflow-hidden border border-border bg-card",
        "hover:shadow-xl transition-all duration-300 rounded-3xl mb-6",
        "dark:hover:shadow-[0_10px_25px_rgba(255,255,255,0.08)]"
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1",
          // md = tablet-ish → start 3-col, but flexible
          "md:grid-cols-[minmax(0,320px)_1fr_minmax(0,240px)]",
          // lg = desktop → a bit wider columns
          "lg:grid-cols-[minmax(0,340px)_1fr_minmax(0,260px)]",
          "min-h-[260px]"
        )}
      >
        {/* Image Section */}
        <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-full overflow-hidden flex-shrink-0">
          <img
            src={imageUrl || "/img1.png"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Content / Info Section */}
        <div className="p-5 md:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
          <div className="space-y-4 md:space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight truncate">
                  {title}
                </h3>

                {isBookingMode && roomsLeft > 0 && (
                  <p
                    className={cn(
                      "text-xs font-bold mt-1",
                      roomsLeft <= 3 ? "text-destructive" : "text-muted-foreground"
                    )}
                  >
                    {roomsLeft} rooms left
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] md:text-xs font-bold text-primary uppercase tracking-tight">
                    Excellent
                  </span>
                  <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-lg">
                    {rating.toFixed(1)}
                  </div>
                </div>

                <span className="text-[10px] text-muted-foreground mt-1 whitespace-nowrap">
                  {reviewCount.toLocaleString()} reviews
                </span>
              </div>
            </div>

            {/* Facilities row */}
            <div className="flex items-center gap-5 md:gap-6 py-3 border-y border-border">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-foreground">
                  <Bed size={16} className="text-muted-foreground" />
                  <span className="text-xs font-bold">{beds}</span>
                </div>

                <div className="flex items-center gap-2 text-foreground">
                  <Users size={16} className="text-muted-foreground" />
                  <span className="text-xs font-bold">{guests} Persons</span>
                </div>
              </div>

              <div className="w-[1px] h-10 bg-border hidden sm:block" />

              <div className="flex items-center gap-2 text-foreground">
                <Square size={16} className="text-muted-foreground" />
                <span className="text-xs font-bold">{size} m²</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2 text-muted-foreground">
              {amenities.slice(0, 6).map((amenity) => {
                const Icon = amenityIconMap[amenity.icon];
                return (
                  <div
                    key={amenity.name}
                    className="flex items-center gap-2 text-[11px] md:text-xs font-medium truncate"
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <span className="truncate">{amenity.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="bg-muted/30 p-5 md:p-6 flex flex-col justify-between items-end flex-shrink-0">
          <div className="text-right space-y-3 flex flex-col justify-center h-full">
            {originalPrice && originalPrice > discountedPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}

            <div className="flex items-baseline justify-end gap-1">
              <span className="text-3xl md:text-4xl font-black text-foreground">
                ₹{discountedPrice.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground font-bold uppercase">
                / night
              </span>
            </div>

            {isBookingMode && typeof totalPrice === "number" && (
              <div className="text-right">
                <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  Total Price
                </p>
                <p className="text-lg md:text-xl font-bold text-foreground">
                  ₹{totalPrice.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          
            <div className="w-full mt-5 md:mt-6">
              {!token ? (
                // your Sign_in_hover wrapper
                <Sign_in_hover
                  tag="Log-in"
                  variant="ghost"
                  forLike={{
                    content: (
                      <Button
                        disabled={isBookingMode && roomsLeft === 0}
                        className={cn(
                          "w-full font-bold h-11 md:h-12 rounded-2xl transition-all shadow-md",
                          isBookingMode && roomsLeft === 0
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        )}
                        onClick={handleReserve}
                      >
                        {isBookingMode && roomsLeft === 0 ? "Not Available" : "Reserve"}
                      </Button>
                    ),
                    id: `reserve-button-${id}`,
                  }}
                />
              ) : (
                <Button
                  disabled={isBookingMode && roomsLeft === 0}
                  className={cn(
                    "w-full font-bold h-11 md:h-12 rounded-2xl transition-all shadow-md",
                    isBookingMode && roomsLeft === 0
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  )}
                  onClick={handleReserve_with_Alrady_Login}
                >
                  {isBookingMode && roomsLeft === 0 ? "Not Available" : "Reserve"}
                </Button>
              )}

              <p className="text-[10px] text-center text-muted-foreground mt-2.5 font-medium">
                Free cancellation available
              </p>
            </div>
          
        </div>
      </div>
    </Card>
  );
}
