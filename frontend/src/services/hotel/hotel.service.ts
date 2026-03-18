import { HotelFilters } from "@/context/hotel/HotelContextProvider";
import { axiosApi } from "@/lib/axios";
import { Hotel } from "@/types";
import { toast } from "sonner";

export const getHotelReviews = async (id: string) => {
  try {
    const res = await axiosApi.get(`/reviews/hotel/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
  }
};

export const getHotelPolicies = async (id: string) => {
  try {
    const res = await axiosApi.get(`/policies/hotel/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
  }
};

export const getNewHotels = async () => {
  try {
    const res = await axiosApi.get(`/hotels/home`);
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
  }
};

import qs from "qs";

export type HotelsResponse = {
  data: Hotel[];
  total: number;
  count: number;
};

export const getHotels = async (
  filters: HotelFilters,
  page: number = 1,
  limit: number = 9,
): Promise<HotelsResponse> => {
  const params: Record<string, unknown> = { page, limit };

  const [minPrice, maxPrice] = filters.price ?? [0, 10];
  if (minPrice > 0) params.minPrice = minPrice;
  if (maxPrice > 0 && maxPrice < 10) params.maxPrice = maxPrice;

  if (filters.location?.length > 0) {
    params.city = filters.location[0];
  }

  if (filters.score?.length > 0) {
    params.minRating = Math.min(...filters.score.map(Number));
  }

  const allAmenities = [
    ...(filters.amenities ?? []),
    ...(filters.essentials ?? []),
    ...(filters.features ?? []),
    ...(filters.onsite ?? []),
  ];
  if (allAmenities.length > 0) {
    params.amenities = allAmenities;
  }

  if (filters.roomSize?.length > 0) {
    params.maxSize = Math.max(...filters.roomSize.map(Number));
  }

  if (filters.Bedrooms?.length > 0)
    params.adults = Math.max(...filters.Bedrooms);
  if (filters.Beds?.length > 0) params.beds = Math.max(...filters.Beds);
  if (filters.Bathrooms?.length > 0)
    params.bathrooms = Math.max(...filters.Bathrooms);

  if (
    filters.typeOfPlace?.length > 0 &&
    !filters.typeOfPlace.includes("Any type")
  ) {
    params.typeOfPlace = filters.typeOfPlace;
  }

  const response = await axiosApi.get("/hotels", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });

  return {
    data: response.data.data ?? [],
    total: response.data.total ?? 0,
    count: response.data.count ?? 0,
  };
};

export const getHotelsForSearch = async (val: HotelFilters) => {
  const res = await axiosApi.get("/hotels", {
    params: val,
  });
  return res.data;
};

export const getHotelDetails = async (id: string) => {
  const response = await axiosApi.get(`/hotels/${id}`);
  return response.data.data;
};

export const getHotelAvailability = async ({
  hotelId,
  checkIn,
  checkOut,
  adults,
  children,
}: {
  hotelId: string;
  checkIn?: Date;
  checkOut?: Date;
  adults: number;
  children: number;
}): Promise<Hotel> => {
  if (!checkIn || !checkOut || checkIn > checkOut || checkIn === checkOut) {
    throw new Error("Check-in and Check-out dates are required");
  }

  const response = await axiosApi.get(`/hotels/${hotelId}/availability`, {
    params: {
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      adults,
      children,
    },
  });

  return response.data.data;
};
// type AllProps = {};
// export const getHotelByPagination = async (data: AllProps) => {
//   try {
//     const res = await axiosApi.post(`/hotels/pagination`, data);
//     return res.data;
//   } catch (error) {
//     console.error(error);
//   }
// };

export const SearchCity = async (query:string)=>{
  const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6`);
  const data = await res.json();
  return data
}
export const dotoggleLike = async (id: string) => {
  try {
    const res = await axiosApi.post(`/favorites/toggle/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
  }
};
