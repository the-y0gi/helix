import { useQuery } from "@tanstack/react-query";
import {
  getHotelById,
  getHotels,
  getRoomsFromHotel,
  getTrips,
} from "./hotel.service";
import { currentUser } from "./user.service";
export const useTripsQuery = () => {
  return useQuery({
    queryKey: ["trips"],
    queryFn: () => getTrips(),
    staleTime: 2000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  });
};
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current_user"],
    queryFn: currentUser,
    staleTime: 2000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  });
};

export const useHotelsQuery = () => {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: () => getHotels(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};
export const useHotelQuery = ({ hotelId }: { hotelId: string }) => {
  return useQuery({
    queryKey: ["hotel_by_id", hotelId],
    queryFn: () => getHotelById(hotelId),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!hotelId,
  });
};

export const useRoomsQuery = ({
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
  return useQuery({
    queryKey: [
      "rooms",
      hotelId,
      checkIn?.toISOString(),
      checkOut?.toISOString(),
      adults,
      children,
    ],
    queryFn: () =>
      getRoomsFromHotel(
        hotelId,
        checkIn?.toISOString() || "",
        checkOut?.toISOString() || "",
        adults,
        children,
      ),

    staleTime: 2000,
    enabled: !!hotelId && !!checkIn && !!checkOut,
  });
};
