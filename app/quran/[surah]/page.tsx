"use client";

import { use, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSurah } from "@/features/quran/hooks/useSurah";
import { AyahCard } from "@/features/quran/components/AyahCard";
import { AutoPlayBar } from "@/features/quran/components/AutoPlayBar";
import { AyatShimmer } from "@/components/ui/AyatShimmer";
import { ErrorUI } from "@/components/ui/ErrorUI";
import { useQuranStore } from "@/features/quran/store/quranStore";
import { NeumorphicButton } from "@/components/neumorphism";
import { useLangStore } from "@/features/lang/store/langStore";
import { SURAH_ID_TRANSLATION } from "@/constants/surah-id";

interface SurahPageProps {
  params: Promise<{ surah: string }>;
}

export default function SurahPage({ params }: SurahPageProps) {
  const { surah: surahParam } = use(params);
  const surahNumber = parseInt(surahParam, 10);
  const { data, isLoading, isError, refetch } = useSurah(surahNumber);
  const { lastRead, setLastRead } = useQuranStore();
  const { t, lang } = useLangStore();
  const scrolledRef = useRef(false);

  // Auto-scroll to last read ayah once data loads
  useEffect(() => {
    if (!scrolledRef.current && lastRead?.surahNumber === surahNumber && data) {
      const el = document.getElementById(`ayah-${lastRead.ayahNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        scrolledRef.current = true;
      }
    }
  }, [data, lastRead, surahNumber]);

  if (isLoading)
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 bg-[#c8cdd6] dark:bg-[#2a2a2a] rounded-xl animate-pulse" />
        <AyatShimmer />
      </div>
    );

  if (isError || !data)
    return <ErrorUI message={t("error")} onRetry={refetch} />;

  const { mergedAyahs } = data;

  if (!mergedAyahs || mergedAyahs.length === 0)
    return <ErrorUI message={t("error")} onRetry={refetch} />;

  const revelationType =
    data.revelationType === "Meccan"
      ? t("meccan")
      : data.revelationType === "Medinan"
      ? t("medinan")
      : data.revelationType;

  const meaning = lang === "id"
    ? (SURAH_ID_TRANSLATION[surahNumber] || "Tidak tersedia")
    : data.englishNameTranslation;

  return (
    <div className="space-y-4 pb-36">
      {/* Back button */}
      <Link href="/quran">
        <NeumorphicButton variant="flat" size="sm">← {t("back")}</NeumorphicButton>
      </Link>

      {/* Surah header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-accent-light/30 to-accent/20 dark:from-accent/10 dark:to-accent/5 rounded-2xl p-6 text-center"
      >
        <div className="text-sm text-accent font-semibold mb-1">{t("surah")} {surahNumber}</div>
        <h1 className="font-arabic text-4xl text-neu-text dark:text-neu-dark-text leading-relaxed mb-1">
          {data.name}
        </h1>
        <div className="text-xl font-bold text-neu-text dark:text-neu-dark-text">{data.englishName}</div>
        <div className="text-sm text-neu-muted dark:text-neu-dark-muted">{meaning}</div>
        <div className="flex items-center justify-center gap-3 mt-3 text-xs text-neu-muted dark:text-neu-dark-muted">
          <span className="px-3 py-1 rounded-full bg-[#c8cdd6]/50 dark:bg-[#2a2a2a]/50">{revelationType}</span>
          <span>{mergedAyahs.length} {t("ayahs")}</span>
          <span>{t("juz")} {mergedAyahs[0]?.juz}</span>
        </div>
      </motion.div>

      {/* Bismillah decorative header */}
      {data.hasBismillahHeader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-3 rounded-2xl bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 dark:from-accent/5 dark:via-accent/8 dark:to-accent/5"
        >
          <p className="font-arabic text-2xl text-accent leading-loose">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-[10px] text-neu-muted dark:text-neu-dark-muted mt-1 italic">
            Bismillāhir-Raḥmānir-Raḥīm
          </p>
        </motion.div>
      )}

      {/* Auto-play bar */}
      <AutoPlayBar surahNumber={surahNumber} ayahs={mergedAyahs} />

      {/* Ayah list */}
      <div className="space-y-3">
        {mergedAyahs.map((ayah) => (
          <div
            key={ayah.numberInSurah}
            onMouseEnter={() =>
              setLastRead({
                surahNumber,
                ayahNumber: ayah.numberInSurah,
                surahName: data.englishName,
              })
            }
          >
            <AyahCard
              ayah={ayah}
              surahNumber={surahNumber}
              surahName={data.englishName}
            />
          </div>
        ))}
      </div>

      {/* Prev / Next navigation */}
      <div className="flex gap-3 pt-4">
        {surahNumber > 1 && (
          <Link href={`/quran/${surahNumber - 1}`} className="flex-1">
            <NeumorphicButton variant="flat" className="w-full">← {t("prev_surah")}</NeumorphicButton>
          </Link>
        )}
        {surahNumber < 114 && (
          <Link href={`/quran/${surahNumber + 1}`} className="flex-1">
            <NeumorphicButton variant="flat" className="w-full">{t("next_surah")} →</NeumorphicButton>
          </Link>
        )}
      </div>
    </div>
  );
}
