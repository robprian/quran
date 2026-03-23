import { useQuery } from "@tanstack/react-query";
import { fetchAllDuas, fetchDuaDetail } from "../api/duaApi";

export function useAllDuas() {
  return useQuery({
    queryKey: ["duas"],
    queryFn: fetchAllDuas,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

export function useDuaDetail(id: number) {
  return useQuery({
    queryKey: ["dua", id],
    queryFn: () => fetchDuaDetail(id),
    staleTime: 1000 * 60 * 60,
    enabled: !!id,
  });
}
