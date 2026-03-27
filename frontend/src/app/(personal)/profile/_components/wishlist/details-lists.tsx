"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LikeIcon } from "@/services/dailyfunctions"
import { PageSkeleton } from "@/components/loader/skeleton"
import { useGetMyTrips } from "@/services/personal/queryes"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { RouterPush } from "@/components/RouterPush"
export type labelType = "favourites" | "wishlists"
export function SavedTripsSection({ setDetails, label }: {
    label: labelType,
    setDetails: React.Dispatch<React.SetStateAction<{ open: boolean; id: string; label: labelType }>>
}) {
    // const {data:myTripdata_useGetMyTrips} = useGetMyTrips()
    //   console.log("myTripdata_useGetMyTrips",myTripdata_useGetMyTrips)
    const querys = {
        favourites: useGetMyTrips(),
        wishlists: useGetMyTrips()
    }
    const { data, isLoading } = querys[label as keyof typeof querys]
    const alldata = data?.data
    return (
        <div className="rounded-xl  bg-background md:p-8 p-0 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold px-2">My next trip</h2>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Share2 size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDetails({ open: false, id: "", label: "favourites" })}>
                        Back
                    </Button>
                </div>
            </div>

            <div className="grid md:gap-6 grid-cols-2 lg:grid-cols-3">


                {isLoading ? [...Array(6)].map((_, i) => {
                    return (
                        <PageSkeleton key={i} />
                    )
                }) :
                    alldata?.map((val: SavedPropertyCardProps) => {

                        return (
                            <SavedPropertyCard
                                name={val.name}
                                title={val.name}
                                thumbnail={val.thumbnail}
                                location={val.location}
                                city={val.city}
                                _id={val._id}
                                isFavorite={val.isFavorite}
                                numReviews={val.numReviews}
                                rating={val.rating}
                                distance="23"
                                key={val._id}
                            />
                        )
                    })
                }



            </div>
        </div>
    )
}


interface SavedPropertyCardProps {
    name: string
    title: string
    _id: string
    thumbnail: string
    location: string
    distance: string
    city: string
    isFavorite: boolean
    numReviews: number
    rating: number
}

export function SavedPropertyCard({
    title,
    thumbnail,
    location,
    distance,
    city,
    isFavorite,
    numReviews,
    rating,
    _id
}: SavedPropertyCardProps) {
    const router = useRouter()
    return (
        <Card className="group relative rounded-none md:rounded-xl min-w-[150px] overflow-hidden shadow-sm transition bg-background border-none py-0">
            {/* Image Container - Height stays fixed or aspect-ratio */}
            <div className="relative h-64 md:h-56 w-full">
                <Image
                    src={thumbnail || "/room1.png"}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Mobile Overlay Gradient: Only visible on small screens */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden" />

                {/* Favorite Icon */}
                <LikeIcon
                    _id={_id}
                    isFavourite={isFavorite || false}
                    name="card"
                    className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center z-10"
                />
            </div>

            {/* Content Container */}
            {/* MD: Relative (standard card) | SM: Absolute (overlay) */}
            <CardContent className={cn(
                "p-3 md:p-4 md:space-y-3 space-y-1",
                "absolute bottom-0 left-0 w-full md:relative md:bg-transparent", // Mobile overlay logic
                "text-white md:text-foreground" // Switch text color based on background
            )}>

                {/* Review/Rating Row */}
                <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white border-none px-1.5 py-0 text-[10px] md:text-xs">
                        {rating}
                    </Badge>
                    <span className="text-blue-400 md:text-blue-600 font-medium text-[10px] md:text-xs">
                        Excellent
                    </span>
                    <span className="text-zinc-300 md:text-muted-foreground text-[10px] md:text-xs">
                        {numReviews}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-sm md:text-base leading-tight truncate" onClick={() => {
                    RouterPush(router, `/hotels/${_id}`);
                }}>
                    {title}
                </h3>

                {/* Location & Note - Hidden or smaller on mobile to keep it clean */}
                <div className="space-y-1">
                    <p className="text-zinc-200 md:text-blue-600 text-xs">
                        {city}
                    </p>
                    {/* Hide distance and input on mobile overlay to prevent clutter, similar to Reels */}
                    <p className="hidden md:block text-muted-foreground text-xs">
                        {distance}
                    </p>
                    <Input
                        placeholder="Add note"
                        className="hidden md:flex h-8 bg-secondary/50 border-none text-xs"
                    />
                </div>
            </CardContent>
        </Card>
    )
}