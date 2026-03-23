"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeumorphicCard, NeumorphicButton } from "@/components/neumorphism";
import { useBookmarkStore } from "@/features/quran/store/bookmarkStore";
import { useLangStore } from "@/features/lang/store/langStore";
import { DUAS } from "@/lib/duas";
import type { Dua } from "@/features/quran/types";

function DuaCard({ dua, isExpanded, onToggle }: { dua: Dua; isExpanded: boolean; onToggle: () => void }) {
  const { lang } = useLangStore();
  const { isDuaBookmarked, addBookmark, removeDuaBookmark } = useBookmarkStore();
  const bookmarked = isDuaBookmarked(dua.id);

  const handleBookmark = () => {
    if (bookmarked) {
      removeDuaBookmark(dua.id);
    } else {
      addBookmark({
        type: "dua",
        duaId: dua.id,
        ayahText: dua.arabic,
        translation: lang === "id" ? dua.translationId : dua.translationEn,
        savedAt: Date.now(),
      });
    }
  };

  return (
    <NeumorphicCard className={`overflow-hidden transition-all duration-300 ${isExpanded ? "" : "cursor-pointer"}`}>
      {/* Header – always visible */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-light/50 to-accent/30 flex items-center justify-center text-base">
            🤲
          </div>
          <div>
            <div className="font-semibold text-neu-text dark:text-neu-dark-text text-sm">
              {lang === "id" ? dua.titleId : dua.title}
            </div>
            <div className="text-[10px] text-neu-muted dark:text-neu-dark-muted">{dua.source}</div>
          </div>
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-neu-muted dark:text-neu-dark-muted text-sm ml-2"
        >
          ▾
        </motion.span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              <div className="h-px bg-gradient-to-r from-transparent via-[#c8cdd6] dark:via-[#2a2a2a] to-transparent" />

              {/* Arabic */}
              <p dir="rtl" className="font-arabic text-2xl text-right text-neu-text dark:text-neu-dark-text leading-loose">
                {dua.arabic}
              </p>

              {/* Latin */}
              <p className="text-xs italic text-neu-muted dark:text-neu-dark-muted leading-relaxed">
                {dua.latin}
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-[#c8cdd6] dark:via-[#2a2a2a] to-transparent" />

              {/* Translation */}
              <p className="text-sm text-neu-text dark:text-neu-dark-text leading-relaxed">
                {lang === "id" ? dua.translationId : dua.translationEn}
              </p>

              {/* Bookmark */}
              <div className="flex justify-end pt-1">
                <NeumorphicButton
                  variant={bookmarked ? "pressed" : "flat"}
                  size="sm"
                  onClick={handleBookmark}
                  className={`text-sm gap-1.5 ${bookmarked ? "text-accent" : ""}`}
                >
                  {bookmarked ? "🔖" : "🏷"}{" "}
                  {bookmarked
                    ? lang === "id" ? "Ditandai" : "Saved"
                    : lang === "id" ? "Simpan" : "Bookmark"}
                </NeumorphicButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NeumorphicCard>
  );
}

export default function DuasPage() {
  const { lang } = useLangStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = DUAS.filter((d) =>
    (lang === "id" ? d.titleId : d.title).toLowerCase().includes(search.toLowerCase()) ||
    d.arabic.includes(search) ||
    d.latin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
        <h1 className="text-2xl font-bold text-neu-text dark:text-neu-dark-text">
          🤲 {lang === "id" ? "Doa Harian" : "Daily Duas"}
        </h1>
        <p className="text-sm text-neu-muted dark:text-neu-dark-muted mt-1">
          {DUAS.length} {lang === "id" ? "doa pilihan beserta dalil" : "selected duas with references"}
        </p>
      </motion.div>

      {/* Search */}
      <div className="shadow-neu-pressed dark:shadow-neu-dark-pressed rounded-2xl px-4 py-2.5 flex items-center gap-3">
        <span className="text-neu-muted dark:text-neu-dark-muted text-base">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "id" ? "Cari doa..." : "Search duas..."}
          className="flex-1 bg-transparent text-sm text-neu-text dark:text-neu-dark-text placeholder:text-neu-muted outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-neu-muted text-sm">✕</button>
        )}
      </div>

      {/* Dua list */}
      {filtered.length === 0 ? (
        <p className="text-center text-neu-muted dark:text-neu-dark-muted py-8">
          {lang === "id" ? "Doa tidak ditemukan" : "No duas found"}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((dua, i) => (
            <motion.div
              key={dua.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <DuaCard
                dua={dua}
                isExpanded={expandedId === dua.id}
                onToggle={() => setExpandedId(expandedId === dua.id ? null : dua.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
