"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLangStore } from "@/features/lang/store/langStore";
import { NeumorphicCard } from "@/components/neumorphism";
import { SearchBar } from "@/features/quran/components/SearchBar";
import ceritaData from "@/data/cerita-islami.json";

export default function CeritaPage() {
  const { t } = useLangStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStories = ceritaData.filter((story) => 
     story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     story.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2"
      >
        <h1 className="text-2xl font-bold text-neu-text dark:text-neu-dark-text">
          {t("cerita") || "Cerita Islami"}
        </h1>
        <p className="text-sm text-neu-muted dark:text-neu-dark-muted mt-1">
          {t("cerita_sub") || "Kisah hikmah dari Al-Qur'an"}
        </p>
      </motion.div>

      <SearchBar onSearch={setSearchQuery} />

      <div className="space-y-4">
        <AnimatePresence>
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <Link href={`/cerita/${story.id}`}>
                <NeumorphicCard className="p-5 block group cursor-pointer transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-neu-text dark:text-neu-dark-text group-hover:text-accent transition-colors">
                      {story.title}
                    </h2>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/10 text-accent">
                      {story.surah_reference.split(":")[0]}
                    </span>
                  </div>
                  <p className="text-sm text-neu-muted dark:text-neu-dark-muted line-clamp-2">
                    {story.summary}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                     <span className="text-[10px] font-bold text-neu-muted dark:text-neu-dark-muted uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {story.lessons.length} {t("lessons") || "Pelajaran"}
                     </span>
                     <span className="text-accent text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        Baca →
                     </span>
                  </div>
                </NeumorphicCard>
              </Link>
            </motion.div>
          ))}
          
          {filteredStories.length === 0 && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-12 text-neu-muted dark:text-neu-dark-muted"
             >
               Sedang mencari hikmah lain...
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
