"use client";

import Link from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard } from "@/components/neumorphism";
import type { Surah } from "@/features/quran/types";
import { useLangStore } from "@/features/lang/store/langStore";
import { SURAH_ID_TRANSLATION } from "@/constants/surah-id";

interface SurahCardProps {
  surah: Surah;
  index: number;
  searchQuery?: string;
}

export const SurahCard = memo(function SurahCard({ surah, index, searchQuery }: SurahCardProps) {
  const { t, lang } = useLangStore();
  
  const meaning = lang === "id" 
    ? (SURAH_ID_TRANSLATION[surah.number] || "Tidak tersedia")
    : surah.englishNameTranslation;

  const isHighlighted =
    searchQuery &&
    (surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meaning.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
    >
      <Link href={`/quran/${surah.number}`}>
        <NeumorphicCard className={`p-4 flex items-center gap-4 group ${isHighlighted ? "ring-2 ring-accent/50" : ""}`}>
          {/* Number Badge */}
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-accent-light to-accent flex items-center justify-center shadow-[3px_3px_6px_rgba(212,175,55,0.35),-1px_-1px_4px_rgba(255,255,255,0.6)]">
            <span className="text-white text-sm font-bold">{surah.number}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-neu-text dark:text-neu-dark-text group-hover:text-accent transition-colors">
                {surah.englishName}
              </span>
              <span className="text-xs text-neu-muted dark:text-neu-dark-muted">
                {meaning}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  surah.revelationType === "Meccan"
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {surah.revelationType === "Meccan" ? t("meccan") : t("medinan")}
              </span>
              <span className="text-xs text-neu-muted dark:text-neu-dark-muted">
                {surah.numberOfAyahs} {t("ayahs")}
              </span>
            </div>
          </div>

          {/* Arabic Name */}
          <div className="flex-shrink-0 text-right">
            <div className="font-arabic text-xl text-accent dark:text-accent-light leading-relaxed">
              {surah.name}
            </div>
          </div>
        </NeumorphicCard>
      </Link>
    </motion.div>
  );
});
