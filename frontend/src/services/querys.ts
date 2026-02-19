import { useQuery } from "@tanstack/react-query";
import {
  getHotels,
  getHotelDetails,
  getHotelAvailability,
} from "./hotel.service";

export const useHotelsQuery = () => {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: getHotels,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useHotelDetailsQuery = (hotelId: string) => {
  return useQuery({
    queryKey: ["hotel_details", hotelId],
    queryFn: () => getHotelDetails(hotelId),
    enabled: !!hotelId,
    staleTime: 60 * 1000,
  });
};

export const useHotelAvailabilityQuery = ({
  hotelId,
  checkIn,
  checkOut,
  adults,
  children,
}: {
  hotelId: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  adults: number;
  children: number;
}) => {
  const isBookingMode = !!checkIn && !!checkOut;

  return useQuery({
    queryKey: [
      "hotel_availability",
      hotelId,
      checkIn?.toISOString(),
      checkOut?.toISOString(),
      adults,
      children,
    ],
    queryFn: () =>
      getHotelAvailability(
        hotelId,
        checkIn!.toISOString(),
        checkOut!.toISOString(),
        adults,
        children,
      ),
    enabled: !!hotelId && isBookingMode,
    staleTime: 2000,
  });
};
