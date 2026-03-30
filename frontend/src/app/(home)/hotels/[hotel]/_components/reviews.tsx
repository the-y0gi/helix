// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Hotel } from "@/types";
// import React from "react";
// import { Progress } from "@/components/ui/progress";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import RattingBadge from "./badge";

// type Props = {
//     hotel: Hotel;
// };

// const ReviewsMain = ({ hotel }: Props) => {
//     const { data: reviews } = useGetHotelReviews(hotel._id)



//     return (
//         <Card className="w-full bg-transparent border-none shadow-none p-0">
//             <CardHeader className="space-y-2">
//                 <h3 className="text-2xl font-bold">Reviews</h3>
//                 <div className="flex items-center gap-2 text-sm">
//                     <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
//                         5.0
//                     </Badge>
//                     <span className="font-medium">Excellent</span>
//                     <span className="text-muted-foreground">1,260 reviews</span>
//                 </div>
//             </CardHeader>

//             <CardContent className="space-y-8">
//                 <ReviewsRanges />
//                 <ReviewsComments />




//             </CardContent>
//         </Card>
//     );
// };
// import { useState } from "react";
// import { useGetHotelReviews } from "@/services/hotel/querys";
// import { useGetReviewsQuery } from "@/services/personal/queryes";



// export default ReviewsMain;
// export const ReviewsRanges = () => {
//     const categories = [
//         "Amenities",
//         "Cleanliness",
//         "Communication",
//         "Location",
//         "Value",
//     ];

//     return (
//         <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-10 w-full">

//             {/* 1. Overall Rating Section: Full width on mobile, fixed width on desktop */}
//             <div className="w-full lg:w-[220px] shrink-0">
//                 <h4 className="font-semibold mb-4 text-center lg:text-left text-sm md:text-base">
//                     Overall Rating
//                 </h4>

//                 <div className="space-y-2">
//                     {[5, 4, 3, 2, 1].map((star) => (
//                         <div key={star} className="flex items-center gap-3">
//                             <span className="text-xs md:text-sm font-medium w-3">{star}</span>
//                             <Progress
//                                 value={star === 5 ? 100 : 0}
//                                 className="h-1.5 md:h-2 flex-1"
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Separator: Hidden on mobile, vertical on desktop */}
//             <Separator orientation="vertical" className="h-32 hidden lg:block" />
//             <Separator orientation="horizontal" className="w-full lg:hidden opacity-50" />

//             {/* 2. Categories Section: Horizontal scroll on mobile, wrap on desktop */}
//             <div className="w-full overflow-x-auto no-scrollbar ">
//                 <div className="flex lg:flex-wrap items-center md:gap-4 gap-1 lg:gap-0 lg:divide-x divide-border pb-2 lg:pb-0 ">
//                     {categories.map((item) => (
//                         <div
//                             key={item}
//                             className="flex flex-col items-center justify-center px-2 md:px-4 lg:px-8 shrink-0 lg:shrink"
//                         >
//                             {/* Smaller pill on mobile */}
//                             <div className="bg-muted rounded-full px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm font-medium whitespace-nowrap">
//                                 {item}
//                             </div>
//                             <span className="mt-1 md:mt-2 text-xs md:text-sm font-bold">5.0</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };
// type ReviewCardProps = {
//     name: string;
//     date: string;
//     review: string;
// };
// const ReviewsComments = () => {
//     // const {data} = useGetReviewsQuery();
//     const comments = [
//         {
//             name: "July Kaly",
//             date: "12 Mar 2025",
//             review:
//                 "The truth of the stay with Simo was very comfortable, he welcomed us but we did not see him again the rest of the days. The apartment was...",
//         },
//         {
//             name: "John Wick",
//             date: "12 Mar 2025",
//             review:
//                 "Léonor is very responsive, and the accommodation perfectly matches our expectations. Highly recommended",
//         },
//         {
//             name: "Jack Fure",
//             date: "12 Mar 2025",
//             review:
//                 "Simo is very attentive and kind, the apartment was nice, the bed comfortable and you were slightly close to a metro station.",
//         },
//         {
//             name: "July Kaly",
//             date: "12 Mar 2025",
//             review:
//                 "The truth of the stay with Simo was very comfortable, he welcomed us but we did not see him again the rest of the days. The apartment was...",
//         },
//         {
//             name: "John Wick",
//             date: "12 Mar 2025",
//             review:
//                 "Léonor is very responsive, and the accommodation perfectly matches our expectations. Highly recommended",
//         },
//         {
//             name: "Jack Fure",
//             date: "12 Mar 2025",
//             review:
//                 "Simo is very attentive and kind, the apartment was nice, the bed comfortable and you were slightly close to a metro station.",
//         },
//     ];
//     const ismobile = useIsMobile()
//     const INITIAL_COUNT = 3;
//     const LOAD_MORE_COUNT = 1;

