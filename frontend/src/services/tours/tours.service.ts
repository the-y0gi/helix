import { axiosApi } from "@/lib/axios";
import { Tour } from "@/context/TourContextProvider";
import { toast } from "sonner";
import { Filters } from "@/context/NuqsContentProvider";
import qs from "qs";

export type TourResponse = {
  data: Tour[];
  total: number;
  count?: number;
};
export const getAllTours = async () => {
  try {
    const res = await axiosApi.get(`/tour-services`);
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
  }
};
export const getTourServiceDetails = async (id: string) => {
  try {
    const res = await axiosApi.get(`/tour-services/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
  }
};
export const getTourDetails = async (id: string) => {
  try {
    const res = await axiosApi.get(`/tour-services/company/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
  }
};

export const getTours = async (
  filters: Filters,
  page: number = 1,
  limit: number = 9,
): Promise<TourResponse> => {
  const params: Record<string, unknown> = { page, limit };

  const [minPrice, maxPrice] = filters.price ?? [0, 10];
  if (minPrice > 0) params.minPrice = minPrice;
  if (maxPrice > 0 && maxPrice < 10) params.maxPrice = maxPrice;

  if (filters.location?.length > 0) {
    params.city = filters.location[0];
  } else if ((filters as any).city) {
    params.city = (filters as any).city;
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

  if ((filters as any).adults) {
    params.adults = (filters as any).adults;
  } else if (filters.Bedrooms?.length > 0) {
    params.adults = Math.max(...filters.Bedrooms);
  }

  if ((filters as any).children) {
    params.children = (filters as any).children;
  }

  if (filters.Beds?.length > 0) params.beds = Math.max(...filters.Beds);
  if (filters.Bathrooms?.length > 0)
    params.bathrooms = Math.max(...filters.Bathrooms);

  if ((filters as any).date?.checkIn)
    params.checkIn = (filters as any).date.checkIn;
  if ((filters as any).date?.checkOut)
    params.checkOut = (filters as any).date.checkOut;

  if (
    filters.typeOfPlace?.length > 0 &&
    !filters.typeOfPlace.includes("Any type")
  ) {
    params.typeOfPlace = filters.typeOfPlace;
  }

  // const response = await axiosApi.get("/hotels", {
  //   params,
  //   paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  // });
  const response = await axiosApi.get("/tour-services", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });

  return {
    data: response.data.data?.tours ?? [],
    total: response.data.data?.pagination?.count ?? 0,
  };
};
