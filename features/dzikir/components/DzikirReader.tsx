"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeumorphicButton, NeumorphicCard } from "@/components/neumorphism";
import { useLangStore } from "@/features/lang/store/langStore";

export interface DzikirItem {
  id: number;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  repeat: number;
}

interface DzikirReaderProps {
  type: "pagi" | "petang" | "sholat";
  data: DzikirItem[];
}

export function DzikirReader({ type, data }: DzikirReaderProps) {
  const { t } = useLangStore();
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [isClient, setIsClient] = useState(false);

  // Load saved progress
  useEffect(() => {
    setIsClient(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const savedKey = `dzikir_${type}_date`;
      const savedDate = localStorage.getItem(savedKey);
      
      if (savedDate !== today) {
         // New day, reset
         localStorage.removeItem(`dzikir_${type}_progress`);
         localStorage.setItem(savedKey, today);
      } else {
         const savedProgress = localStorage.getItem(`dzikir_${type}_progress`);
         if (savedProgress) setCounts(JSON.parse(savedProgress));
      }
    } catch (e) {}
  }, [type]);

  const handleTap = (id: number, target: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
    
    setCounts((prev) => {
      const current = prev[id] || 0;
      if (current >= target) return prev; // already done
      
      const nextCounts = { ...prev, [id]: current + 1 };
      
      // Vibrate harder if finished this item
      if (current + 1 === target) {
         if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(40);
      }
      
      // Save progress
      try {
        localStorage.setItem(`dzikir_${type}_progress`, JSON.stringify(nextCounts));
      } catch (e) {}
      
      return nextCounts;
    });
  };

  const getCompletedCount = () => {
    return data.filter((item) => (counts[item.id] || 0) >= item.repeat).length;
  };

  if (!isClient) return <div className="animate-pulse h-40 bg-neu-bg rounded-xl" />;

  const completedCount = getCompletedCount();
  const allCompleted = completedCount === data.length;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between px-2">
         <div className="text-sm font-semibold text-neu-muted dark:text-neu-dark-muted">
            {completedCount} / {data.length} {t("dzikir_done") || "Selesai"}
         </div>
         {allCompleted && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
              Alhamdulillah
            </span>
         )}
      </div>

      {/* List */}
      <AnimatePresence>
        {data.map((item, index) => {
          const count = counts[item.id] || 0;
          const isDone = count >= item.repeat;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NeumorphicCard className={`p-5 transition-all duration-500 overflow-hidden relative cursor-pointer ${isDone ? 'opacity-60 grayscale-[30%]' : ''}`} onClick={() => handleTap(item.id, item.repeat)}>
                
                {/* Completion Overlay subtle flash */}
                {isDone && (
                  <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay pointer-events-none" />
                )}

                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="font-bold text-accent dark:text-accent-light text-sm">
                    {item.title}
                  </h3>
                  <div className={`flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-full text-xs font-bold shadow-[inset_2px_2px_4px_#c8cdd6,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#2a2a2a,inset_-2px_-2px_4px_#3e3e3e] ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-neu-muted dark:text-neu-dark-muted'}`}>
                    {count} / {item.repeat}
                  </div>
                </div>

                <div className="text-right font-arabic text-2xl text-neu-text dark:text-neu-dark-text leading-loose mb-3">
                  {item.arabic}
                </div>
                
                <div className="text-sm text-neu-text dark:text-neu-dark-text mb-2 italic">
                  {item.latin}
                </div>
                
                <div className="text-xs text-neu-muted dark:text-neu-dark-muted leading-relaxed">
                  {item.translation}
                </div>

                {!isDone && (
                  <div className="mt-4 pt-3 border-t border-[#c8cdd6]/30 dark:border-[#2a2a2a]/30 text-center text-[10px] text-accent font-semibold uppercase tracking-widest">
                    {t("tap_increment") || "Ketuk untuk menghitung"}
                  </div>
                )}
              </NeumorphicCard>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