//     const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

//     const handleShowMore = () => {
//         setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
//     };

//     const visibleComments = comments.slice(0, visibleCount);

//     return (
//         <div className="space-y-8">

//             <div className="flex  gap-6 overflow-x-auto no-scrollbar -mx-14  md:mx-0">
//                 <div className="w-17 h-full" />
//                 {visibleComments.map((comment, index) => (
//                     <ReviewCard
//                         key={index}
//                         name={comment.name}
//                         date={comment.date}
//                         review={comment.review}
//                     />
//                 ))}
//                 <div className="w-17 h-full" />
//             </div>
//             {!ismobile && visibleCount < comments.length && (
//                 <div className="flex justify-start">
//                     {<Button variant="outline" className="rounded-full" onClick={handleShowMore}>
//                         Show All 100 Reviews
//                     </Button>}
//                 </div>
//             )}
//             {
//                 ismobile && <MoreReviewsSideSheet visibleComments={visibleComments} trigger={<Button variant="outline" className="rounded-full" onClick={handleShowMore}>
//                     Show All 100 Reviews
//                 </Button>} />
//             }


//         </div>
//     );
// };
// const ReviewCard = ({ name, date, review }: ReviewCardProps) => {
//     return (
//         <Card className="rounded-2xl  border border-border items-start flex flex-col gap-2 p-1 min-w-[250px]">
//             <CardContent className="px-3 py-2 gap-2 ">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <Avatar className="w-10 h-10">
//                             <AvatarImage src="/girl.png" />
//                             <AvatarFallback>{name.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                             <p className="font-medium">{name}</p>
//                             <p className="text-xs text-muted-foreground">{date}</p>
//                         </div>
//                     </div>

//                     <RattingBadge rating={5} variant="left" className="w-7 h-7 " />
//                 </div>

//                 <p className="text-sm text-muted-foreground">{review}</p>

//                 {/* <button className="text-sm text-muted-foreground hover:underline">
//                     Show More
//                 </button> */}
//             </CardContent>
//         </Card>
//     );
// };
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//     Sheet,
//     SheetClose,
//     SheetContent,
//     SheetDescription,
//     SheetFooter,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from "@/components/ui/sheet"
// import { useIsMobile } from "@/hooks/use-mobile";

// export function MoreReviewsSideSheet({ visibleComments, trigger }: { visibleComments: ReviewCardProps[], trigger: React.ReactNode }) {
//     return (
//         <Sheet>
//             <SheetTrigger asChild>
//                 {trigger}
//             </SheetTrigger>
//             <SheetContent className="w-full" side="right">
//                 <SheetHeader>
//                     <SheetTitle>Reviews</SheetTitle>
//                     <SheetDescription>
//                         All Reviews
//                     </SheetDescription>
//                 </SheetHeader>
//                 <div className="flex flex-wrap gap-2 overflow-y-auto h-full px-3 py-2 gap-3 ">
//                     {visibleComments.map((comment, index) => (
//                         <ReviewCard
//                             key={index}
//                             name={comment.name}
//                             date={comment.date}
//                             review={comment.review}
//                         />
//                     ))}
//                 </div>

//             </SheetContent>
//         </Sheet>
//     )
// }
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetHotelReviews } from "@/services/hotel/querys";
import RattingBadge from "./badge";
import { Hotel } from "@/types";

type Props = {
    hotel: Hotel;
};

const ReviewsMain = ({ hotel }: Props) => {
    // Note: Assuming useGetHotelReviews is defined in your query files
    const { data: reviews } = useGetHotelReviews(hotel._id);

    return (
        <Card className="w-full bg-transparent border-none shadow-none p-0">
            <CardHeader className="space-y-2 px-0">
                <h3 className="text-2xl font-bold">Reviews</h3>
                <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-blue-600 text-white hover:bg-blue-700 px-2 py-0">
                        5.0
                    </Badge>
                    <span className="font-semibold text-blue-600">Excellent</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-muted-foreground font-medium">1,260 reviews</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-10 px-0 pt-4">
                <ReviewsRanges />
                <ReviewsComments />
            </CardContent>
        </Card>
    );
};

