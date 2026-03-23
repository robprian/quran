"use client";

import { PrayerTimeCard } from "@/features/home/components/PrayerTimeCard";
import { MenuGrid } from "@/features/home/components/MenuGrid";
import { ProgressTracker } from "@/features/home/components/ProgressTracker";
import { AyatOfTheDay } from "@/features/home/components/AyatOfTheDay";
import { useLangStore } from "@/features/lang/store/langStore";
import Link from "next/link";

export default function HomePage() {
  const { t } = useLangStore();
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pt-2 pb-1">
        <h1 className="text-2xl font-bold text-neu-text dark:text-neu-dark-text">
          {t("welcome")}
        </h1>
        <p className="text-sm text-neu-muted dark:text-neu-dark-muted mt-1">
          {t("welcome_sub")}
        </p>
      </div>

      {/* Prayer Time */}
      <PrayerTimeCard />

      {/* Menu Grid */}
      <div>
        <h2 className="text-sm font-semibold text-neu-muted dark:text-neu-dark-muted mb-3 uppercase tracking-wider">
          {t("quick_access")}
        </h2>
        <MenuGrid />
      </div>

      {/* Progress */}
      <ProgressTracker />

      {/* Ayat of the Day */}
      <AyatOfTheDay />

      {/* Read Quran CTA */}
      <Link href="/quran">
        <div className="bg-gradient-to-br from-accent to-yellow-600 rounded-2xl p-5 flex items-center gap-4 shadow-[0_8px_24px_rgba(212,175,55,0.35)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.45)] transition-shadow duration-300 cursor-pointer">
          <span className="text-4xl">📖</span>
          <div>
            <div className="text-white font-bold text-base">{t("read_quran")}</div>
            <div className="text-yellow-100 text-sm">{t("read_quran_sub")}</div>
          </div>
          <div className="ml-auto text-white text-xl">→</div>
        </div>
      </Link>
    </div>
  );
}
