"use client";

import { useLangStore } from "@/features/lang/store/langStore";
import { motion } from "framer-motion";

export function LangSwitcher() {
  const { lang, setLang } = useLangStore();

  return (
    <div className="flex items-center gap-0.5 rounded-xl overflow-hidden shadow-neu-pressed dark:shadow-neu-dark-pressed p-0.5 bg-neu-bg dark:bg-neu-dark">
      <motion.button
        onClick={() => setLang("id")}
        whileTap={{ scale: 0.95 }}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
          lang === "id"
            ? "bg-gradient-to-br from-accent-light to-accent text-white shadow-[2px_2px_4px_rgba(212,175,55,0.4)]"
            : "text-neu-muted dark:text-neu-dark-muted hover:text-neu-text"
        }`}
        aria-label="Switch to Indonesian"
      >
        🇮🇩 ID
      </motion.button>
      <motion.button
        onClick={() => setLang("en")}
        whileTap={{ scale: 0.95 }}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
          lang === "en"
            ? "bg-gradient-to-br from-accent-light to-accent text-white shadow-[2px_2px_4px_rgba(212,175,55,0.4)]"
            : "text-neu-muted dark:text-neu-dark-muted hover:text-neu-text"
        }`}
        aria-label="Switch to English"
      >
        🇬🇧 EN
      </motion.button>
    </div>
  );
}