export const ReviewsRanges = () => {
    const categories = ["Amenities", "Cleanliness", "Communication", "Location", "Value"];

    return (
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full">
            <div className="w-full lg:w-[200px] shrink-0">
                <h4 className="font-medium mb-4 text-sm text-muted-foreground text-center lg:text-left">
                    Overall Rating
                </h4>
                <div className="space-y-2.5">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                            <span className="text-xs font-bold w-3">{star}</span>
                            <Progress value={star === 5 ? 85 : star === 4 ? 15 : 0} className="h-1.5 flex-1" />
                        </div>
                    ))}
                </div>
            </div>

            <Separator orientation="vertical" className="h-32 hidden lg:block" />
            {/* <div className="w-full overflow-x-auto no-scrollbar ">
                <div className="flex lg:flex-wrap items-center md:gap-4 gap-1 lg:gap-0 lg:divide-x divide-border pb-2 lg:pb-0 ">
                     {categories.map((item) => (
                         <div
                             key={item}
                             className="flex flex-col items-center justify-center px-2 md:px-4 lg:px-8 shrink-0 lg:shrink"
                         >
                             <div className="bg-muted rounded-full px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm font-medium whitespace-nowrap">
                                 {item}
                             </div>
                             <span className="mt-1 md:mt-2 text-xs md:text-sm font-bold">5.0</span>
                         </div>
                     ))}
                 </div>
             </div> */}


             
            <div className="w-full overflow-x-auto no-scrollbar pb-2">
                <div className="flex lg:grid lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {categories.map((item) => (
                        <div key={item} className="flex flex-col items-center lg:items-start p-3 bg-muted/30 rounded-xl min-w-[120px] lg:min-w-0">
                            <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{item}</span>
                            <span className="text-lg font-bold">5.0</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ReviewsComments = () => {
    const comments = [
        { name: "July Kaly", date: "12 Mar 2025", review: "The truth of the stay with Simo was very comfortable, he welcomed us but we did not see him again..." },
        { name: "John Wick", date: "12 Mar 2025", review: "Léonor is very responsive, and the accommodation perfectly matches our expectations. Highly recommended" },
        { name: "Jack Fure", date: "12 Mar 2025", review: "Simo is very attentive and kind, the apartment was nice, the bed comfortable and very close to metro." },
        { name: "Sara Smith", date: "10 Mar 2025", review: "Great location and very clean apartment. Would stay again!" },
    ];

    const isMobile = useIsMobile();
    const INITIAL_COUNT = isMobile ? 100 : 3; // On mobile we show trigger to sheet, on desktop we show 3
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const visibleComments = comments.slice(0, 3); // Preview only 3 in the horizontal scroll

    return (
        <div className="space-y-6">
            {/* Horizontal Scroll for desktop/mobile preview */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {visibleComments.map((comment, index) => (
                    <ReviewCard key={index} {...comment} />
                ))}
            </div>

            <div className="flex justify-start">
                {isMobile ? (
                    <MoreReviewsSideSheet 
                        comments={comments} 
                        trigger={
                            <Button variant="outline" className="rounded-full font-semibold">
                                Show all reviews
                            </Button>
                        } 
                    />
                ) : (
                    <Button variant="outline" className="rounded-full font-semibold">
                        Show all 1,260 reviews
                    </Button>
                )}
            </div>
        </div>
    );
};

const ReviewCard = ({ name, date, review }: { name: string; date: string; review: string }) => {
    return (
        <Card className="rounded-2xl border border-border p-5 min-w-[280px] md:min-w-[350px] max-w-[400px] flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold text-sm leading-none mb-1">{name}</p>
                        <p className="text-[11px] text-muted-foreground">{date}</p>
                    </div>
                </div>
                <RattingBadge rating={5} variant="left" className="w-6 h-6 scale-90" />
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
                "{review}"
            </p>
        </Card>
    );
};

export function MoreReviewsSideSheet({ comments, trigger }: { comments: any[], trigger: React.ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col" side="right">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle>Guest Reviews</SheetTitle>
                    <SheetDescription>What people are saying about their stay</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-20">
                    {comments.map((comment, index) => (
                        <ReviewCard key={index} {...comment} />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default ReviewsMain;