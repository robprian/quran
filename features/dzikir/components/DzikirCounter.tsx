"use client";

import { motion } from "framer-motion";
import { useDzikirStore } from "../store/dzikirStore";
import { NeumorphicCard } from "@/components/neumorphism";
import { useLangStore } from "@/features/lang/store/langStore";
import { useEffect } from "react";

export function DzikirCounter() {
  const { t } = useLangStore();
  const { count, target, increment, reset } = useDzikirStore();

  const handleTap = () => {
    // Vibrate softly on tap (10ms)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    // Auto reset if we reached the target on the PREVIOUS click, so it restarts from 1.
    if (count >= target) {
      // Actually the user wants auto-reset or "Selesai", let's make it vibrate harder on exact completion
      reset();
      increment(); // start counting again immediately 
    } else {
       if (count + 1 === target) {
          // If we hit target this tap, give a specific vibration pattern to signify completion (e.g. 50ms)
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(50);
          }
       }
       increment();
    }
  };

  const isCompleted = count >= target;

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full max-w-sm mx-auto">
      
      {/* Target & Progress Info */}
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-neu-text dark:text-neu-dark-text">
          {count} / {target}
        </span>
        <span className="text-sm font-medium mt-1 text-neu-muted dark:text-neu-dark-muted">
           {isCompleted ? t("dzikir_completed") : t("dzikir_progress")}
        </span>
      </div>

      {/* Big Counter Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
        className="relative flex items-center justify-center w-64 h-64 rounded-full bg-neu-bg dark:bg-neu-dark-bg transition-colors duration-300 shadow-[8px_8px_16px_#c8cdd6,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#222222,-8px_-8px_16px_#323232] active:shadow-[inset_4px_4px_8px_#c8cdd6,inset_-4px_-4px_8px_#ffffff] dark:active:shadow-[inset_4px_4px_8px_#222222,inset_-4px_-4px_8px_#323232]"
      >
        <div className="absolute inset-2 rounded-full border border-white/20 dark:border-white/5 pointer-events-none" />
        
        {/* The Count Number */}
        <motion.span 
          key={count} 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-7xl font-bold text-accent dark:text-accent-light"
        >
          {count}
        </motion.span>
        
        {/* Subtle Ring Progress indicating completion ratio could go here, but a clean inner shadow is preferred */}
        {isCompleted && (
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="absolute -bottom-6 text-sm font-bold text-emerald-500"
           >
             {t("dzikir_done")}!
           </motion.div>
        )}
      </motion.button>

      {/* Reset Button */}
      <div className="pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
             if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(20);
             reset();
          }}
          className="px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 bg-neu-bg dark:bg-neu-dark-bg text-red-500/80 hover:text-red-500 shadow-[4px_4px_8px_#c8cdd6,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#2a2a2a,-4px_-4px_8px_#3e3e3e] active:shadow-[inset_2px_2px_4px_#c8cdd6,inset_-2px_-2px_4px_#ffffff] dark:active:shadow-[inset_2px_2px_4px_#2a2a2a,inset_-2px_-2px_4px_#3e3e3e]"
        >
          🔄 {t("reset")}
        </motion.button>
      </div>
    </div>
  );
}
