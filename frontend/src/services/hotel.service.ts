import { axiosApi } from "@/lib/axios";

export interface Hotel {
  _id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  images: { url: string; public_id: string }[];
  amenities: string[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  location: {
    type: string;
    coordinates: number[];
  };
}

export interface HotelResponse {
  success: boolean;
  data: Hotel[];
}

export interface SingleHotelResponse {
  success: boolean;
  data: Hotel;
}

export const hotelService = {
  getHotels: async (params?: Record<string, any>) => {
    const response = await axiosApi.get<HotelResponse>("/hotels", { params });
    return response.data.data;
  },

  getHotelById: async (id: string) => {
    const response = await axiosApi.get<SingleHotelResponse>(`/hotels/${id}`);
    return response.data.data;
  },

  getNearbyHotels: async (lat: number, lng: number) => {
    const response = await axiosApi.get<HotelResponse>("/hotels/nearby", {
      params: { lat, lng },
    });
    return response.data.data;
  },
};
