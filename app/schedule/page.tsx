"use client";

import { motion } from "framer-motion";
import { NeumorphicCard } from "@/components/neumorphism";
import { usePrayerTimes, getPrayerList } from "@/features/prayer/hooks/usePrayerTimes";
import { useLangStore } from "@/features/lang/store/langStore";
import { ErrorUI } from "@/components/ui/ErrorUI";
import type { Metadata } from "next";

function isPrayerPassed(time: string): boolean {
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() >= h * 60 + m;
}

function isCurrentPrayer(list: { time: string }[], idx: number): boolean {
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
  const [h, m] = list[idx].time.split(":").map(Number);
  const thisMins = h * 60 + m;
  const nextMins = idx + 1 < list.length
    ? (() => { const [nh, nm] = list[idx + 1].time.split(":").map(Number); return nh * 60 + nm; })()
    : 24 * 60;
  return nowMins >= thisMins && nowMins < nextMins;
}

export default function SchedulePage() {
  const { timings, city, country, isLoading, error } = usePrayerTimes();
  const { lang } = useLangStore();

  const prayerList = timings ? getPrayerList(timings) : [];

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
        <h1 className="text-2xl font-bold text-neu-text dark:text-neu-dark-text">
          {lang === "id" ? "Jadwal Sholat" : "Prayer Schedule"}
        </h1>
        {!isLoading && (
          <p className="text-sm text-neu-muted dark:text-neu-dark-muted mt-1">
            📍 {city}, {country}
          </p>
        )}
      </motion.div>

      {error && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
          ⚠️ {lang === "id"
            ? "Izin lokasi ditolak. Menampilkan jadwal default Jakarta."
            : "Location permission denied. Showing default Jakarta schedule."}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#c8cdd6] dark:bg-[#2a2a2a] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : prayerList.length === 0 ? (
        <ErrorUI message={lang === "id" ? "Gagal memuat jadwal" : "Failed to load schedule"} />
      ) : (
        <div className="space-y-3">
          {prayerList.map((prayer, idx) => {
            const isCurrent = isCurrentPrayer(prayerList, idx);
            const passed = isPrayerPassed(prayer.time);

            return (
              <motion.div
                key={prayer.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
              >
                <NeumorphicCard
                  className={`px-5 py-4 flex items-center justify-between ${
                    isCurrent ? "ring-2 ring-accent/50" : ""
                  }`}
                  pressed={isCurrent}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                        isCurrent
                          ? "bg-gradient-to-br from-accent-light to-accent shadow-[2px_2px_6px_rgba(212,175,55,0.4)]"
                          : "bg-[#c8cdd6]/40 dark:bg-[#2a2a2a]/40"
                      }`}
                    >
                      {["🌅", "☀️", "🌤", "🌇", "🌙"][idx]}
                    </div>
                    <div>
                      <div className={`font-bold ${isCurrent ? "text-accent" : "text-neu-text dark:text-neu-dark-text"}`}>
                        {lang === "id" ? prayer.nameId : prayer.name}
                      </div>
                      {isCurrent && (
                        <div className="text-[10px] text-accent font-semibold uppercase tracking-wider">
                          {lang === "id" ? "▶ Sekarang" : "▶ Current"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`font-mono text-lg font-bold ${
                    isCurrent ? "text-accent" : passed ? "text-neu-muted dark:text-neu-dark-muted" : "text-neu-text dark:text-neu-dark-text"
                  }`}>
                    {prayer.time}
                  </div>
                </NeumorphicCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Hijri date info */}
      <NeumorphicCard className="p-4 text-center">
        <p className="text-xs text-neu-muted dark:text-neu-dark-muted">
          {lang === "id" ? "Data dari" : "Data from"}{" "}
          <span className="text-accent font-semibold">Aladhan API</span>
          {" · "}{lang === "id" ? "Metode" : "Method"}: Egyptian General Authority
        </p>
      </NeumorphicCard>
    </div>
  );
}
