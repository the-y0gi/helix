
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
import { useTourServiceDetails } from "@/services/tours/tours.queries";
import TourServicesDetails from "./_components/HotelItems";
export interface BikeRentalResponse {
    success: boolean;
    data: RentalData;
}

export interface RentalData {
    company: Company;
    service: BikeService;
}

export interface Company {
    companyId: string;
    name: string;
    city: string;
    rating: number;
    images: string[];
    description: string;
    rentalPolicies: RentalPolicies;
}

export interface RentalPolicies {
    helmetIncluded: boolean;
    securityDeposit: number;
    licenseRequired: boolean;
}

export interface BikeService {
    serviceId: string;
    title: string;
    description: string;
    bikeName: string;
    bikeType: string;
    engineCC: number;
    fuelType: string;
    mileage: string;
    gearType: string;
    pricePerDay: number;
    totalPriceWithTax: number;
    taxPercentage: number;
    maxDurationDays: number;
    images: string[];
    features: string[];
}
const BikeDetails = ({ className }: { className?: string }) => {
    const [isBookingMode, setIsBookingMode] = React.useState(false);
    const ismobile = useIsMobile();
    localStorage.removeItem("nextRoute")
    localStorage.removeItem("like")
    const serviceId = useParam("serviceid")


    const { data: tourDetailsData, isLoading } =
        useTourServiceDetails(serviceId);


    if (!tourDetailsData || !tourDetailsData.data?.company || isLoading) {
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
                    <TourServicesDetails
                        data={tourDetailsData.data}
                        loading={isLoading || !tourDetailsData.data}
                        isBookingMode={isBookingMode}
                    />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
};



export default BikeDetails;


