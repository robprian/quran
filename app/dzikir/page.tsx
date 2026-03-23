"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DzikirCounter } from "@/features/dzikir/components/DzikirCounter";
import { DzikirPresets } from "@/features/dzikir/components/DzikirPresets";
import { DzikirReader } from "@/features/dzikir/components/DzikirReader";
import { useLangStore } from "@/features/lang/store/langStore";
import { NeumorphicCard, NeumorphicButton } from "@/components/neumorphism";

// Import local static data
import dzikirData from "@/data/dzikir.json";
import sholatData from "@/data/dzikir-sholat.json";

type TabType = "tasbih" | "pagi" | "petang" | "sholat";

export default function DzikirPage() {
  const { t } = useLangStore();
  const [activeTab, setActiveTab] = useState<TabType>("tasbih");

  const TABS: { id: TabType; label: string }[] = [
    { id: "tasbih", label: "Tasbih" },
    { id: "pagi", label: "Pagi" },
    { id: "petang", label: "Petang" },
    { id: "sholat", label: "Setelah Sholat" },
  ];

  return (
    <div className="space-y-6 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2"
      >
        <h1 className="text-2xl font-bold text-neu-text dark:text-neu-dark-text">
          {t("dzikir") || "Dzikir & Doa"}
        </h1>
        <p className="text-sm text-neu-muted dark:text-neu-dark-muted mt-1">
          {t("dzikir_sub") || "Rutinitas harian dan tasbih digital"}
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-accent text-white shadow-[0_4px_12px_rgba(212,175,55,0.4)]"
                  : "bg-neu-bg dark:bg-neu-dark-bg text-neu-muted dark:text-neu-dark-muted shadow-[4px_4px_8px_#c8cdd6,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#2a2a2a,-4px_-4px_8px_#3e3e3e]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "tasbih" && (
             <div className="space-y-8">
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
          )}

          {activeTab === "pagi" && (
            <DzikirReader type="pagi" data={dzikirData.pagi} />
          )}

          {activeTab === "petang" && (
            <DzikirReader type="petang" data={dzikirData.petang} />
          )}

          {activeTab === "sholat" && (
            <DzikirReader type="sholat" data={sholatData} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
