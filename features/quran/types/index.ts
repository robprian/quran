// ── Language ──────────────────────────────────────────────────────────────────
export type LanguageCode = "id" | "en";

// ── Surah / Chapter ──────────────────────────────────────────────────────────

export interface Surah {
  number: number;
  name: string;          // Arabic name
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

// ── Ayah / Verse ─────────────────────────────────────────────────────────────

export interface Ayah {
  number: number;           // Absolute ayah number (1–6236)
  text: string;             // Text for this edition
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
  audio?: string;           // Audio URL (only present in audio editions)
  audioSecondary?: string[];
}

// ── Merged Ayah (combines all 5 editions by numberInSurah) ────────────────────

export interface MergedAyah {
  numberInSurah: number;
  absoluteNumber: number;
  arabic: string;
  latin: string;           // Transliteration
  translationId: string;   // Indonesian
  translationEn: string;   // English
  audioUrl: string;        // CDN audio URL (Alafasy)
  juz: number;
  page: number;
}

export interface AyahEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: string | null;
  ayahs: Ayah[];
  // Extra fields present on per-surah editions:
  number?: number;
  revelationType?: string;
  englishNameTranslation?: string;
  numberOfAyahs?: number;
}

// Array of editions from /surah/{n}/editions/...
export type AyahEditions = AyahEdition[];

// ── API Response wrappers ─────────────────────────────────────────────────────

export interface APIResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface SurahDetailData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  editions: AyahEditions;
  mergedAyahs: MergedAyah[];  // Pre-merged and Bismillah-normalised
  /**
   * True when the surah normally has Bismillah but it was stripped from the
   * merged ayah list. The UI should render it as a decorative (non-ayah) header.
   * Always false for Surah 1 (Bismillah IS ayah 1) and Surah 9 (no Bismillah).
   */
  hasBismillahHeader: boolean;
}

// ── Audio ─────────────────────────────────────────────────────────────────────

export interface AudioState {
  currentAyahKey: string | null; // e.g. "2:255"
  isPlaying: boolean;
  isLoading: boolean;
  currentSurahNumber: number | null;
  currentAyahNumber: number | null;
}

// ── Bookmarks ─────────────────────────────────────────────────────────────────

export interface BookmarkItem {
  type: "ayah" | "dua";
  surahNumber?: number;
  ayahNumber?: number;
  duaId?: number;
  surahName?: string;
  ayahText: string;
  translation: string;
  savedAt: number; // timestamp
}

// ── Last Read ─────────────────────────────────────────────────────────────────

export interface LastRead {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
}

// ── Prayer Times ──────────────────────────────────────────────────────────────

export interface PrayerTime {
  name: string;
  nameId: string;   // Indonesian name
  time: string;     // HH:MM
}

export interface PrayerStatus {
  current: PrayerTime;
  next: PrayerTime;
  secondsUntilNext: number;
  all: PrayerTime[];
}

export interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface AladhanData {
  timings: AladhanTimings;
  date: {
    readable: string;
    timestamp: string;
    gregorian: { date: string };
    hijri: { date: string; month: { en: string }; year: string };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: { id: number; name: string };
  };
}

// ── Qibla ──────────────────────────────────────────────────────────────────────

export interface QiblaState {
  bearing: number;              // Static bearing to Kaaba from user location
  deviceHeading: number | null; // Live device compass heading
  hasPermission: boolean;
  hasOrientationSupport: boolean;
  locationGranted: boolean;
  error: string | null;
}

// ── Mosque ────────────────────────────────────────────────────────────────────

export interface Mosque {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distanceKm: number;
}

// ── Dua ───────────────────────────────────────────────────────────────────────

export interface Dua {
  id: number;
  title: string;
  titleId: string;
  arabic: string;
  latin: string;
  translationId: string;
  translationEn: string;
  source: string;
}
