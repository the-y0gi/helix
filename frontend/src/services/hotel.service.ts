import { axiosApi } from "@/lib/axios";
import { Hotel } from "@/types";

export const getHotels = async (params?: any): Promise<Hotel[]> => {
  const response = await axiosApi.get("/hotels", { params });
  return response.data.data;
};

export const getHotelDetails = async (id: string): Promise<Hotel> => {
  const response = await axiosApi.get(`/hotels/${id}`);
  return response.data.data;
};

export const getHotelAvailability = async (
  id: string,
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number,
): Promise<Hotel> => {
  const response = await axiosApi.get(`/hotels/${id}/availability`, {
    params: { checkIn, checkOut, adults, children },
  });

  return response.data.data;
};
