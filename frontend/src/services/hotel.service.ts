import { axiosApi } from "@/lib/axios";
import { Hotel } from "@/types";

export const getHotels = async (params?: any): Promise<Hotel[]> => {
  const response = await axiosApi.get("/hotels", { params });
  console.log(response);
  
  return response.data.data;
};

export const getHotelById = async (id: string): Promise<Hotel> => {
  const response = await axiosApi.get(`/hotels/${id}`);
  console.log(response);
  return response.data.data;
};
