import React from "react";
import {
  useHotelAvailabilityQuery,
  useHotelDetailsQuery,
} from "@/services/hotel/querys";
import { useHotelStore } from "@/store/hotel.store";
import { Hotel, RoomType } from "@/types";

type Props = {
  hotelId: string;
  children: React.ReactNode;
};

const HotelContext = React.createContext<{
  rooms: RoomType[];
  availabilityResponse: Hotel | undefined;
  availabilityLoading: boolean;
  FetchRoomTypes: () => void;
  refetchAvailability: () => void;
} | null>(null);

const HotelContextProvider = ({ hotelId, children }: Props) => {
  // ✅ Zustand selectors (IMPORTANT)
  const date = useHotelStore((s) => s.date);
  const guests = useHotelStore((s) => s.guests);
  const isBookingMode = useHotelStore((s) => s.isBookingMode);

  // ✅ Memoize params
  const availabilityParams = React.useMemo(
    () => ({
      hotelId,
      checkIn: date?.from,
      checkOut: date?.to,
      adults: guests.adults,
      children: guests.children,
    }),
    [hotelId, date?.from, date?.to, guests.adults, guests.children]
  );

  const { data: hotelDetailsData } =
    useHotelDetailsQuery(hotelId);

  const {
    data: availabilityResponse,
    isLoading: availabilityLoading,
    refetch: refetchAvailability,
  } = useHotelAvailabilityQuery(availabilityParams);

  const availabilityRooms = availabilityResponse?.roomTypes;

  const rooms =
    isBookingMode && availabilityRooms
      ? availabilityRooms
      : hotelDetailsData?.roomTypes || [];

  // ✅ Memoize context value (prevents child re-renders)
  const contextValue = React.useMemo(
    () => ({
      availabilityResponse,
      availabilityLoading,
      FetchRoomTypes: refetchAvailability,
      refetchAvailability,
      rooms,
    }),
    [
      availabilityResponse,
      availabilityLoading,
      refetchAvailability,
      rooms,
    ]
  );

  return (
    <HotelContext.Provider value={contextValue}>
      {children}
    </HotelContext.Provider>
  );
};

export default HotelContextProvider;

export const useHotelContext = () => {
  const context = React.useContext(HotelContext);
  if (!context) {
    throw new Error(
      "useHotelContext must be used within HotelContextProvider"
    );
  }
  return context;
};