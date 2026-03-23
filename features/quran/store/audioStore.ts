"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AudioState, MergedAyah } from "@/features/quran/types";

interface AudioStore extends AudioState {
  // Auto-play
  isAutoPlay: boolean;
  autoPlayAyahs: MergedAyah[];   // Full playlist for the current surah
  currentSurahNumber: number | null;
  currentAyahNumber: number | null;
  currentAudioUrl: string | null;

  setPlaying: (surahNumber: number, ayahNumber: number, audioUrl: string) => void;
  setLoading: (loading: boolean) => void;
  pauseAudio: () => void;
  stop: () => void;

  // Auto-play controls
  startAutoPlay: (surahNumber: number, ayahs: MergedAyah[], fromAyah?: number) => void;
  stopAutoPlay: () => void;
  setAutoPlayAyahs: (ayahs: MergedAyah[]) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      currentAyahKey: null,
      isPlaying: false,
      isLoading: false,
      isAutoPlay: false,
      autoPlayAyahs: [],
      currentSurahNumber: null,
      currentAyahNumber: null,
      currentAudioUrl: null,

      setPlaying: (surahNumber, ayahNumber, audioUrl) =>
        set({
          currentAyahKey: `${surahNumber}:${ayahNumber}`,
          isPlaying: true,
          isLoading: false,
          currentSurahNumber: surahNumber,
          currentAyahNumber: ayahNumber,
          currentAudioUrl: audioUrl,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      pauseAudio: () => set({ isPlaying: false }),

      stop: () =>
        set({
          currentAyahKey: null,
          isPlaying: false,
          isLoading: false,
          isAutoPlay: false,
          currentSurahNumber: null,
          currentAyahNumber: null,
          currentAudioUrl: null,
        }),

      startAutoPlay: (surahNumber, ayahs, fromAyah = 1) =>
        set({
          isAutoPlay: true,
          autoPlayAyahs: ayahs,
          currentSurahNumber: surahNumber,
        }),

      stopAutoPlay: () =>
        set({
          isAutoPlay: false,
          currentAyahKey: null,
          isPlaying: false,
          isLoading: false,
          currentSurahNumber: null,
          currentAyahNumber: null,
          currentAudioUrl: null,
        }),

      setAutoPlayAyahs: (ayahs) => set({ autoPlayAyahs: ayahs }),
    }),
    {
      name: "quran-audio-state",
      partialize: (state) => ({
        currentSurahNumber: state.currentSurahNumber,
        currentAyahNumber: state.currentAyahNumber,
        isAutoPlay: false, // never persist autoplay on reload
      }),
    }
  )
);
