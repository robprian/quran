"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LanguageCode } from "@/features/quran/types";
import { t as translate, type LangKey } from "@/lib/i18n";

interface LangStore {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  /** Translation helper — use inside components */
  t: (key: LangKey) => string;
}

export const useLangStore = create<LangStore>()(
  persist(
    (set, get) => ({
      lang: "id",
      setLang: (lang) => set({ lang }),
      t: (key: LangKey) => translate(key, get().lang),
    }),
    { name: "quran-language" }
  )
);
