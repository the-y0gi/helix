import { axiosApi } from "@/lib/axios";
import { toast } from "sonner";

export const getReviews = async (id: string) => {
  try {
    const response = await axiosApi.get(`/reviews/hotel/${id}`);
    return response.data;
  } catch (error) {
    toast.error( "Failed to get reviews");
    throw error;
  }
};
export const getFavouriteSummary = async () => {
  try {
    const res = await axiosApi.get(`/favorites/summary`);
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
  }
};
export const getMyTrip = async () => {
  try {
    const res = await axiosApi.get(`/favorites/my-trip`);
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
  }
};
export const getMyTripME = async () => {
  try {
    const res = await axiosApi.get(`/favorites/me`);
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
  }
};