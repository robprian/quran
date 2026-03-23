/**
 * Lightweight i18n system — no next-intl dependency.
 * Zustand langStore is the source of truth.
 * Use `useT()` hook in components, or `t()` with explicit lang.
 */

export type LangKey =
  | "home" | "quran" | "search" | "bookmark" | "play" | "pause"
  | "auto_play" | "stop" | "prayer_time" | "qibla" | "nearby_mosque"
  | "daily_dua" | "last_read" | "loading" | "error" | "retry"
  | "back" | "next_surah" | "prev_surah" | "ayah" | "ayahs"
  | "surah" | "juz" | "meccan" | "medinan" | "revelation"
  | "current_prayer" | "next_prayer" | "countdown" | "location"
  | "location_denied" | "location_default" | "data_from" | "method"
  | "playing" | "now" | "nearest" | "away" | "open_map"
  | "no_mosque" | "search_again" | "mosque_error" | "dua_not_found"
  | "duas_count" | "saved" | "save" | "surah_list" | "welcome"
  | "welcome_sub" | "quick_access" | "read_quran" | "read_quran_sub"
  | "compass_active" | "compass_inactive" | "enable_compass"
  | "kaaba_coords" | "qibla_bearing" | "static_bearing"
  | "auto_play_started" | "audio_unavailable" | "remove_bookmark"
  | "add_bookmark" | "juz_label" | "page_label"
  | "schedule_title" | "schedule_source" | "schedule_method"
  | "qibla_title" | "qibla_sub" | "mosque_title" | "mosque_sub"
  | "mosque_radius" | "dua_title" | "dua_sub" | "search_dua";

type Translations = Record<LangKey, string>;

const id: Translations = {
  home: "Beranda",
  quran: "Al-Qur'an",
  search: "Cari surat...",
  bookmark: "Tandai",
  play: "Putar",
  pause: "Jeda",
  auto_play: "Putar Otomatis",
  stop: "Berhenti",
  prayer_time: "Jadwal Sholat",
  qibla: "Arah Kiblat",
  nearby_mosque: "Masjid Terdekat",
  daily_dua: "Doa Harian",
  last_read: "Terakhir Dibaca",
  loading: "Memuat...",
  error: "Terjadi kesalahan",
  retry: "Coba Lagi",
  back: "Kembali",
  next_surah: "Surah Berikutnya",
  prev_surah: "Surah Sebelumnya",
  ayah: "Ayat",
  ayahs: "Ayat",
  surah: "Surah",
  juz: "Juz",
  meccan: "Makkiyah",
  medinan: "Madaniyah",
  revelation: "Turun di",
  current_prayer: "Waktu Sholat",
  next_prayer: "Sholat Berikutnya",
  countdown: "Hitung Mundur",
  location: "Lokasi",
  location_denied: "Izin lokasi ditolak. Tampilkan jadwal default Jakarta.",
  location_default: "Lokasi tidak tersedia, tampilkan default",
  data_from: "Data dari",
  method: "Metode",
  playing: "Memutar...",
  now: "▶ Sekarang",
  nearest: "terdekat",
  away: "dari lokasi",
  open_map: "🗺 Buka di peta →",
  no_mosque: "Tidak ada masjid ditemukan",
  search_again: "Cari Ulang",
  mosque_error: "Gagal mengambil data masjid",
  dua_not_found: "Doa tidak ditemukan",
  duas_count: "doa pilihan beserta dalil",
  saved: "Ditandai",
  save: "Simpan",
  surah_list: "Daftar Surah",
  welcome: "السَّلاَمُ عَلَيْكُمْ",
  welcome_sub: "Selamat datang kembali",
  quick_access: "Akses Cepat",
  read_quran: "Baca Al-Qur'an",
  read_quran_sub: "Semua 114 Surah beserta terjemahan",
  compass_active: "✓ Kompas aktif – arahkan ponsel",
  compass_inactive:
    "Kompas tidak tersedia. Nilai menunjukkan sudut statis dari lokasi Anda.",
  enable_compass: "Aktifkan Kompas",
  kaaba_coords: "Koordinat Ka'bah",
  qibla_bearing: "Sudut Qibla",
  static_bearing: "Sudut dari lokasi",
  auto_play_started: "Putar otomatis dimulai",
  audio_unavailable: "Audio tidak tersedia",
  remove_bookmark: "Hapus Tandai",
  add_bookmark: "Tandai Ayat",
  juz_label: "Juz",
  page_label: "Hal.",
  schedule_title: "Jadwal Sholat",
  schedule_source: "Data dari",
  schedule_method: "Metode",
  qibla_title: "🧭 Arah Qibla",
  qibla_sub: "Arah menuju Ka'bah",
  mosque_title: "📍 Masjid Terdekat",
  mosque_sub: "Dalam radius 5 km dari lokasi Anda",
  mosque_radius: "radius 5 km",
  dua_title: "🤲 Doa Harian",
  dua_sub: "doa pilihan beserta dalil",
  search_dua: "Cari doa...",
};

