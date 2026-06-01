
"use client";

import { cn } from "@/lib/utils";
import React, { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "next/navigation";

import HotelItems from "./_components/HotelItems";
import { useHotelStore } from "@/store/hotel.store";
import { HotelPageSkeleton, Skeleton } from "@/components/ui/skeleton";

import { MessageModal } from "@/components/messagemodal";
import { useIsMobile } from "@/hooks/use-mobile";
import { usegetBikeServiceDetails } from "@/services/bikes/bikes.queries";
import { ScrollToTop } from "../../../../../../../scrolltoto";
import BikeDetailsItems from "./_components/HotelItems";
import { useParam } from "@/services/dailyfunctions";
import { usegetAdventureServiceDetails } from "@/services/adventures/adventures.queries";
import { HotelImage } from "@/types";
export interface BikeRentalResponse {
    success: boolean;
    data: TrekDetailData;
}
export interface TrekDetailResponse {
    success: boolean;
    data: TrekDetailData;
}

export interface TrekDetailData {
    adventure: AdventureInfo;
    service: TrekService;
}

export interface AdventureInfo {
    _id: string;
    name: string;
    category: "trekking" | "camping" | string;
    city: string;
    images: HotelImage[];
    rating?: number;
}

export interface TrekService {
    _id: string;
    title: string;
    type: "package" | "fixed" | string;
    pricing: Pricing;
    meta: ServiceMeta;
    features: string[];
    totalFeatures: number;
    itinerary: ItineraryStep[];
    hasItinerary: boolean;
    createdAt: string; // ISO Date string
}

export interface Pricing {
    basePrice: number;
    discountPrice: number;
    effectivePrice: number;
    discountAmount: number;
    discountPercentage: number;
    taxPercentage: number;
    taxAmount: number;
    finalPrice: number;
}

export interface ServiceMeta {
    distance: string | null;
    duration: string | null;
    days: number;
    nights: number;
}

export interface ItineraryStep {
    day: number;
    title: string;
    description: string;
}

const BikeDetails = ({ className }: { className?: string }) => {
    const [isBookingMode, setIsBookingMode] = React.useState(false);
    const ismobile = useIsMobile();
    localStorage.removeItem("nextRoute")
    localStorage.removeItem("like")
    const serviceId = useParam("serviceid")


    const { data: bikeDetailsData, isLoading } =
        usegetAdventureServiceDetails(serviceId);


    if (!bikeDetailsData || !bikeDetailsData.data || isLoading) {
        return (
            <div className={cn("w-full", className)}>
                <ScrollToTop />
                <HotelPageSkeleton />
            </div>
        );
    }





    return (
        <div className={cn("w-full  ", className)}>
            <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
                <Suspense fallback={<HotelPageSkeleton />}>
                    <ScrollToTop />
                    <BikeDetailsItems
                        data={bikeDetailsData.data}
                        loading={isLoading || !bikeDetailsData.data}
                        isBookingMode={isBookingMode}
                    />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
};



export default BikeDetails;
