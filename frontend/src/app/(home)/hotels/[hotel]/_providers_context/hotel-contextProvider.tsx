import { useHotelAvailabilityQuery, useHotelDetailsQuery } from '@/services/hotel/querys';
import { useHotelStore } from '@/store/hotel.store';
import { Hotel, RoomType } from '@/types';
import React from 'react'

type Props = {
    hotelId: string;
    children: React.ReactNode;
}
const HotelContext = React.createContext<{
    rooms: RoomType[];
    availabilityResponse: Hotel | undefined;
    availabilityLoading: boolean;
    FetchRoomTypes: () => void;
    refetchAvailability: () => void;
} | null>(null);
const HotelContextProvider = ({ hotelId, children }: Props) => {
    const { date, guests, isBookingMode } = useHotelStore();
    const { data: hotelDetailsData } =
        useHotelDetailsQuery(hotelId);

    const { data: availabilityResponse, isLoading: availabilityLoading, refetch: refetchAvailability } =
        useHotelAvailabilityQuery({
            hotelId,
            checkIn: date?.from,
            checkOut: date?.to,
            adults: guests.adults,
            children: guests.children,
        });

    const FetchRoomTypes = () => {
        console.log("fetching new values");

        refetchAvailability();

    }
    const availabilityRooms =
        availabilityResponse?.roomTypes;
    console.log("yes", availabilityRooms, isBookingMode);

    let rooms =
        isBookingMode && availabilityRooms
            ? availabilityRooms
            : hotelDetailsData?.roomTypes || [];
    return (
        <HotelContext.Provider value={{ availabilityResponse, availabilityLoading, FetchRoomTypes, refetchAvailability, rooms }}>
            {children}
        </HotelContext.Provider>
    )
}

export default HotelContextProvider

export const useHotelContext = () => {
    const context = React.useContext(HotelContext);
    if (!context) {
        throw new Error("useHotelContext must be used within HotelContextProvider");
    }
    return context;
}