"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LastRead } from "@/features/quran/types";

interface QuranStore {
  lastRead: LastRead | null;
  setLastRead: (data: LastRead) => void;
  clearLastRead: () => void;
}

export const useQuranStore = create<QuranStore>()(
  persist(
    (set) => ({
      lastRead: null,
      setLastRead: (data) => set({ lastRead: data }),
      clearLastRead: () => set({ lastRead: null }),
    }),
    { name: "quran-last-read" }
  )
);
