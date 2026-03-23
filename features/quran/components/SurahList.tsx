"use client";

import { useMemo } from "react";
import { useSurahs } from "@/features/quran/hooks/useSurahs";
import { SurahCard } from "./SurahCard";
import { AyatShimmer } from "@/components/ui/AyatShimmer";
import { ErrorUI } from "@/components/ui/ErrorUI";
import { useDebounce } from "@/features/quran/hooks/useDebounce";

interface SurahListProps {
  searchQuery: string;
}

export function SurahList({ searchQuery }: SurahListProps) {
  const { data: surahs, isLoading, isError, refetch } = useSurahs();
  const debouncedQuery = useDebounce(searchQuery, 300);

  const filtered = useMemo(() => {
    if (!surahs) return [];
    if (!debouncedQuery.trim()) return surahs;
    const q = debouncedQuery.toLowerCase();
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.number.toString().includes(q)
    );
  }, [surahs, debouncedQuery]);

  if (isLoading) return <AyatShimmer />;
  if (isError) return <ErrorUI message="Failed to load surah list" onRetry={refetch} />;
  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center text-neu-muted dark:text-neu-dark-muted">
        <div className="text-4xl mb-3">🔍</div>
        <p>No surahs found for &ldquo;{debouncedQuery}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((surah, idx) => (
        <SurahCard key={surah.number} surah={surah} index={idx} searchQuery={debouncedQuery} />
      ))}
    </div>
  );
}
