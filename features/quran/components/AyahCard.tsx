"use client";

import { memo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard, NeumorphicButton } from "@/components/neumorphism";
import { useAudioStore } from "@/features/quran/store/audioStore";
import { useBookmarkStore } from "@/features/quran/store/bookmarkStore";
import { useLangStore } from "@/features/lang/store/langStore";
import { audioManager } from "@/lib/audio";
import { vibrate } from "@/lib/utils";
import type { MergedAyah } from "@/features/quran/types";

interface AyahCardProps {
  ayah: MergedAyah;
  surahNumber: number;
  surahName: string;
}

export const AyahCard = memo(function AyahCard({ ayah, surahNumber, surahName }: AyahCardProps) {
  const { currentAyahKey, isPlaying, isLoading, pauseAudio, stop, startAutoPlay } = useAudioStore();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const { lang, t } = useLangStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const key = `${surahNumber}:${ayah.numberInSurah}`;
  const isActive = currentAyahKey === key;
  const isCurrentlyPlaying = isActive && isPlaying;
  const isCurrentlyLoading = isActive && isLoading;
  const bookmarked = isBookmarked(surahNumber, ayah.numberInSurah);
  const translation = lang === "id" ? ayah.translationId : ayah.translationEn;
  const audioDisabled = !ayah.audioUrl;

  // Auto-scroll when this ayah becomes active
  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive]);

  const handlePlayPause = () => {
    if (audioDisabled) return;
    vibrate(30);
    if (isCurrentlyPlaying) {
      audioManager?.pause();
      pauseAudio();
    } else if (isCurrentlyLoading) {
      audioManager?.stop();
      stop();
    } else {
      audioManager?.stop();
      audioManager?.setOnEnded(null); // disable auto-play when manual
      useAudioStore.setState({
        currentAyahKey: key,
        isPlaying: false,
        isLoading: true,
        currentSurahNumber: surahNumber,
        currentAyahNumber: ayah.numberInSurah,
        currentAudioUrl: ayah.audioUrl,
        isAutoPlay: false,
      });
      // Subscribe once for this play session
      const unsub = audioManager?.subscribe((k, playing, loading) => {
        if (k === key) {
          useAudioStore.setState({ isPlaying: playing, isLoading: loading });
          if (!playing && !loading) {
            useAudioStore.getState().stop();
            unsub?.();
          }
        }
      });
      audioManager?.play(ayah.audioUrl, key);
    }
  };

  const handleBookmark = () => {
    vibrate([20, 10, 20]);
    if (bookmarked) {
      removeBookmark(surahNumber, ayah.numberInSurah);
    } else {
      addBookmark({
        type: "ayah",
        surahNumber,
        ayahNumber: ayah.numberInSurah,
        surahName,
        ayahText: ayah.arabic,
        translation,
        savedAt: Date.now(),
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      id={`ayah-${ayah.numberInSurah}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`transition-transform duration-500 ${isCurrentlyPlaying ? "scale-105" : ""}`}>
        <NeumorphicCard
          className={`p-5 transition-all duration-500 ${
            isCurrentlyPlaying
              ? "border-2 border-[#D4AF37] shadow-[0_0_15px_#D4AF37] animate-pulse"
              : isCurrentlyLoading
              ? "border-2 border-[#D4AF37]/40"
              : "border-2 border-transparent"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {/* Ayah number badge */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[2px_2px_6px_rgba(212,175,55,0.4)] transition-all duration-300 ${
                isCurrentlyPlaying
                  ? "bg-gradient-to-br from-accent to-yellow-500"
                  : "bg-gradient-to-br from-accent-light to-accent"
              }`}
            >
              <span className="text-white text-xs font-bold">{ayah.numberInSurah}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <NeumorphicButton
                variant={isActive ? "pressed" : "flat"}
                size="sm"
                onClick={handlePlayPause}
                aria-label={
                  isCurrentlyPlaying
                    ? t("pause")
                    : audioDisabled
                    ? t("audio_unavailable")
                    : t("play")
                }
                className={`text-base min-w-[36px] ${audioDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {isCurrentlyLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                ) : isCurrentlyPlaying ? "⏸" : "▶"}
              </NeumorphicButton>
              <NeumorphicButton
                variant={bookmarked ? "pressed" : "flat"}
                size="sm"
                onClick={handleBookmark}
                aria-label={bookmarked ? t("remove_bookmark") : t("add_bookmark")}
                className={`text-base ${bookmarked ? "text-accent" : ""}`}
              >
                {bookmarked ? "🔖" : "🏷"}
              </NeumorphicButton>
            </div>
          </div>

          {/* Arabic */}
          <p
            dir="rtl"
            className={`font-arabic text-2xl leading-loose text-right mb-3 transition-colors duration-300 ${
              isCurrentlyPlaying
                ? "text-accent"
                : "text-neu-text dark:text-neu-dark-text"
            }`}
          >
            {ayah.arabic}
          </p>

          {/* Latin */}
          {ayah.latin && (
            <p className="text-xs text-neu-muted dark:text-neu-dark-muted italic leading-relaxed mb-3">
              {ayah.latin}
            </p>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-[#c8cdd6] dark:via-[#2a2a2a] to-transparent mb-3" />

          {/* Translation */}
          <p className="text-sm text-neu-text dark:text-neu-dark-text leading-relaxed">
            {translation || (
              <span className="text-neu-muted dark:text-neu-dark-muted italic">{t("loading")}</span>
            )}
          </p>

          {/* Playing equalizer animation */}
          {isCurrentlyPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex items-center gap-1.5"
            >
              {[0.3, 0.8, 0.5, 1.0, 0.6].map((defaultScale, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [defaultScale, 1, defaultScale] }}
                  transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, delay: i * 0.08 }}
                  className="w-1 bg-accent rounded-full h-5 origin-bottom"
                />
              ))}
              <span className="text-xs text-accent font-medium ml-1">{t("playing")}</span>
            </motion.div>
          )}
        </NeumorphicCard>
      </div>
    </motion.div>
  );
});
