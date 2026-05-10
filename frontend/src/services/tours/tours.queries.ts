"use client";
import { useQuery } from "@tanstack/react-query";
import {
  getAllTours,
  getTourDetails,
  getTours,
  getTourServiceDetails,
} from "./tours.service";
import { Filters } from "@/context/NuqsContentProvider";

export const useGetToursByFiltersDemo = (val: Filters, page: number = 1) => {
  return useQuery({
    queryKey: ["tours_by_params", val, page],

    queryFn: () => getTours(val, page),

    staleTime: 30 * 1000, // 3 seconds
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
// export const useGetAllToursQuery = () => {
//   return useQuery({
//     queryKey: ["getAllTours"],
//     queryFn: () => getAllTours(),
//     staleTime: Infinity,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: true,
//     retry: false, // optional
//   });
// };
export const useTourServiceDetails = (id: string) => {
  return useQuery({
    queryKey: ["getTourServiceDetails", id],
    queryFn: () => getTourServiceDetails(id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  });
};
export const useTourDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["getTourDetails", id],
    queryFn: () => getTourDetails(id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false, // optional
  });
};
