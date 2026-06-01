
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
import { usegetCabServiceDetails } from "@/services/cabs/cabs.queries";
import { HotelImage } from "@/types";
export interface BikeRentalResponse {
    success: boolean;
    data: CabDetailData;
}
export interface CabDetailResponse {
    success: boolean;
    data: CabDetailData;
}

export interface CabDetailData {
    company: Company;
    service: CabDetailService;
}

export interface Company {
    companyId: string;
    name: string;
    city: string;
    rating: number;
    images: HotelImage[];
    description: string;
}

export interface CabDetailService {
    serviceId: string;
    title: string;
    description: string;
    carName: string;
    cabType: "sedan" | "suv" | "luxury" | string;
    capacity: number;
    route: Route;
    distance: string;
    duration: string;
    price: number;
    totalPriceWithTax: number;
    taxPercentage: number;
    images: HotelImage[];
    features: string[];
    carNumber: string;
}

export interface Route {
    pickup: string;
    drop: string;
}
const BikeDetails = ({ className }: { className?: string }) => {
    const [isBookingMode, setIsBookingMode] = React.useState(false);
    const ismobile = useIsMobile();
    localStorage.removeItem("nextRoute")
    localStorage.removeItem("like")
    const serviceId = useParam("serviceid")


    const { data: bikeDetailsData, isLoading } =
        usegetCabServiceDetails(serviceId);


    if (!bikeDetailsData || !bikeDetailsData.data?.company || isLoading) {
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
