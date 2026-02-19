"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart } from "lucide-react"
import { IconCross, IconStackBackward } from "@tabler/icons-react"
export function SavedTripsSection({ setDetails }: {
    setDetails: React.Dispatch<React.SetStateAction<{ open: boolean; id: string; }>>
}) {
    return (
        <div className="rounded-xl  bg-background p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My next trip</h2>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Share2 size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDetails({ open: false, id: "" })}>
                        Back
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <SavedPropertyCard
                    title="Blue Horizon Villa"
                    image="/room1.png"
                    location="Amalfi Coast, Italy"
                    distance="3 km from down town"
                />

                <SavedPropertyCard
                    title="Forest Whisper Cabin"
                    image="/room1.png"
                    location="Amalfi Coast, Italy"
                    distance="3 km from down town"
                />

                <SavedPropertyCard
                    title="Seaside Serenity Villa"
                    image="/room1.png"
                    location="Amalfi Coast, Italy"
                    distance="3 km from down town"
                />
            </div>
        </div>
    )
}


interface SavedPropertyCardProps {
    title: string
    image: string
    location: string
    distance: string
}

export function SavedPropertyCard({
    title,
    image,
    location,
    distance,
}: SavedPropertyCardProps) {
    return (
        <Card className="rounded-xl overflow-hidden shadow-sm transition bg-background pt-0">
            <div className="relative h-56 w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />

                <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm">
                    <Heart size={16} className="text-red-500 fill-red-500" />
                </button>
            </div>

            <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-blue-600 text-white px-2 py-0.5 text-xs">
                        5.0
                    </Badge>
                    <span className="text-blue-600 font-medium text-xs">
                        Excellent
                    </span>
                    <span className="text-muted-foreground text-xs">
                        160 reviews
                    </span>
                </div>

                <h3 className="font-semibold text-sm">{title}</h3>

                <p className="text-blue-600 text-sm">{location}</p>

                <p className="text-muted-foreground text-xs">{distance}</p>

                <Input placeholder="Add note" className="h-9" />
            </CardContent>
        </Card>
    )
}