const en: Translations = {
  home: "Home",
  quran: "Quran",
  search: "Search surah...",
  bookmark: "Bookmark",
  play: "Play",
  pause: "Pause",
  auto_play: "Auto Play",
  stop: "Stop",
  prayer_time: "Prayer Times",
  qibla: "Qibla Direction",
  nearby_mosque: "Nearby Mosques",
  daily_dua: "Daily Duas",
  last_read: "Last Read",
  loading: "Loading...",
  error: "An error occurred",
  retry: "Retry",
  back: "Back",
  next_surah: "Next Surah",
  prev_surah: "Previous Surah",
  ayah: "Ayah",
  ayahs: "Ayahs",
  surah: "Surah",
  juz: "Juz",
  meccan: "Meccan",
  medinan: "Medinan",
  revelation: "Revealed in",
  current_prayer: "Current Prayer",
  next_prayer: "Next Prayer",
  countdown: "Countdown",
  location: "Location",
  location_denied: "Location permission denied. Showing default Jakarta schedule.",
  location_default: "Location unavailable, using default",
  data_from: "Data from",
  method: "Method",
  playing: "Playing...",
  now: "▶ Current",
  nearest: "nearest",
  away: "away",
  open_map: "🗺 Open in map →",
  no_mosque: "No mosques found nearby",
  search_again: "Search Again",
  mosque_error: "Failed to fetch mosque data",
  dua_not_found: "No duas found",
  duas_count: "selected duas with references",
  saved: "Saved",
  save: "Bookmark",
  surah_list: "Surah List",
  welcome: "السَّلاَمُ عَلَيْكُمْ",
  welcome_sub: "Peace be upon you · Welcome back",
  quick_access: "Quick Access",
  read_quran: "Read the Quran",
  read_quran_sub: "All 114 Surahs with translation",
  compass_active: "✓ Compass active – orient your phone",
  compass_inactive:
    "No compass sensor. Value shows static bearing from your location.",
  enable_compass: "Enable Compass",
  kaaba_coords: "Kaaba Coordinates",
  qibla_bearing: "Qibla Bearing",
  static_bearing: "Static bearing",
  auto_play_started: "Auto play started",
  audio_unavailable: "Audio not available",
  remove_bookmark: "Remove Bookmark",
  add_bookmark: "Add Bookmark",
  juz_label: "Juz",
  page_label: "Page",
  schedule_title: "Prayer Schedule",
  schedule_source: "Data from",
  schedule_method: "Method",
  qibla_title: "🧭 Qibla Direction",
  qibla_sub: "Direction towards the Holy Kaaba",
  mosque_title: "📍 Nearby Mosques",
  mosque_sub: "Within 5 km of your location",
  mosque_radius: "5 km radius",
  dua_title: "🤲 Daily Duas",
  dua_sub: "selected duas with references",
  search_dua: "Search duas...",
};

export const TRANSLATIONS = { id, en } as const;

/** Get translation for a specific key and language */
export function t(key: LangKey, lang: "id" | "en"): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key];
}
