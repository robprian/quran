"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useLangStore } from "@/features/lang/store/langStore";
import { useAllDuas } from "@/features/dua/hooks/useDua";
import { DuaCard } from "@/features/dua/components/DuaCard";
import { DuaFilterBar } from "@/features/dua/components/DuaFilterBar";
import { NeumorphicButton, NeumorphicCard } from "@/components/neumorphism";
import Link from "next/link";
import { Dua } from "@/features/dua/types";

export default function DuasPage() {
  const { t, lang } = useLangStore();
  const isId = lang === "id";
  const { data: duas, isLoading, isError, refetch } = useAllDuas();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  
  // Random "Doa Hari Ini"
  const [randomDua, setRandomDua] = useState<Dua | null>(null);

  useEffect(() => {
    if (duas && duas.length > 0 && !randomDua) {
      // Pick a random dua seeded by today's date so it stays consistent for the day
      const today = new Date().toDateString();
      const seed = Array.from(today).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const randomIndex = seed % duas.length;
      setRandomDua(duas[randomIndex]);
    }
  }, [duas, randomDua]);

  // Derived filters
  const groups = useMemo(() => {
    if (!duas) return [];
    return Array.from(new Set(duas.map(d => d.group).filter(Boolean))).sort();
  }, [duas]);

  const tags = useMemo(() => {
    if (!duas) return [];
    const allTags = duas.flatMap(d => d.tags);
    return Array.from(new Set(allTags)).sort();
  }, [duas]);

  // Apply filters
  const filteredDuas = useMemo(() => {
    if (!duas) return [];
    return duas.filter((d) => {
      const matchSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.arabic.includes(searchQuery);
      const matchGroup = selectedGroup ? d.group === selectedGroup : true;
      const matchTag = selectedTag ? d.tags.includes(selectedTag) : true;
      return matchSearch && matchGroup && matchTag;
    });
  }, [duas, searchQuery, selectedGroup, selectedTag]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-neu-muted font-medium">{isId ? "Memuat doa..." : "Loading duas..."}</p>
      </div>
    );
  }

  if (isError || !duas) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <div className="text-4xl mb-2">⚠️</div>
        <p className="text-neu-text font-medium">{isId ? "Gagal mengambil data doa" : "Failed to fetch duas"}</p>
        <NeumorphicButton variant="pressed" onClick={() => refetch()} className="mt-4">
          {isId ? "Coba Lagi" : "Retry"}
        </NeumorphicButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
        <h1 className="text-3xl font-bold text-neu-text dark:text-neu-dark-text mt-2">
          🤲 {isId ? "Doa Harian" : "Daily Duas"}
        </h1>
        <p className="text-sm text-neu-muted dark:text-neu-dark-muted mt-2 leading-relaxed">
          {duas.length} {isId ? "kumpulan doa pilihan dari EQuran.id" : "collection of selected duas from EQuran.id"}
        </p>
      </motion.div>

      {/* Doa Hari Ini */}
      {randomDua && !searchQuery && !selectedGroup && !selectedTag && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <NeumorphicCard className="p-1 min-h-[160px] bg-gradient-to-br from-accent/20 to-transparent border border-accent/20 hover:shadow-neu-pressed dark:hover:shadow-neu-dark-pressed transition-all">
            <Link href={`/duas/${randomDua.id}`} className="block h-full w-full p-5">
              <div className="flex items-center gap-2 mb-3 text-accent text-xs font-bold tracking-wider uppercase">
                <span>🌟</span> {isId ? "Doa Hari Ini" : "Dua of the Day"}
              </div>
              <h3 className="font-bold text-xl text-neu-text dark:text-neu-dark-text mb-3">
                {randomDua.title}
              </h3>
              <p dir="rtl" className="font-arabic text-2xl text-right text-accent leading-loose line-clamp-2">
                {randomDua.arabic}
              </p>
            </Link>
          </NeumorphicCard>
        </motion.div>
      )}

      {/* Filters */}
      <DuaFilterBar 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} groups={groups}
        selectedTag={selectedTag} setSelectedTag={setSelectedTag} tags={tags}
      />

      {/* List */}
      {filteredDuas.length === 0 ? (
        <div className="py-12 text-center text-neu-muted">
          <p className="text-4xl mb-4 opacity-50">🔍</p>
          <p className="font-medium">{isId ? "Doa tidak ditemukan" : "No duas found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredDuas.map((dua, i) => (
            <motion.div
              key={dua.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i > 10 ? 0 : i * 0.05 }}
            >
              <DuaCard dua={dua} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
