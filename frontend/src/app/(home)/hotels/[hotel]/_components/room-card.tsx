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
  Square,
  Bed,
} from "lucide-react";
import { amenityIconMap } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { useHotelStore } from "@/store/hotel.store";

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

export function HotelRoomCard({
  title = "Superior Twin Room",
  imageUrl,
  id,
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
  const router = useRouter();
  const { setHotel } = useHotelStore();

  const handleReserve = () => {
    setHotel({
      id: id,
      image: imageUrl,
      name: title,
      rating: rating,
      price: discountedPrice,
      reviewCount: reviewCount,
      totalPrice: totalPrice,
    });
    router.push(`/book/${id}`);
  };

  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden border-border bg-card hover:shadow-md transition-shadow">
      <div className="w-full md:w-[300px] lg:w-[340px] shrink-0 h-48 md:h-auto relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-r-lg"
        />
        {roomsLeft <= 3 && (
          <Badge className="absolute top-0 left-0 bg-red-400 hover:bg-red-600 text-white border-0 shadow-sm rounded-sm">
            Only {roomsLeft} room{roomsLeft > 1 ? "s" : ""} left!
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex-1 p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl leading-tight text-foreground">{title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {rating} ★
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ({reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-foreground/80">
            <div className="flex items-center gap-1.5">
              <Square className="h-4 w-4 text-muted-foreground" />
              <span>{size} m²</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{guests} guest{guests > 1 ? "s" : ""}</span>
            </div>
            {(beds > 0 || dubleBeds > 0) && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span>
                  {[
                    beds > 0 ? `${beds} Single` : null,
                    dubleBeds > 0 ? `${dubleBeds} Double` : null
                  ].filter(Boolean).join(" & ")} Bed{beds + dubleBeds > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            {amenities.slice(0, 5).map((amenity) => {
              const Icon = amenityIconMap[amenity.icon];
              return (
                <Badge
                  key={amenity.name}
                  variant="outline"
                  className="px-2 py-1 h-auto font-normal text-muted-foreground bg-muted/30 gap-1.5"
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {amenity.name}
                </Badge>
              );
            })}
            {amenities.length > 5 && (
              <Badge variant="outline" className="px-2 py-1 h-auto font-normal text-muted-foreground bg-muted/30">
                +{amenities.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        <div className="hidden md:block w-px bg-border my-4" />

        <div className="p-5 md:w-[240px] shrink-0 flex flex-col justify-between items-end bg-muted/10">
          <div className="text-right space-y-1">
            {discountPercent && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">
                {discountPercent}% OFF
              </Badge>
            )}
            <div className="mt-2">
              <span className="text-muted-foreground text-sm line-through decoration-muted-foreground/50">
                ${originalPrice}
              </span>
              <div className="text-2xl font-bold text-primary">
                ${discountedPrice}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              for {nights} night{nights > 1 ? "s" : ""}
            </p>
            <div className="text-sm font-medium mt-1 text-foreground/80">
              Total: ${totalPrice.toLocaleString()}
            </div>
          </div>

          <div className="w-full mt-4">
            <Button
              size="lg"
              className="w-full font-semibold shadow-sm"
              onClick={handleReserve}
            >
              Reserve
            </Button>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              Includes taxes & fees
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
