"use client";

import { useState } from "react";
import { SearchBar } from "@/features/quran/components/SearchBar";
import { SurahList } from "@/features/quran/components/SurahList";
import { motion } from "framer-motion";
import { useLangStore } from "@/features/lang/store/langStore";

export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLangStore();

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2"
      >
        <h1 className="text-2xl font-bold text-neu-text dark:text-neu-dark-text">
          القرآن الكريم
        </h1>
        <p className="text-sm text-neu-muted dark:text-neu-dark-muted mt-1">
          {t("holy_quran_sub")}
        </p>
      </motion.div>

      {/* Search */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Surah List */}
      <SurahList searchQuery={searchQuery} />
    </div>
  );
}
