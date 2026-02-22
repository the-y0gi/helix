import { HotelFilters } from "@/context/hotel/HotelContextProvider";
import { axiosApi } from "@/lib/axios";
import { Hotel } from "@/types";
import { toast } from "sonner";



export const getFavouriteSummary =async()=>{
  try {
    const res = await axiosApi.get(`/favorites/summary`);
    return res.data
  } catch (error) {
    console.log(error);
    toast.error("something went wrong")
    
  }
}
export const getMyTrip =async()=>{
  try {
    const res = await axiosApi.get(`/favorites/my-trip`);
    return res.data
  } catch (error) {
    console.log(error);
    toast.error("something went wrong")
    
  }
}
export const getMyTripME =async()=>{
  try {
    const res = await axiosApi.get(`/favorites/me`);
    return res.data
  } catch (error) {
    console.log(error);
    toast.error("something went wrong")
    
  }
}




export const getHotelReviews =async(id:string)=>{
  try {
    const res = await axiosApi.get(`/reviews/hotel/${id}`);
    return res.data
  } catch (error) {
    console.log(error);
    toast.error("something went wrong")
    
  }
}

export const getHotelPolicies =async(id:string)=>{
  try {
    const res = await axiosApi.get(`/policies/hotel/${id}`);
    return res.data
  } catch (error) {
    console.log(error);
    toast.error("something went wrong")
    
  }
}







export const getHotels = async (params?: any): Promise<Hotel[]> => {
  const response = await axiosApi.get("/hotels", { params });
  return response.data.data;
};
export const getHotelsForSearch = async (val:HotelFilters) => {
  return []
  
  // const response = await axiosApi.get("/hotels", { val });
  // return response.data.data;
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
type AllProps={
  
}
export const getHotelByPagination = async (data:AllProps) =>{
  try {
    const res = await axiosApi.post(`/hotels/pagination`,data)
    return res.data
    
  } catch (error) {
    console.log(error);
    
    
  }
}













export const dotoggleLike = async (id:string)=>{
  try {
    const res = await axiosApi.post(`/favorites/toggle/${id}`);
    if(res.status===200){
      return res.data
    }
    
  } catch (error) {
    console.log(error);
    toast.error("something went wrong")
    
  }
}
