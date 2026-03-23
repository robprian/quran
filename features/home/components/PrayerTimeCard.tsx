"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard } from "@/components/neumorphism";
import { usePrayerTimes, getPrayerList, PRAYER_NAMES_ID } from "@/features/prayer/hooks/usePrayerTimes";
import { minutesUntil, formatCountdown } from "@/lib/utils";
import { useLangStore } from "@/features/lang/store/langStore";

function getCurrentPrayerStatus(prayerList: { name: string; nameId: string; time: string }[]) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  let currentIdx = 0;
  for (let i = prayerList.length - 1; i >= 0; i--) {
    const [h, m] = prayerList[i].time.split(":").map(Number);
    if (nowMins >= h * 60 + m) { currentIdx = i; break; }
  }
  const nextIdx = (currentIdx + 1) % prayerList.length;
  return { current: prayerList[currentIdx], next: prayerList[nextIdx] };
}

export function PrayerTimeCard() {
  const { timings, city, country, isLoading, error } = usePrayerTimes();
  const { lang } = useLangStore();
  const [countdown, setCountdown] = useState(0);
  const [prayerList, setPrayerList] = useState<{ name: string; nameId: string; time: string }[]>([]);

  useEffect(() => {
    if (!timings) return;
    const list = getPrayerList(timings);
    setPrayerList(list);
    const { next } = getCurrentPrayerStatus(list);
    setCountdown(minutesUntil(next.time) * 60);
  }, [timings]);

  useEffect(() => {
    const t = setInterval(() => setCountdown((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (isLoading) return (
    <NeumorphicCard className="p-6 animate-pulse">
      <div className="h-8 bg-[#c8cdd6] dark:bg-[#2a2a2a] rounded-xl w-1/2 mb-3" />
      <div className="h-6 bg-[#c8cdd6] dark:bg-[#2a2a2a] rounded-xl w-3/4" />
    </NeumorphicCard>
  );

  if (!timings || prayerList.length === 0) return null;

  const { current, next } = getCurrentPrayerStatus(prayerList);
  const displayName = (p: { name: string; nameId: string }) => lang === "id" ? p.nameId : p.name;

  return (
    <NeumorphicCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-semibold text-neu-muted dark:text-neu-dark-muted uppercase tracking-widest mb-1">
            {lang === "id" ? "Waktu Sholat" : "Current Prayer"}
          </div>
          <div className="text-3xl font-bold text-neu-text dark:text-neu-dark-text">{displayName(current)}</div>
          <div className="text-sm text-neu-muted dark:text-neu-dark-muted">{current.time}</div>
        </div>
        <div className="text-right">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="text-5xl mb-1">🕌</motion.div>
          <div className="text-[10px] text-neu-muted dark:text-neu-dark-muted">{city}, {country}</div>
        </div>
      </div>

      {error && (
        <div className="text-[10px] text-amber-500 mb-2">⚠️ {lang === "id" ? "Lokasi tidak tersedia, tampilkan default" : "Location unavailable, using default"}</div>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-[#c8cdd6] dark:via-[#2a2a2a] to-transparent mb-4" />

      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-neu-muted dark:text-neu-dark-muted mb-0.5">
            {lang === "id" ? "Sholat berikutnya" : "Next prayer"}
          </div>
          <div className="font-semibold text-neu-text dark:text-neu-dark-text">
            {displayName(next)} · {next.time}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-neu-muted dark:text-neu-dark-muted mb-0.5">
            {lang === "id" ? "Hitung mundur" : "Countdown"}
          </div>
          <div className="font-mono font-bold text-accent text-xl">{formatCountdown(countdown)}</div>
        </div>
      </div>
    </NeumorphicCard>
  );
}
