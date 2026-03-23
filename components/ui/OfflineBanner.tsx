"use client";

import { useOffline } from "@/features/quran/hooks/useOffline";
import { motion, AnimatePresence } from "framer-motion";

export function OfflineBanner() {
  const isOffline = useOffline();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-500 text-white text-sm font-semibold py-2.5 px-4 shadow-lg"
        >
          <span>📡</span>
          <span>You are offline — showing cached content</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
