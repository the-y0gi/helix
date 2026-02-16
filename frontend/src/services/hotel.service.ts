// "use server";
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
export const getRoomsFromHotel = async (
  hotelId: string,
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number,
) => {
  console.log(
    "hotelId",
    hotelId,
    "checkIn",
    checkIn,
    "checkOut",
    checkOut,
    "adults",
    adults,
    "children",
    children,
  );
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  // const response = await axiosApi.get(`/hotels/${hotelId}/rooms`, {
  //   params: { checkIn, checkOut, adults, children },
  // });
  // console.log(response);
  // return response.data.data;
};
