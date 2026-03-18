"use client";
import { currentUser } from "../user.service";
import { useQuery } from "@tanstack/react-query";
import {
  getHotels,
  getHotelDetails,
  getHotelAvailability,
  getHotelsForSearch,
  getHotelPolicies,
  getHotelReviews,
  getNewHotels,
  SearchCity,
} from "./hotel.service";
import { getBookingById, getMyBookings } from "../booking/booking.service";
import { HotelFilters } from "@/context/hotel/HotelContextProvider";

export const useSearchCity = (query:string) => {
  return useQuery({
    queryKey: ["search_city", query],
    queryFn: () => SearchCity(query),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false,
    enabled: !!query,
  });
};
export const useGetNewHotels = () => {
  return useQuery({
    queryKey: ["gethotels_home"],
    queryFn: () => getNewHotels(),
    staleTime: 20000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false,
  });
};

export const useGetHotelReviews = (id: string) => {
  return useQuery({
    queryKey: ["hotel_reviews", id],
    queryFn: () => getHotelReviews(id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  });
};

export const useGetHotelPolicies = (id: string) => {
  return useQuery({
    queryKey: ["hotel_policies", id],
    queryFn: () => getHotelPolicies(id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  });
};

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
export const useGetHotelsByFiltersDemo = (
  val: HotelFilters,
  page: number = 1,
) => {
  return useQuery({
    queryKey: ["hotels_by_params", val, page],

    queryFn: () => getHotels(val, page),

    staleTime: 3 * 1000, // 3 seconds
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// export const useGetHotelsByFilters = ({_id,address,amenities,city,description,images,isFavorite,isFeatured,location,name,
//   numReviews,rating,roomTypes,createdAt,distanceFromCenter,isActive,updatedAt,vendorId
// }:Hotel) =>{
//   return useQuery({
//     queryKey: ["hotels_by_params"],
//     queryFn: getHotels,
//     staleTime: 3 * 1000,
//     gcTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: true,
//   })
// }

export const useHotelsQuery = () => {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: () =>
      getHotels({
        price: [0, 10],
        Bedrooms: [],
        Beds: [],
        Bathrooms: [],
        typeOfPlace: [],
        essentials: [],
        roomSize: [],
        onsite: [],
        features: [],
        amenities: [],
        roomsbeds: [],
        location: [],
        classification: [],
        score: [],
        distance: [],
      }),
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
type AvailabilityParams = {
  hotelId: string;
  checkIn?: Date;
  checkOut?: Date;
  adults: number;
  children: number;
};

export const useHotelAvailabilityQuery = (params: AvailabilityParams) => {
  return useQuery({
    queryKey: [
      "hotel-availability",
      params.hotelId,
      params.checkIn?.toISOString(),
      params.checkOut?.toISOString(),
      params.adults,
      params.children,
    ],
    queryFn: () => getHotelAvailability(params),
    enabled: !!params.checkIn && !!params.checkOut,
    staleTime: Infinity,
  });
};

// export const useHotelAvailabilityQuery = ({
//   hotelId,
//   checkIn,
//   checkOut,
//   adults,
//   children,
// }: {
//   hotelId: string;
//   checkIn?: Date | null;
//   checkOut?: Date | null;
//   adults: number;
//   children: number;
// }) => {
//   const isBookingMode = !!checkIn && !!checkOut;

//   return useQuery({
//     queryKey: [
//       "hotel_availability",
//       // hotelId,
//       // checkIn?.toISOString(),
//       // checkOut?.toISOString(),
//       // adults,
//       // children,
//     ],
//     queryFn: () =>
//       getHotelAvailability(
//         hotelId,
//         checkIn!.toISOString(),
//         checkOut!.toISOString(),
//         adults,
//         children,
//       ),
//     enabled: !!hotelId && isBookingMode && !!checkIn && !!checkOut,
//     staleTime: Infinity,
//   });
// };
