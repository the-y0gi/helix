import { currentUser } from "./user.service";
import { useQuery } from "@tanstack/react-query";
import {
  getHotels,
  getHotelDetails,
  getHotelAvailability,
} from "./hotel.service";
import { getBookingById, getMyBookings } from "./booking.service";
export const useBookingByIdQuery = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["booking_by_id", id],
    queryFn: () => getBookingById(id),
    staleTime: 10000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  });
};
export const useMyBookingsQuery = () => {
  return useQuery({
    queryKey: ["my_bookings"],
    queryFn: () => getMyBookings(),
    staleTime: 200000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  });
};

export const useCurrentUser = () => {
  const token =
    typeof window !== "undefined" && localStorage.getItem("accessToken");
  return useQuery({
    queryKey: ["current_user"],
    queryFn: currentUser,
    staleTime: 2000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    enabled: !!token,
    retry: false, // optional
  });
};

export const useHotelsQuery = () => {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: getHotels,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const useHotelDetailsQuery = (hotelId: string) => {
  return useQuery({
    queryKey: ["hotel_details", hotelId],
    queryFn: () => getHotelDetails(hotelId),
    enabled: !!hotelId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
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
      // hotelId,
      // checkIn?.toISOString(),
      // checkOut?.toISOString(),
      // adults,
      // children,
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
    staleTime: Infinity,
  });
};
