import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Helper to debounce the query string
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const useSearchCity = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ["search_city", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(debouncedQuery)}&limit=6&osm_tag=place:city&osm_tag=place:town`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const result = await res.json();
      return result.features || [];
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: Infinity, // Cache geographic data forever in-session
  });

  return {
    results: data || [],
    loading: isLoading,
    error
  };
};