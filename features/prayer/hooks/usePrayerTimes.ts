"use client";

import { useState, useEffect } from "react";
import { fetchPrayerTimes, getCachedPrayerTimes } from "../api/prayerApi";
import { MOCK_PRAYER_TIMES } from "@/lib/constants";
import type { AladhanTimings } from "@/features/quran/types";

export interface PrayerTimesResult {
  timings: AladhanTimings | null;
  city: string;
  country: string;
  isLoading: boolean;
  error: string | null;
  isUsingCache: boolean;
}

const PRAYER_NAMES_EN = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_NAMES_ID: Record<string, string> = {
  Fajr: "Subuh",
  Dhuhr: "Dzuhur",
  Asr: "Ashar",
  Maghrib: "Maghrib",
  Isha: "Isya",
};

export { PRAYER_NAMES_EN, PRAYER_NAMES_ID };

export function usePrayerTimes(): PrayerTimesResult {
  const [timings, setTimings] = useState<AladhanTimings | null>(null);
  const [city, setCity] = useState("Jakarta");
  const [country, setCountry] = useState("ID");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCache, setIsUsingCache] = useState(false);

  useEffect(() => {
    // Try cache first (instant)
    const cached = getCachedPrayerTimes();
    if (cached) {
      setTimings(cached.timings);
      setCity(cached.city);
      setCountry(cached.country);
      setIsLoading(false);
      setIsUsingCache(true);
      return;
    }

    setIsLoading(true);
    fetchPrayerTimes()
      .then(({ timings: t, city: c, country: co }) => {
        setTimings(t);
        setCity(c);
        setCountry(co);
        setIsUsingCache(false);
      })
      .catch((err) => {
        console.error("[usePrayerTimes]", err);
        // Fallback to mock
        setError(err?.message ?? "Location access denied");
        setTimings(MOCK_PRAYER_TIMES as any);
        setCity("Jakarta");
        setCountry("ID");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { timings, city, country, isLoading, error, isUsingCache };
}

/**
 * Get list of prayer times with Indonesian names
 */
export function getPrayerList(timings: AladhanTimings) {
  return PRAYER_NAMES_EN.map((name) => ({
    name,
    nameId: PRAYER_NAMES_ID[name] ?? name,
    time: timings[name as keyof AladhanTimings].slice(0, 5), // "HH:MM"
  }));
}
