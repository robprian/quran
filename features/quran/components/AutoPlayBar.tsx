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

  /** Play a specific ayah */
  const playAyah = useCallback((ayah: MergedAyah) => {
    const key = `${surahNumber}:${ayah.numberInSurah}`;
    useAudioStore.setState({
      currentAyahKey: key,
      isPlaying: false,
      isLoading: true,
      currentSurahNumber: surahNumber,
      currentAyahNumber: ayah.numberInSurah,
      currentAudioUrl: ayah.audioUrl,
    });
    audioManager?.play(ayah.audioUrl, key);
  }, [surahNumber]);

  /** Auto-next: called when an ayah ends */
  const handleEnded = useCallback((endedKey: string) => {
    const state = useAudioStore.getState();
    if (!state.isAutoPlay || state.currentSurahNumber !== surahNumber) return;

    // Find the ayah that just ended and play the next one
    const [, endedNumStr] = endedKey.split(":");
    const endedNum = parseInt(endedNumStr, 10);
    const list = ayahsRef.current;
    const nextAyah = list.find((a) => a.numberInSurah === endedNum + 1);

    if (nextAyah && nextAyah.audioUrl) {
      playAyah(nextAyah);
    } else if (nextAyah) {
      // Skip ayahs without audio
      const withAudio = list.find((a) => a.numberInSurah > endedNum && a.audioUrl);
      if (withAudio) {
        playAyah(withAudio);
      } else {
        useAudioStore.getState().stopAutoPlay();
        audioManager?.setOnEnded(null);
      }
    } else {
      // End of surah
      useAudioStore.getState().stopAutoPlay();
      audioManager?.setOnEnded(null);
    }
  }, [surahNumber, playAyah]);

  /** Subscribe/unsubscribe AudioManager events to sync Zustand state */
  useEffect(() => {
    if (!autoPlayActive) return;

    const unsub = audioManager?.subscribe((k, playing, loading) => {
      const [s] = k.split(":");
      if (parseInt(s, 10) !== surahNumber) return;
      useAudioStore.setState({ isPlaying: playing, isLoading: loading });
    });

    return () => unsub?.();
  }, [autoPlayActive, surahNumber]);

  const handleStartAutoPlay = () => {
    // Find starting ayah: last-read or first with audio
    const startNum = (isThisSurah && currentAyahNumber) ?? 1;
    const startAyah =
      ayahs.find((a) => a.numberInSurah === startNum && a.audioUrl) ??
      ayahs.find((a) => a.audioUrl);

    if (!startAyah) return;

    startAutoPlay(surahNumber, ayahs, startAyah.numberInSurah);
    audioManager?.setOnEnded(handleEnded);
    playAyah(startAyah);
  };

  const handlePauseResume = () => {
    if (isPlaying) {
      audioManager?.pause();
      pauseAudio();
    } else {
      audioManager?.resume();
      useAudioStore.setState({ isPlaying: true });
    }
  };

  const handleStop = () => {
    audioManager?.stop();
    audioManager?.setOnEnded(null);
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
