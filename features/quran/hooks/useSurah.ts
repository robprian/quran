"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSurahDetail } from "@/features/quran/api/quranApi";
import type { SurahDetailData } from "@/features/quran/types";

export function useSurah(surahNumber: number) {
  return useQuery<SurahDetailData>({
    queryKey: ["surah", surahNumber],
    queryFn: () => fetchSurahDetail(surahNumber),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 48,
    enabled: surahNumber > 0 && surahNumber <= 114,
    retry: 2,
  });
}
