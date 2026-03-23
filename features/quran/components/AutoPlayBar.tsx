"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioStore } from "@/features/quran/store/audioStore";
import { audioManager } from "@/lib/audio";
import { NeumorphicCard, NeumorphicButton } from "@/components/neumorphism";
import { useLangStore } from "@/features/lang/store/langStore";
import type { MergedAyah } from "@/features/quran/types";

interface AutoPlayBarProps {
  surahNumber: number;
  ayahs: MergedAyah[];
}

export function AutoPlayBar({ surahNumber, ayahs }: AutoPlayBarProps) {
  const { lang, t } = useLangStore();
  const {
    isAutoPlay,
    isPlaying,
    isLoading,
    currentAyahNumber,
    currentSurahNumber,
    currentAyahKey,
    startAutoPlay,
    stopAutoPlay,
    pauseAudio,
  } = useAudioStore();

  const isThisSurah = currentSurahNumber === surahNumber;
  const autoPlayActive = isAutoPlay && isThisSurah;

  // Keep a ref to avoid stale closure in onEnded
  const ayahsRef = useRef<MergedAyah[]>(ayahs);
  useEffect(() => { ayahsRef.current = ayahs; }, [ayahs]);

  /** Subscribe/unsubscribe AudioManager events to sync Zustand state */
  useEffect(() => {
    if (!autoPlayActive) return;

    const unsub = audioManager?.subscribe((k, playing, loading) => {
      const [s, a] = k.split(":");
      if (parseInt(s, 10) !== surahNumber) return;

      useAudioStore.setState({
        isPlaying: playing,
        isLoading: loading,
        currentAyahNumber: parseInt(a, 10),
        currentAyahKey: k,
      });

      // Automatically close AutoPlayBar if audioManager finished the sequence
      if (!playing && !loading && audioManager && !audioManager.isAutoPlay) {
         // Optionally trigger stopAutoPlay if completely done
         // but let's just make sure UI reflects accurately.
         const list = ayahsRef.current;
         if (list.length > 0 && parseInt(a, 10) === list[list.length - 1].numberInSurah) {
           useAudioStore.getState().stopAutoPlay();
         }
      }
    });

    return () => unsub?.();
  }, [autoPlayActive, surahNumber]);

  const handleStartAutoPlay = () => {
    const startNum = isThisSurah && currentAyahNumber ? currentAyahNumber : 1;
    const startIndex = ayahs.findIndex((a) => a.numberInSurah >= startNum && a.audioUrl);
    const actualStartIndex = startIndex !== -1 ? startIndex : ayahs.findIndex((a) => a.audioUrl);

    if (actualStartIndex === -1) return;

    startAutoPlay(surahNumber, ayahs, ayahs[actualStartIndex].numberInSurah);
    audioManager?.playSequential(ayahs, surahNumber, actualStartIndex);
  };

  const handlePauseResume = () => {
    if (isPlaying) {
      audioManager?.pause();
      pauseAudio();
    } else {
      audioManager?.resume();
    }
  };

  const handleStop = () => {
    audioManager?.stopPlayback();
    stopAutoPlay();
  };

  const currentAyah = ayahs.find((a) => a.numberInSurah === currentAyahNumber);
  const show = autoPlayActive || (isThisSurah && (isPlaying || isLoading) && !isAutoPlay);

  return (
    <>
      {/* Auto-play trigger button (top of surah) */}
      <div className="flex gap-2">
        {!autoPlayActive ? (
          <NeumorphicButton
            variant="flat"
            onClick={handleStartAutoPlay}
            className="flex items-center gap-2 px-4 text-sm font-semibold text-accent"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ▶▶
            </motion.span>
            {t("auto_play")}
          </NeumorphicButton>
        ) : (
          <>
            <NeumorphicButton variant="pressed" size="sm" onClick={handlePauseResume} className="text-accent text-sm font-semibold">
              {isPlaying ? `⏸ ${t("pause")}` : `▶ ${t("play")}`}
            </NeumorphicButton>
            <NeumorphicButton variant="flat" size="sm" onClick={handleStop} className="text-red-500 text-sm">
              ⏹ {t("stop")}
            </NeumorphicButton>
          </>
        )}
      </div>

      {/* Floating mini player for auto-play */}
      <AnimatePresence>
        {autoPlayActive && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
          >
            <NeumorphicCard className="max-w-3xl mx-auto px-5 py-3 flex items-center gap-4">
              {/* Bars */}
              <div className="flex items-center gap-0.5 flex-shrink-0 w-10">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                ) : isPlaying ? (
                  [0.4, 1, 0.6, 0.9, 0.5].map((s, i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [s, 1, s] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      className="w-1 bg-accent rounded-full h-5 origin-center"
                    />
                  ))
                ) : (
                  <span className="text-accent text-lg">⏸</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-accent uppercase tracking-wider">{t("auto_play")}</div>
                <div className="text-sm font-semibold text-neu-text dark:text-neu-dark-text truncate">
                  {t("surah")} {surahNumber} · {t("ayah")} {currentAyahNumber ?? "–"}
                  {isLoading ? ` · ${t("loading")}` : ""}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <NeumorphicButton size="sm" variant={isPlaying ? "pressed" : "flat"} onClick={handlePauseResume}>
                  {isLoading ? "⏳" : isPlaying ? "⏸" : "▶"}
                </NeumorphicButton>
                <NeumorphicButton size="sm" variant="flat" onClick={handleStop} className="text-red-400">
                  ⏹
                </NeumorphicButton>
              </div>
            </NeumorphicCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
