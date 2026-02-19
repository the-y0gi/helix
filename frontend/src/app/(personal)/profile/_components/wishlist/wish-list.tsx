"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
export interface WishListCardProps {
    id: string
    title: string
    savedCount: number
    images: string[]
    large?: boolean
    onCheckDetails?: () => void
}
export const wishlistData: WishListCardProps[] = [
    {
        id: "1",
        title: "My next trip",
        savedCount: 6,
        images: [
            "/room1.png",
            "/room2.png",
            "/room3.png",
            "/img4.png",
        ],
    },
    {
        id: "2",
        title: "Falkensee, Germany 2025",
        savedCount: 2,
        images: ["/img4.png"],
        large: true,
    },
    {
        id: "3",
        title: "Prague, Czechia 2025",
        savedCount: 1,
        images: ["/img4.png"],
        large: true,
    },
];

export function WishlistSection() {

    const [wishListOpen, setWishListOpen] = React.useState({
        open: false,
        id: ""
    })

    if (wishListOpen.open) {
        return <SavedTripsSection setDetails={setWishListOpen} />
    }
    return (
        <div className="rounded-xl  shadow-sm p-8 space-y-8 bg-background pb-50">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Wish Lists</h2>
                    <p className="text-sm text-muted-foreground">
                        Explore and save your favorite destinations here.
                    </p>
                </div>

                <Button variant="outline" className="gap-2" >
                    <Plus size={16} />
                    Create a list
                </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {
                    wishlistData.map((val, i) => {
                        return (
                            <WishlistCard
                                key={val.id}
                                id={val.id}
                                title={val.title}
                                savedCount={val.savedCount}
                                images={val.images}
                                large={val.large}
                                onCheckDetails={() => setWishListOpen({ id: val.id, open: true })}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}
import Image from "next/image"
import { Card } from "@/components/ui/card"
import React from "react"
import { SavedTripsSection } from "./details-lists"


export function WishlistCard({
    title,
    savedCount,
    images,
    large = false,
    onCheckDetails

}: WishListCardProps) {
    return (
        <Card className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition bg-background" onClick={onCheckDetails} >
            <div className="p-3 space-y-4">
                {/* Image Section */}
                {large ? (
                    <div className="relative w-full h-60 rounded-lg overflow-hidden">
                        <Image
                            src={images[0]}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {images.slice(0, 4).map((img, index) => (
                            <div
                                key={index}
                                className="relative h-28 rounded-lg overflow-hidden"
                            >
                                <Image
                                    src={img}
                                    alt={`${title}-${index}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Text */}
                <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="text-sm text-muted-foreground">
                        {savedCount} Saved
                    </p>
                </div>
            </div>
        </Card>
    )
}
