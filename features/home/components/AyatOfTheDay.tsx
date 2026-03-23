"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard } from "@/components/neumorphism";
import { fetchSurahDetail } from "@/features/quran/api/quranApi";
import type { Ayah } from "@/features/quran/types";
import { useLangStore } from "@/features/lang/store/langStore";

// Use Al-Fatiha (surah 1) as daily ayah — deterministic based on date
function getDailyAyahIndex(): number {
  const day = new Date().getDate();
  return (day % 7) + 1; // ayahs 1–7 in Al-Fatiha
}

export function AyatOfTheDay() {
  const [arabicText, setArabicText] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [ayahNum, setAyahNum] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLangStore();

  useEffect(() => {
    fetchSurahDetail(1)
      .then((data) => {
        const idx = getDailyAyahIndex() - 1;
        const arabicAyah = data.editions?.[0]?.ayahs?.[idx];
        const engAyah = data.editions?.[1]?.ayahs?.[idx];
        const idAyah = data.editions?.[2]?.ayahs?.[idx];
        const transAyah = lang === "id" && idAyah ? idAyah : engAyah;
        if (arabicAyah && transAyah) {
          setArabicText(arabicAyah.text);
          setTranslation(transAyah.text);
          setAyahNum(arabicAyah.numberInSurah);
        }
      })
      .catch(() => {
        setArabicText("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ");
        setTranslation(lang === "id" ? "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang." : "In the name of Allah, the Entirely Merciful, the Especially Merciful.");
        setAyahNum(1);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  return (
    <NeumorphicCard className="p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -top-8 -right-8 text-[120px] opacity-5 select-none pointer-events-none">
        ☪
      </div>

      <div className="text-xs font-semibold text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
        <span>✨</span>
        <span>{t("ayat_of_day")} · 1:{ayahNum || "…"}</span>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-[#c8cdd6] dark:bg-[#2a2a2a] rounded w-full" />
          <div className="h-8 bg-[#c8cdd6] dark:bg-[#2a2a2a] rounded w-4/5 ml-auto" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p dir="rtl" className="font-arabic text-2xl leading-loose text-right text-neu-text dark:text-neu-dark-text mb-3">
            {arabicText}
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-[#c8cdd6] dark:via-[#2a2a2a] to-transparent mb-3" />
          <p className="text-sm text-neu-muted dark:text-neu-dark-muted italic leading-relaxed">
            {translation}
          </p>
        </motion.div>
      )}
    </NeumorphicCard>
  );
}
