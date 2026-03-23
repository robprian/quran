// App-wide constants

export const API_BASE_URL = "https://api.alquran.cloud/v1";

export const EDITIONS = {
  ARABIC: "quran-uthmani",
  ENGLISH: "en.asad",
} as const;

export const SURAH_COUNT = 114;

export const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

// Mock prayer times (local time)
export const MOCK_PRAYER_TIMES: Record<string, string> = {
  Fajr: "04:45",
  Dhuhr: "12:05",
  Asr: "15:25",
  Maghrib: "18:10",
  Isha: "19:30",
};

export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Al-Afasy" },
  { id: "ar.abdurrahmaansudais", name: "Abd Ar-Rahman As-Sudais" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
] as const;

export const MENU_ITEMS = [
  { id: "duas",     labelKey: "daily_dua",     icon: "🤲", href: "/duas" },
  { id: "dzikir",   labelKey: "dzikir",        icon: "📿", href: "/dzikir" },
  { id: "cerita",   labelKey: "cerita",        icon: "📖", href: "/cerita" },
  { id: "qibla",   labelKey: "qibla",         icon: "🧭", href: "/qibla" },
  { id: "schedule",labelKey: "prayer_time",   icon: "🕌", href: "/schedule" },
  { id: "mosque",  labelKey: "nearby_mosque", icon: "📍", href: "/mosque" },
] as const;


export const DB_NAME = "quran-app-db";
export const DB_VERSION = 2;  // Bumped: purge pre-Bismillah-normalisation cache
export const STORE_SURAHS = "surahs";
export const STORE_AYAHS = "ayahs";
