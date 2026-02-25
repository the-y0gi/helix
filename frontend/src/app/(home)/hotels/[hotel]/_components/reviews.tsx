import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hotel } from "@/types";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import RattingBadge from "./badge";

type Props = {
    hotel: Hotel;
};

const ReviewsMain = ({ hotel }: Props) => {
    const { data: reviews } = useGetHotelReviews(hotel._id)
    
    return (
        <Card className="w-full bg-transparent border-none shadow-none">
            <CardHeader className="space-y-2">
                <h3 className="text-2xl font-bold">Reviews</h3>
                <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
                        5.0
                    </Badge>
                    <span className="font-medium">Excellent</span>
                    <span className="text-muted-foreground">1,260 reviews</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-8">
                <ReviewsRanges />
                <ReviewsComments />




            </CardContent>
        </Card>
    );
};
import { useState } from "react";
import { useGetHotelReviews } from "@/services/hotel/querys";

const ReviewsComments = () => {
    const comments = [
        {
            name: "July Kaly",
            date: "12 Mar 2025",
            review:
                "The truth of the stay with Simo was very comfortable, he welcomed us but we did not see him again the rest of the days. The apartment was...",
        },
        {
            name: "John Wick",
            date: "12 Mar 2025",
            review:
                "Léonor is very responsive, and the accommodation perfectly matches our expectations. Highly recommended",
        },
        {
            name: "Jack Fure",
            date: "12 Mar 2025",
            review:
                "Simo is very attentive and kind, the apartment was nice, the bed comfortable and you were slightly close to a metro station.",
        },
        {
            name: "July Kaly",
            date: "12 Mar 2025",
            review:
                "The truth of the stay with Simo was very comfortable, he welcomed us but we did not see him again the rest of the days. The apartment was...",
        },
        {
            name: "John Wick",
            date: "12 Mar 2025",
            review:
                "Léonor is very responsive, and the accommodation perfectly matches our expectations. Highly recommended",
        },
        {
            name: "Jack Fure",
            date: "12 Mar 2025",
            review:
                "Simo is very attentive and kind, the apartment was nice, the bed comfortable and you were slightly close to a metro station.",
        },
    ];

    const INITIAL_COUNT = 3;
    const LOAD_MORE_COUNT = 1;

    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
    };

    const visibleComments = comments.slice(0, visibleCount);

    return (
        <div className="space-y-8">
            {visibleCount < comments.length && (
                <div className="flex justify-start">
                    <Button variant="outline" className="rounded-full" onClick={handleShowMore}>
                        Show All 100 Reviews
                    </Button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {visibleComments.map((comment, index) => (
                    <ReviewCard
                        key={index}
                        name={comment.name}
                        date={comment.date}
                        review={comment.review}
                    />
                ))}
            </div>


        </div>
    );
};

export default ReviewsMain;
export const ReviewsRanges = () => {
    const categories = [
        "Amenities",
        "Cleanliness",
        "Communication",
        "Location",
        "Value",
    ];

    return (
        <div className="flex items-start gap-10 md:flex-row flex-col">
            <div className="w-[220px]">
                <h4 className="font-semibold mb-4">Overall Rating</h4>

                {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3 mb-2">
                        <span className="text-sm w-4">{star}</span>
                        <Progress
                            value={star === 5 ? 100 : 0}
                            className="h-2 flex-1 "
                        />
                    </div>
                ))}
            </div>

            <Separator orientation="vertical" className="h-28 md:block hidden" />

            <div className="flex items-center divide-x flex-wrap">
                {categories.map((item) => (
                    <div
                        key={item}
                        className="px-8 flex flex-col items-center justify-center"
                    >
                        <div className="bg-muted rounded-full px-4 py-2 text-sm font-medium">
                            {item}
                        </div>
                        <span className="mt-2 text-sm font-semibold">5.0</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
type ReviewCardProps = {
    name: string;
    date: string;
    review: string;
};

const ReviewCard = ({ name, date, review }: ReviewCardProps) => {
    return (
        <Card className="rounded-2xl  border border-border items-start flex flex-col gap-2">
            <CardContent className="px-3 py-2 ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src="/girl.png" />
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{name}</p>
                            <p className="text-xs text-muted-foreground">{date}</p>
                        </div>
                    </div>

                    <RattingBadge rating={5} variant="left" className="w-7 h-7 " />
                </div>

                <p className="text-sm text-muted-foreground">{review}</p>

                <button className="text-sm text-muted-foreground hover:underline">
                    Show More
                </button>
            </CardContent>
        </Card>
    );
};
