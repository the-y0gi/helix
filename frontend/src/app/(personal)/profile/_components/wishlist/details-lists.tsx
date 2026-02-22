"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {  useGetMyTrips } from "@/services/hotel/querys"
import { LikeIcon } from "@/services/dailyfunctions"
export type labelType = "favourites" | "wishlists"
export function SavedTripsSection({ setDetails , label }: {label:labelType,
    setDetails: React.Dispatch<React.SetStateAction<{ open: boolean; id: string; label:labelType}>>
}) {
    // const {data:myTripdata_useGetMyTrips} = useGetMyTrips()
    //   console.log("myTripdata_useGetMyTrips",myTripdata_useGetMyTrips)
    const querys = {
            favourites: useGetMyTrips(),
            wishlists: useGetMyTrips()
        }
        const {data} = querys[label as keyof typeof querys]
        const alldata = data?.data
    return (
        <div className="rounded-xl  bg-background p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My next trip</h2>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Share2 size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDetails({ open: false, id: "" ,label:"favourites" })}>
                        Back
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">

                {
                    alldata?.map((val :SavedPropertyCardProps)=>{

                        return (
                             <SavedPropertyCard
                                name={val.name}
                                title={val.name}
                                thumbnail={val.thumbnail}
                                location={val.location}
                                city={val.city}
                                _id={val._id}
                                isMyFavourite={val.isMyFavourite}
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
    name:string
    title: string
     _id:string
    thumbnail: string
    location: string
    distance: string
    city:string
    isMyFavourite:boolean
    numReviews:number
    rating:number
}

export function SavedPropertyCard({
    title,
    thumbnail,
    location,
    distance,
    city,
    isMyFavourite,
    numReviews,
    rating,
    _id
}: SavedPropertyCardProps) {
    return (
        <Card className="rounded-xl min-w-[150px] overflow-hidden shadow-sm transition bg-background pt-0">
            <div className="relative h-56 w-full">
                <Image
                    src={thumbnail || "/room1.png"}
                    alt={title}
                    fill
                    className="object-cover"
                />
                <LikeIcon _id={_id} name={title} isFavourite={isMyFavourite}/>

                {/* <button className="absolute top-3 right-3 bg-card rounded-full p-2 shadow-sm">
                    <Heart size={16} className="text-red-500 fill-red-500" />
                </button> */}
            </div>

            <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-blue-600 text-white px-2 py-0.5 text-xs">
                        {rating}
                    </Badge>
                    <span className="text-blue-600 font-medium text-xs">
                        Excellent
                    </span>
                    <span className="text-muted-foreground text-xs">
                        {numReviews} reviews
                    </span>
                </div>

                <h3 className="font-semibold text-sm">{title}</h3>

                <p className="text-blue-600 text-sm">{location} {city}</p>

                <p className="text-muted-foreground text-xs">{distance}</p>

                <Input placeholder="Add note" className="h-9" />
            </CardContent>
        </Card>
    )
}
