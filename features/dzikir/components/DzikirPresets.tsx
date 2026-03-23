"use client";

import { motion } from "framer-motion";
import { useDzikirStore } from "../store/dzikirStore";
import { NeumorphicCard } from "@/components/neumorphism";
import { useLangStore } from "@/features/lang/store/langStore";

const PRESETS = [
  { label: "Subhanallah", target: 33 },
  { label: "Alhamdulillah", target: 33 },
  { label: "Allahu Akbar", target: 34 },
  { label: "Lailahaillallah", target: 100 },
];

export function DzikirPresets() {
  const { t } = useLangStore();
  const { target, setTarget } = useDzikirStore();

  return (
    <div className="w-full max-w-sm mx-auto">
      <h3 className="text-sm font-semibold text-neu-muted dark:text-neu-dark-muted mb-4 px-2">
        {t("dzikir_presets")}:
      </h3>
      <div className="flex flex-col gap-3">
        {PRESETS.map((preset) => (
          <motion.button
            key={preset.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
               if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(15);
               setTarget(preset.target);
            }}
            className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${
              target === preset.target
                ? "bg-accent/10 border-accent/20 dark:bg-accent/20"
                : "bg-neu-bg dark:bg-neu-dark-bg border-transparent"
            } border shadow-[4px_4px_8px_#c8cdd6,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#2a2a2a,-4px_-4px_8px_#3e3e3e] active:shadow-[inset_2px_2px_4px_#c8cdd6,inset_-2px_-2px_4px_#ffffff] dark:active:shadow-[inset_2px_2px_4px_#2a2a2a,inset_-2px_-2px_4px_#3e3e3e]`}
          >
            <span className={`font-semibold ${target === preset.target ? "text-accent" : "text-neu-text dark:text-neu-dark-text"}`}>
              {preset.label}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-neu-bg dark:bg-neu-dark-bg shadow-[inset_2px_2px_4px_#c8cdd6,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#2a2a2a,inset_-2px_-2px_4px_#3e3e3e] text-neu-muted dark:text-neu-dark-muted">
              {preset.target}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
