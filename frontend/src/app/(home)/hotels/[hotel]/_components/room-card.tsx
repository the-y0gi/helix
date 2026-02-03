import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  BedDouble,
  Users,
  Wifi,
  Utensils,
  Square,
  Wind,
  Ban,
  type LucideIcon,
  Bed,
} from "lucide-react";

export interface RoomCardProps {
  id: string;
  title: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  totalPrice: number;
  nights: number;
  rating: number;
  reviewCount: number;
  beds: number;
  dubleBeds: number;
  guests: number;
  size: number;
  amenities: {
    name: string;
    icon: string;
  }[];
  roomsLeft: number;
  discountPercent?: number;
}
import { amenityIconMap } from "@/components/ui/icons";
export function HotelRoomCard({
  title = "Superior Twin Room",
  imageUrl,
  originalPrice = 350,
  discountedPrice = 290,
  totalPrice = 1450,
  nights = 5,
  rating = 5.0,
  reviewCount = 1260,
  beds,
  dubleBeds,
  guests = 2,
  size = 30,
  amenities,
  roomsLeft = 2,
  discountPercent = 10,
}: RoomCardProps) {
  return (
    <Card className="w-full flex flex-row h-[240px] gap-2 py-2 justify-between">
      <div className="md:h-full md:w-1/3 px-2">
        <div className="h-full  w-full flex justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full rounded-2xl"
          />
        </div>
      </div>

      <div className="flex md:flex-col gap-1">
        <CardHeader className="pb-3 pt-4 flex gap-4 ">
          <div className="flex justify-between items-start gap-3">
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          </div>
          <div className=" top-3 left-3 flex flex-col gap-2">
            {roomsLeft <= 3 && (
              <Badge className="font-semibold text-red-300 bg-transparent">
                Only {roomsLeft} room{roomsLeft > 1 ? "s" : ""} left!
              </Badge>
            )}
          </div>

          <div className=" top-3 right-3">
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm text-black font-medium px-2.5 py-1 flex items-center gap-1"
            >
              <span className="text-green-600 font-bold">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                · {reviewCount.toLocaleString()} reviews
              </span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-4 space-y-3 text-sm">
          {/* Icons row */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
            <div className="flex items-center flex-col gap-1.5">
              <Bed className="h-4 w-4" />
              <span>{beds} single bed</span>
            </div>
            <div className="flex items-center flex-col gap-1.5">
              <BedDouble className="h-4 w-4" />
              <span>{dubleBeds} double bed</span>
            </div>
            <div className="flex items-center flex-col gap-1.5">
              <Users className="h-4 w-4" />
              <span>{guests} persons</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="w-full flex flex-col gap-2">
            <p>Details</p>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => {
                const Icon = amenityIconMap[amenity.icon];
                return (
                  <div
                    key={amenity.name}
                    className="inline-flex items-center gap-1.5 text-xs bg-muted/60 px-2.5 py-1 rounded-full border border-zinc-400"
                  >
                    {Icon && <Icon className="h-3 w-3" />}
                    <span>{amenity.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="h-4 w-4" />
            <span>{size} m²</span>
          </div>
        </CardContent>
      </div>
      <div className="h-full w-px bg-zinc-300" />

      <CardFooter className="pt-1   flex flex-col gap-5 justify-end items-end ">
        {discountPercent && (
          <Badge className="bg-green-400 hover:bg-green-600 text-white">
            {discountPercent}% off
          </Badge>
        )}
        <div className="text-right shrink-0">
          {discountedPrice ? (
            <>
              <p className="text-xs text-muted-foreground line-through">
                ${originalPrice}
              </p>
              <p className="text-2xl font-bold text-primary leading-none">
                ${discountedPrice}
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold text-primary">${originalPrice}</p>
          )}
          <span className="text-muted-foreground text-xs">
            {" "}
            × {nights} night{nights > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm">
            <span className="font-medium">Total: </span>
            <span className="font-bold">${totalPrice}</span>
          </div>

          <Button size="lg" className="font-semibold px-8">
            Reserve
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
