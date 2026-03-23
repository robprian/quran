"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSurahList } from "@/features/quran/api/quranApi";
import type { Surah } from "@/features/quran/types";

export function useSurahs() {
  return useQuery<Surah[]>({
    queryKey: ["surahs"],
    queryFn: fetchSurahList,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 48,    // 48 hours
    retry: 2,
  });
}
