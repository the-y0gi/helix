"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp } from "lucide-react"
import RattingBadge from "@/app/(home)/hotels/[hotel]/_components/badge"

interface ReviewCardProps {
    review: Review
}
import { Separator } from "@/components/ui/separator"
import { IconFileSmile } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

import React from "react"
type ReviewStatus = "posted" | "rejected" | "pending"

interface Review {
    id: string
    hotelName: string
    image: string
    date: string
    rating: number
    status: ReviewStatus
    title: string
    comment: string
    helpfulCount?: number
    propertyResponse?: string
}


const reviews: Review[] = [
    // {
    //     id: "1",
    //     hotelName: "Via Golden Tulip Hotel",
    //     image: "/room2.png",
    //     date: "24 Oct 2024",
    //     rating: 3.0,
    //     status: "posted",
    //     title: "Poor",
    //     comment:
    //         "It doesn’t have any daily cleaning or towel changing. It doesn’t have any liquid soap; it was empty.",
    //     helpfulCount: 2,
    //     propertyResponse:
    //         "Thank you for your feedback. Our property is a short-let house, not a hotel...",
    // },
    // {
    //     id: "2",
    //     hotelName: "Via Forest Whisper Cabin",
    //     image: "/room1.png",
    //     date: "24 Jul 2023",
    //     rating: 3.0,
    //     status: "rejected",
    //     title: "Poor",
    //     comment: "Nothing was good. It was my worst experience.",
    // },
    // {
    //     id: "3",
    //     hotelName: "Via Golden Tulip Hotel",
    //     image: "/room3.png",
    //     date: "24 Jul 2023",
    //     rating: 7.0,
    //     status: "pending",
    //     title: "Good",
    //     comment: "The location was good. Overall decent stay.",
    //     helpfulCount: 77,
    // },
]

export function ReviewList() {
    if (reviews.length === 0) {
        return (
            <Noreviews />
        )
    }
    return (
        <div className="space-y-6 ">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    )
}
const Noreviews = () => {
    const navigate = useRouter()
    return (


        <div className="flex flex-col items-center justify-center text-center py-20 px-6  rounded-xl bg-background shadow-sm">

            <div className="relative w-44 h-44 rounded-md overflow-hidden">
                <Image
                    src={'/no_r.png'}
                    alt={"no reviews"}
                    fill
                    className="object-contain"
                />
            </div>

            <h2 className="text-xl font-semibold mb-2">
                You haven’t reviewed any stays yet
            </h2>

            <p className="text-muted-foreground max-w-md mb-6">
                After you complete a stay, you will be invited to leave a review here.
            </p>

            <Button variant="outline" onClick={() => navigate.push('/hotels')}>
                Explore stays
            </Button>
        </div>



    )
}

export function ReviewCard({ review }: ReviewCardProps) {
    const statusStyles = {
        posted: "bg-green-100 text-green-700 border-green-300",
        rejected: "bg-red-100 text-red-700 border-red-300",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    }

    return (
        <Card className="rounded-xl bg-background shadow-sm p-0">
            <CardContent className="p-3 space-y-2">
                <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                        <Image
                            src={review.image}
                            alt={review.hotelName}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Badge
                                    variant="outline"
                                    className={statusStyles[review.status]}
                                >
                                    {review.status === "posted" && "Review posted"}
                                    {review.status === "rejected" && "Review rejected"}
                                    {review.status === "pending" && "Review pending"}
                                </Badge>

                                <p className="text-sm">
                                    You reviewed{" "}
                                    <span className="text-blue-600 underline cursor-pointer">
                                        {review.hotelName}
                                    </span>
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    {review.date}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">
                                {review.rating.toFixed(1)}
                            </Badge> */}
                            <RattingBadge rating={review.rating} variant="right" className="w-7 h-7" />
                            <span className="text-sm font-medium">
                                {review.title}
                            </span>
                        </div>

                        <p className="text-sm text-muted-foreground flex gap-5">
                            <IconFileSmile /> {review.comment}
                        </p>
                        <Separator />

                        {review.helpfulCount !== undefined && (

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">

                                <ThumbsUp size={14} />
                                {review.helpfulCount} people found this review helpful
                            </div>
                        )}

                        {review.propertyResponse && (
                            <div className="rounded-lg bg-muted p-4 text-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="relative h-5 w-5">
                                        <Image
                                            src="/review_chat.png"
                                            alt="review icon"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <p className="font-medium">Property response</p>
                                </div>
                                <p className="text-muted-foreground">
                                    {review.propertyResponse}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
