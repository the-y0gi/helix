import { useQuery } from "@tanstack/react-query";
import { getFavouriteSummary, getMyTrip, getMyTripME, getReviews } from "./profile.service";
export const useGetReviewsQuery = (id: string) => {
  return useQuery({
    queryKey: ["getReviews"],
    queryFn: () => getReviews(id),
    staleTime: 10000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  });
};
export const useGetFavouriteSummary = ()=>{
  return useQuery({
    queryKey: ["favourite_summary"],
    queryFn: () => getFavouriteSummary(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  })
}
export const useGetMyTrips = ()=>{
  return useQuery({
    queryKey: ["my-trips"],
    queryFn: () => getMyTrip(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  })
}

export const useGetMyTripME = ()=>{
  return useQuery({
    queryKey: ["my-trip-me"],
    queryFn: () => getMyTripME(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  })
}