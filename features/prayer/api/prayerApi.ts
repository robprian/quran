import axios from "axios";
import type { AladhanData, AladhanTimings } from "@/features/quran/types";

const ALADHAN_BASE = "https://api.aladhan.com/v1";
const PRAYER_CACHE_KEY = "quran-prayer-cache";

interface CachedPrayer {
  date: string; // "YYYY-MM-DD"
  city: string;
  country: string;
  timings: AladhanTimings;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function getCachedPrayerTimes(): CachedPrayer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PRAYER_CACHE_KEY);
    if (!raw) return null;
    const parsed: CachedPrayer = JSON.parse(raw);
    if (parsed.date === todayStr()) return parsed;
    return null;
  } catch {
    return null;
  }
}

function savePrayerCache(data: CachedPrayer) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify(data));
  } catch {}
}

/**
 * Reverse geocode lat/lng → { city, country } using Nominatim
 */
export async function reverseGeocode(lat: number, lon: number): Promise<{ city: string; country: string }> {
  const resp = await axios.get("https://nominatim.openstreetmap.org/reverse", {
    params: { lat, lon, format: "json" },
    headers: { "Accept-Language": "en" },
    timeout: 8000,
  });
  const addr = resp.data.address;
  const city =
    addr.city || addr.town || addr.village || addr.county || addr.state || "Jakarta";
  const country = addr.country_code?.toUpperCase() || "ID";
  return { city, country };
}

/**
 * Fetch prayer times for a city/country via Aladhan API
 * method=11 = Egyptian General Authority of Survey
 */
export async function fetchPrayerTimesForCity(
  city: string,
  country: string
): Promise<AladhanTimings> {
  const { data } = await axios.get<{ code: number; data: AladhanData }>(
    `${ALADHAN_BASE}/timingsByCity`,
    {
      params: { city, country, method: 11 },
      timeout: 10000,
    }
  );
  return data.data.timings;
}

/**
 * Main function: get user location → fetch prayer times → cache → return
 */
export async function fetchPrayerTimes(): Promise<{
  timings: AladhanTimings;
  city: string;
  country: string;
}> {
  // 1. Check cache
  const cached = getCachedPrayerTimes();
  if (cached) {
    return { timings: cached.timings, city: cached.city, country: cached.country };
  }

  // 2. Get geolocation
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) reject(new Error("Geolocation not supported"));
    else navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
  });

  const { latitude: lat, longitude: lon } = position.coords;

  // 3. Reverse geocode
  const { city, country } = await reverseGeocode(lat, lon);

  // 4. Fetch timings
  const timings = await fetchPrayerTimesForCity(city, country);

  // 5. Cache
  savePrayerCache({ date: todayStr(), city, country, timings });

  return { timings, city, country };
}
