import { useQuery } from "@tanstack/react-query";
import { getHotelById, getHotels, getRoomsFromHotel } from "./hotel.service";

export const useHotelsQuery = () => {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: () => getHotels(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
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
    refetchOnReconnect: false,
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
