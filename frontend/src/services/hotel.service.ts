// // "use server";
// import { axiosApi } from "@/lib/axios";
// import { Hotel } from "@/types";

// export const getHotels = async (params?: any): Promise<Hotel[]> => {
//   const response = await axiosApi.get("/hotels", { params });
//   console.log(response);

//   return response.data.data;
// };

// // export const getHotelById = async (id: string): Promise<Hotel> => {
// //   const response = await axiosApi.get(`/hotels/${id}`);
// //   console.log(response);
// //   return response.data.data;
// // };

// export const getHotelById = async (
//   id: string,
//   checkIn?: string,
//   checkOut?: string,
//   adults?: number,
//   children?: number,
// ): Promise<Hotel> => {
//   const params = new URLSearchParams();

//   if (checkIn) params.append("checkIn", checkIn);
//   if (checkOut) params.append("checkOut", checkOut);
//   if (adults !== undefined) params.append("adults", String(adults));
//   if (children !== undefined) params.append("children", String(children));

//   const query = params.toString();
//   const url = query ? `/hotels/${id}?${query}` : `/hotels/${id}`;

//   const response = await axiosApi.get(url);
//   return response.data.data;
// };

// export const getRoomsFromHotel = async (
//   hotelId: string,
//   checkIn: string,
//   checkOut: string,
//   adults: number,
//   children: number,
// ) => {
//   console.log(
//     "hotelId",
//     hotelId,
//     "checkIn",
//     checkIn,
//     "checkOut",
//     checkOut,
//     "adults",
//     adults,
//     "children",
//     children,
//   );
//   return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
//   // const response = await axiosApi.get(`/hotels/${hotelId}/rooms`, {
//   //   params: { checkIn, checkOut, adults, children },
//   // });
//   // console.log(response);
//   // return response.data.data;
// };

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
  const response = await axiosApi.get(
    `/hotels/${id}/availability`,
    {
      params: { checkIn, checkOut, adults, children },
    }
  );

  return response.data.data;
};
