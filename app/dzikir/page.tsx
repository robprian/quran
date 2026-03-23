"use client";

import { motion } from "framer-motion";
import { DzikirCounter } from "@/features/dzikir/components/DzikirCounter";
import { DzikirPresets } from "@/features/dzikir/components/DzikirPresets";
import { useLangStore } from "@/features/lang/store/langStore";
import { NeumorphicCard } from "@/components/neumorphism";

export default function DzikirPage() {
  const { t } = useLangStore();

  return (
    <div className="space-y-8 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2"
      >
        <h1 className="text-2xl font-bold text-neu-text dark:text-neu-dark-text">
          {t("dzikir")}
        </h1>
        <p className="text-sm text-neu-muted dark:text-neu-dark-muted mt-1">
          {t("dzikir_sub")}
        </p>
      </motion.div>

      <NeumorphicCard className="p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
          {/* Subtle decorative ornament */}
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <DzikirCounter />
      </NeumorphicCard>

      <DzikirPresets />
    </div>
  );
}
