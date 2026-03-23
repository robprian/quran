"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAudioStore } from "@/features/quran/store/audioStore";
import { audioManager } from "@/lib/audio";
import { NeumorphicCard, NeumorphicButton } from "@/components/neumorphism";
import { useLangStore } from "@/features/lang/store/langStore";

export function AudioPlayer() {
  const {
    currentAyahKey, isPlaying, isLoading,
    currentSurahNumber, currentAyahNumber,
    isAutoPlay, stop, pauseAudio, stopAutoPlay
  } = useAudioStore();
  const { t } = useLangStore();

  const handleStop = () => {
    audioManager?.stop();
    audioManager?.setOnEnded(null);
    if (isAutoPlay) stopAutoPlay(); else stop();
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

  // Only show for manual (single-ayah) playback; auto-play has its own bar
  const show = !!currentAyahKey && !isAutoPlay;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4"
        >
          <NeumorphicCard className="max-w-3xl mx-auto px-5 py-3 flex items-center gap-4">
            {/* Wave */}
            <div className="flex items-center gap-0.5 flex-shrink-0 w-12">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                [0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={isPlaying ? { scaleY: [0.3, 1, 0.3] } : { scaleY: 0.3 }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.12 }}
                    className="w-1 bg-accent rounded-full h-5 origin-center"
                  />
                ))
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-neu-text dark:text-neu-dark-text truncate">
                {t("surah")} {currentSurahNumber}
              </div>
              <div className="text-xs text-neu-muted dark:text-neu-dark-muted">
                {t("ayah")} {currentAyahNumber}
                {isLoading ? ` · ${t("loading")}` : ""}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <NeumorphicButton
                size="sm"
                variant={isPlaying ? "pressed" : "flat"}
                onClick={handlePauseResume}
                aria-label={isPlaying ? t("pause") : t("play")}
              >
                {isLoading ? "⏳" : isPlaying ? "⏸" : "▶"}
              </NeumorphicButton>
              <NeumorphicButton size="sm" variant="flat" onClick={handleStop} aria-label={t("stop")}>
                ⏹
              </NeumorphicButton>
            </div>
          </NeumorphicCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
