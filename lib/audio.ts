/**
 * Centralized Audio Manager singleton
 * Manages a single HTMLAudioElement — stops previous before playing next.
 * Supports auto-play (onEnded callback for sequential playback).
 */

import type { MergedAyah } from "@/features/quran/types";

type AudioEventCallback = (ayahKey: string, isPlaying: boolean, isLoading: boolean) => void;

class AudioManager {
  private audio = typeof window !== "undefined" ? new Audio() : null;
  private currentKey: string | null = null;
  private listeners: Set<AudioEventCallback> = new Set();
  public isAutoPlay = false;

  private emit(key: string, isPlaying: boolean, isLoading = false) {
    this.listeners.forEach((cb) => cb(key, isPlaying, isLoading));
  }

  subscribe(cb: AudioEventCallback): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  playAyah(ayah: MergedAyah, surahNumber: number): void {
    if (!this.audio || !ayah.audioUrl) return;

    const key = `${surahNumber}:${ayah.numberInSurah}`;

    // Prevent double click
    if (this.currentKey === key && !this.audio.paused) return;

    // Reset strictly
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.onended = null;

    this.currentKey = key;
    this.audio.src = ayah.audioUrl;

    this.emit(key, false, true); // loading

    this.audio.play()
      .then(() => {
        this.emit(key, true, false);
      })
      .catch((err) => {
        console.error("[AudioManager] Playback failed:", err);
        this.emit(key, false, false);
        if (this.isAutoPlay && this.audio?.onended) {
          this.audio.onended(new Event("ended"));
        }
      });

    this.audio.onerror = () => {
      console.error("[AudioManager] Audio error for:", key);
      this.emit(key, false, false);
      if (this.isAutoPlay && this.audio?.onended) {
        this.audio.onended(new Event("ended"));
      }
    };
  }

  playSequential(list: MergedAyah[], surahNumber: number, startIndex = 0): void {
    let i = startIndex;
    this.isAutoPlay = true;

    const playNext = () => {
      if (!this.isAutoPlay || i >= list.length) {
        this.isAutoPlay = false;
        return;
      }

      const ayah = list[i];
      if (!ayah.audioUrl) {
        i++;
        playNext();
        return;
      }

      this.playAyah(ayah, surahNumber);

      if (this.audio) {
        this.audio.onended = () => {
          this.emit(`${surahNumber}:${ayah.numberInSurah}`, false, false);
          i++;
          playNext();
        };
      }
    };

    playNext();
  }

  pause(): void {
    if (this.audio && this.currentKey) {
      this.audio.pause();
      this.emit(this.currentKey, false, false);
    }
  }

  resume(): void {
    if (this.audio && this.audio.paused && this.currentKey) {
      const key = this.currentKey;
      this.emit(key, false, true);
      this.audio.play()
        .then(() => this.emit(key, true, false))
        .catch(() => this.emit(key, false, false));
    }
  }

  stopPlayback(): void {
    this.isAutoPlay = false;
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.onended = null;
    }
    if (this.currentKey) this.emit(this.currentKey, false, false);
    this.currentKey = null;
  }

  getCurrentKey(): string | null { return this.currentKey; }
  getIsPlaying(): boolean { return !!this.audio && !this.audio.paused && !this.audio.ended; }
}

export const audioManager = typeof window !== "undefined" ? new AudioManager() : null;

export function buildAudioUrl(surahNumber: number, ayahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber * 1000 + ayahNumber}.mp3`;
}
