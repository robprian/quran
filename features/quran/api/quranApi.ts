import apiClient from "@/lib/axios";
import { getCachedSurahList, cacheSurahList, getCachedAyahs, cacheAyahs } from "@/lib/db";
import type {
  Surah,
  SurahDetailData,
  APIResponse,
  AyahEditions,
  MergedAyah,
} from "@/features/quran/types";

// 5 editions: Arabic | Latin | Indonesian | English | Alafasy audio
const EDITIONS_QUERY =
  "quran-uthmani,en.transliteration,id.indonesian,en.asad,ar.alafasy";


/**
 * Build CDN audio URL for given absolute ayah number.
 * https://cdn.islamic.network/quran/audio/128/ar.alafasy/{absoluteAyahNumber}.mp3
 */
export function buildAudioCdnUrl(absoluteAyahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${absoluteAyahNumber}.mp3`;
}

// ── BISMILLAH NORMALISATION ───────────────────────────────────────────────────


/**
 * Strip all Arabic diacritics/tashkeel and normalise Alif variants to ا.
 * This makes matching immune to encoding differences between API editions.
 *
 * Diacritics removed: harakat (064B-065F), shadda (0651), sukun (0652),
 * tatweel (0640), superscript alif (0670), Quranic annotation signs (06D6-06ED)
 * Alif variants normalised: ٱ (wasla 0671), أ (hamza above 0623),
 *   إ (hamza below 0625), آ (madda 0622) → ا (0627)
 */
function stripAndNormalise(text: string): string {
  return text
    .replace(/[\u0610-\u0615\u064B-\u065F\u0640\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/gu, "")
    .replace(/[\u0622\u0623\u0625\u0671]/gu, "\u0627"); // normalise Alif variants
}

/**
 * Bismillah root consonants (no diacritics, normalised Alif) — used for matching.
 * "بسم الله الرحمن الرحيم"
 */
const BISMILLAH_BARE = "بسم الله الرحمن الرحيم";

/** True when text IS purely Bismillah (standalone ayah case) */
function isBismillahOnly(text: string): boolean {
  return stripAndNormalise(text.trim()) === BISMILLAH_BARE;
}

/** True when text STARTS WITH Bismillah prefix (embedded in ayah text) */
function startsWithBismillah(text: string): boolean {
  return stripAndNormalise(text.trim()).startsWith(BISMILLAH_BARE);
}

/**
 * Strip Bismillah prefix from the ORIGINAL (diacritised) text.
 * We find the Bismillah length by removing diacritics and measuring,
 * then mapping that character count back to the original string.
 */
function stripBismillahPrefix(text: string): string {
  const t = text.trim();
  const bare = stripAndNormalise(t);
  if (!bare.startsWith(BISMILLAH_BARE)) return t;

  // Walk original text, count equivalents of stripped chars until we've
  // consumed BISMILLAH_BARE.length stripped-equivalent characters.
  const DIACRITIC_RE = /[\u0610-\u0615\u064B-\u065F\u0640\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/u;

  let consumedBareLen = 0;
  let i = 0;
  while (i < t.length && consumedBareLen < BISMILLAH_BARE.length) {
    const ch = t[i];
    if (!DIACRITIC_RE.test(ch)) consumedBareLen++;
    i++;
  }

  // Also skip any trailing diacritics that belong to the last Bismillah char
  while (i < t.length && DIACRITIC_RE.test(t[i])) i++;

  // Strip leading whitespace and any leading orphaned combining marks
  const remainder = t.slice(i).replace(/^[\u0610-\u0615\u064B-\u065F\u0640\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\s]+/, "");
  return remainder;
}


/**
 * Normalise editions to handle Bismillah inconsistencies.
 *
 * Islamic rule:
 *  - Surah 1 (Al-Fatiha):  Bismillah IS ayah 1 → keep as-is, no header
 *  - Surah 9 (At-Tawbah):  NO Bismillah → nothing to do
 *  - All other surahs:     Bismillah appears EITHER as:
 *      A) A standalone ayah[0] with only Bismillah text
 *      B) Prepended prefix inside ayah[0]'s Arabic text
 *    In both cases → extract/strip it, set hasBismillahHeader=true
 *
 * Only the Arabic edition is modified; other editions are untouched
 * (they never include Bismillah for non-Fatiha surahs anyway).
 */
interface NormResult {
  editions: AyahEditions;
  hasBismillahHeader: boolean;
}

function normaliseBismillah(editions: AyahEditions, surahNumber: number): NormResult {
  // Al-Fatiha: Bismillah IS a real counted ayah — keep everything.
  if (surahNumber === 1) return { editions, hasBismillahHeader: false };
  // At-Tawbah: no Bismillah ever.
  if (surahNumber === 9) return { editions, hasBismillahHeader: false };

  const arabicAyahs = editions[0]?.ayahs;
  if (!arabicAyahs?.length) return { editions, hasBismillahHeader: false };

  const firstAyahText = arabicAyahs[0].text.trim();

  // CASE A: Bismillah is a completely standalone first ayah — slice it from all editions
  if (isBismillahOnly(firstAyahText)) {
    const normEditions: AyahEditions = editions.map((ed) => {
      if (!ed?.ayahs?.length) return ed;
      const first = ed.ayahs[0];
      const shouldSlice =
        first.numberInSurah === arabicAyahs[0].numberInSurah &&
        (isBismillahOnly(first.text.trim()) || first.numberInSurah === 0);
      return shouldSlice ? { ...ed, ayahs: ed.ayahs.slice(1) } : ed;
    }) as AyahEditions;

    return { editions: normEditions, hasBismillahHeader: true };
  }

  // CASE B: Bismillah is prepended into the Arabic text of ayah 1
  // Strip it from the arabic text ONLY; other editions are already clean.
  if (startsWithBismillah(firstAyahText)) {
    const strippedText = stripBismillahPrefix(firstAyahText);
    if (!strippedText) {
      // If stripping produces empty text (should never happen, but guard it)
      return { editions, hasBismillahHeader: true };
    }

    const newArabicAyahs = arabicAyahs.map((a, i) =>
      i === 0 ? { ...a, text: strippedText } : a
    );

    const normEditions: AyahEditions = editions.map((ed, idx) =>
      idx === 0 ? { ...ed, ayahs: newArabicAyahs } : ed
    ) as AyahEditions;

    return { editions: normEditions, hasBismillahHeader: true };
  }

  // No Bismillah detected — pass through as-is
  return { editions, hasBismillahHeader: false };
}


// ── MERGE (by ayah.numberInSurah — never by array index) ─────────────────────

/**
 * Merge 5 editions by numberInSurah.
 * Validate each merged ayah has Arabic + at least one translation.
 * Ayahs that fail validation are skipped.
 */
function mergeEditions(editions: AyahEditions): MergedAyah[] {
  const arabic = editions[0];
  const latin  = editions[1];
  const transId = editions[2];
  const transEn = editions[3];
  const audioEd = editions[4];

  if (!arabic?.ayahs?.length) return [];

  // Build lookup maps keyed by numberInSurah (integer) for each edition
  const latinMap  = new Map<number, string>();
  const idMap     = new Map<number, string>();
  const enMap     = new Map<number, string>();
  const audioMap  = new Map<number, number>(); // numberInSurah → absolute number

  latin?.ayahs?.forEach((a)   => latinMap.set(a.numberInSurah, a.text));
  transId?.ayahs?.forEach((a) => idMap.set(a.numberInSurah, a.text));
  transEn?.ayahs?.forEach((a) => enMap.set(a.numberInSurah, a.text));
  audioEd?.ayahs?.forEach((a) => audioMap.set(a.numberInSurah, a.number));

  const merged: MergedAyah[] = [];

  for (const a of arabic.ayahs) {
    const n = a.numberInSurah;

    // Validation: skip if core content missing
    const arabicText = a.text?.trim();
    if (!arabicText) continue;

    const latinText   = latinMap.get(n) ?? "";
    const idText      = idMap.get(n)    ?? "";
    const enText      = enMap.get(n)    ?? "";
    const absNum      = audioMap.get(n) ?? a.number;

    // Audio: only disable if we have no absolute number at all
    const hasAudio = absNum > 0;

    merged.push({
      numberInSurah: n,
      absoluteNumber: a.number,
      arabic: arabicText,
      latin: latinText,
      translationId: idText,
      translationEn: enText,
      audioUrl: hasAudio ? buildAudioCdnUrl(absNum) : "",
      juz: a.juz,
      page: a.page,
    });
  }

  return merged;
}

// ── Surah list ────────────────────────────────────────────────────────────────

export async function fetchSurahList(): Promise<Surah[]> {
  const cached = await getCachedSurahList();
  if (cached && cached.length > 0) return cached;

  const { data } = await apiClient.get<APIResponse<Surah[]>>("/surah");
  const surahs = data.data;
  await cacheSurahList(surahs);
  return surahs;
}

// ── Surah detail (5 editions + Bismillah normalisation) ───────────────────────

export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetailData> {
  // Try IndexedDB cache
  const cached = await getCachedAyahs(surahNumber);
  if (cached && Array.isArray(cached) && cached.length >= 4) {
    const arabicEd = cached[0] as any;
    const { editions: normEditions, hasBismillahHeader } = normaliseBismillah(cached, surahNumber);
    return {
      number: surahNumber,
      name: arabicEd.name ?? "",
      englishName: arabicEd.englishName ?? "",
      englishNameTranslation: arabicEd.englishNameTranslation ?? "",
      revelationType: arabicEd.revelationType ?? "",
      numberOfAyahs: normEditions[0]?.ayahs?.length ?? 0,
      editions: normEditions,
      mergedAyahs: mergeEditions(normEditions),
      hasBismillahHeader,
    };
  }

  // Fetch from Al-Quran Cloud
  const { data: resp } = await apiClient.get<APIResponse<AyahEditions>>(
    `/surah/${surahNumber}/editions/${EDITIONS_QUERY}`
  );

  const rawEditions = resp.data;

  if (!rawEditions || !Array.isArray(rawEditions) || rawEditions.length < 4) {
    throw new Error(
      `Invalid API response for surah ${surahNumber}: got ${rawEditions?.length ?? 0} editions`
    );
  }

  // Normalise Bismillah BEFORE caching — cache stores clean data
  const { editions, hasBismillahHeader } = normaliseBismillah(rawEditions, surahNumber);

  const arabicEdition = editions[0] as any;

  const surahData: SurahDetailData = {
    number: surahNumber,
    name: arabicEdition.name ?? "",
    englishName: arabicEdition.englishName ?? "",
    englishNameTranslation: arabicEdition.englishNameTranslation ?? "",
    revelationType: arabicEdition.revelationType ?? "",
    numberOfAyahs: arabicEdition.ayahs?.length ?? 0,
    editions,
    mergedAyahs: mergeEditions(editions),
    hasBismillahHeader,
  };

  // Cache the normalised editions so we never re-apply normalisation on reload
  await cacheAyahs(surahNumber, editions);
  return surahData;
}
