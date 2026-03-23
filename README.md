# Quran App – القرآن الكريم

A modern, offline-ready **Progressive Web App (PWA)** for reading and listening to the Holy Quran, featuring a beautiful **Neumorphic (Soft UI)** design.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Installable-purple)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📖 **Quran Reader** | All 114 Surahs with Arabic, Latin transliteration, and translation |
| 🌐 **Bilingual** | Indonesian (default) & English — switch anytime |
| 🔊 **Audio Playback** | Verse-by-verse with Mishary Al-Afasy via CDN |
| 🕌 **Prayer Times** | Real-time from Aladhan API, auto-detects your city |
| 🧭 **Qibla Direction** | Live compass via Device Orientation API |
| 📍 **Nearby Mosques** | OpenStreetMap Overpass API, sorted by distance |
| 📿 **Daily Duas** | 20+ curated duas with Arabic, Latin, and translation |
| 🔖 **Bookmarks** | Save ayahs and duas, persisted to localStorage |
| 📴 **Offline Support** | IndexedDB cache for Surah list and ayah data |
| 🎨 **Neumorphism UI** | Soft-shadow design system with dark mode |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev        # → http://localhost:3000

# Production build
npm run build
npm run start

# Run tests
npm run test
```

---

## 🗂 Project Structure

```
quran_web/
├── app/
│   ├── layout.tsx          # Root layout (PWA meta, fonts, providers)
│   ├── page.tsx            # Home (prayer card, menu, progress, ayat of day)
│   ├── quran/
│   │   ├── page.tsx        # Surah list with search
│   │   └── [surah]/
│   │       └── page.tsx    # Surah detail (ayahs, audio, Bismillah header)
│   ├── schedule/page.tsx   # Full prayer schedule
│   ├── qibla/page.tsx      # Qibla compass
│   ├── mosque/page.tsx     # Nearby mosques
│   └── duas/page.tsx       # Daily duas
├── features/
│   ├── quran/
│   │   ├── api/quranApi.ts     # 5-edition Quran API, Bismillah normalisation
│   │   ├── components/         # AyahCard, AudioPlayer, SurahCard, SurahList, SearchBar
│   │   ├── hooks/              # useSurah, useSurahs, useDebounce, useOffline
│   │   ├── store/              # audioStore, bookmarkStore, quranStore
│   │   └── types/index.ts      # All TypeScript types (MergedAyah, etc.)
│   ├── prayer/
│   │   ├── api/prayerApi.ts    # Aladhan + Nominatim reverse geocode
│   │   └── hooks/usePrayerTimes.ts
│   ├── home/components/       # PrayerTimeCard, MenuGrid, ProgressTracker, AyatOfTheDay
│   └── lang/store/langStore.ts # Language switcher (ID/EN)
├── components/
│   ├── neumorphism/         # NeumorphicCard, NeumorphicButton, NeumorphicInput
│   ├── ui/                  # LangSwitcher, OfflineBanner, ErrorUI, AyatShimmer
│   └── layout/             # Navbar, Providers, PWAInstallPrompt
├── lib/
│   ├── audio.ts             # AudioManager singleton (canplay event, loading state)
│   ├── axios.ts             # Axios instance with interceptors
│   ├── db.ts                # IndexedDB wrapper (idb)
│   ├── duas.ts              # Local duas dataset (20 duas)
│   ├── utils.ts             # cn(), debounce, formatCountdown, minutesUntil
│   └── constants.ts         # API URLs, DB config, menu items, reciters
├── public/
│   ├── manifest.json        # PWA manifest (shortcuts, icons)
│   └── icons/               # icon-192.png, icon-512.png
└── __tests__/              # Unit tests (useSurahs, SurahCard)
```

---

## 🌐 APIs Used

| API | Purpose | Key Required |
|---|---|---|
| `api.alquran.cloud/v1` | Quran text (5 editions), surah list | ❌ Free |
| `cdn.islamic.network` | Audio CDN (Alafasy 128kbps) | ❌ Free |
| `api.aladhan.com/v1` | Prayer times by city | ❌ Free |
| `nominatim.openstreetmap.org` | Reverse geocode (city/country) | ❌ Free |
| `overpass-api.de` | Nearby mosques (OSM data) | ❌ Free |

---

## 📖 Quran Data Architecture

### 5-Edition Merge

Each surah fetches **5 editions simultaneously** and merges them by `ayah.numberInSurah` (never by array index):

| Index | Edition Identifier | Content |
|---|---|---|
| 0 | `quran-uthmani` | Arabic (Uthmani script) |
| 1 | `en.transliteration` | Latin transliteration |
| 2 | `id.indonesian` | Indonesian translation |
| 3 | `en.asad` | English translation (Muhammad Asad) |
| 4 | `ar.alafasy` | Audio absolute ayah numbers |

### Bismillah Normalisation (Critical Accuracy Patch)

The API inconsistency where some editions include Bismillah as ayah 1 while others don't is handled by `normaliseBismillah()`:

```
Surah 1  (Al-Fatiha)  → Keep as-is — Bismillah IS a real counted ayah
Surah 9  (At-Tawbah) → No Bismillah at all (Islamic rule)
All others           → Strip Bismillah-only ayah from ALL arrays,
                       set hasBismillahHeader=true
                       → Render it as a styled decorative header (no audio, no number)
```

This guarantees every `MergedAyah` has:
- `arabic` — correct verse text
- `latin` — correct transliteration
- `translationId` — correct Indonesian
- `translationEn` — correct English
- `audioUrl` — correct CDN URL (empty → play button disabled)

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 |
| Styling | TailwindCSS v4 with `@theme` tokens |
| State | Zustand 5 + persist middleware |
| Data Fetching | TanStack React Query v5 |
| HTTP | Axios |
| Animation | Framer Motion |
| Offline DB | IndexedDB via `idb` |
| Audio | HTML5 Audio API (AudioManager singleton) |

---

## 🎨 Design System

The app uses a **Neumorphism (Soft UI)** design with custom TailwindCSS v4 tokens:

```css
/* Light mode */
--color-neu-bg: #E0E5EC;
--color-accent: #D4AF37;

/* Neumorphic shadows */
.shadow-neu-flat    { box-shadow: 8px 8px 16px #A3B1C6, -8px -8px 16px #FFFFFF; }
.shadow-neu-pressed { box-shadow: inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF; }
```

---

## 🧪 Testing

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
```

Tests cover:
- `useSurahs` hook (loading, success, error states)
- `SurahCard` component (name, translation, ayah count rendering)

---

## 📲 PWA Installation

The app is installable on:
- **Android** — Chrome shows an install banner automatically
- **iOS** — Safari → Share → Add to Home Screen
- **Desktop** — Chrome/Edge shows install icon in address bar

Offline capabilities: IndexedDB caches the surah list and ayah data after first load.

---

## 📜 License

MIT — Free for personal and educational use.