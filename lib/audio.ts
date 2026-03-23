/**
 * Centralized Audio Manager singleton
 * Manages a single HTMLAudioElement — stops previous before playing next.
 * Supports auto-play (onEnded callback for sequential playback).
 */

type AudioEventCallback = (ayahKey: string, isPlaying: boolean, isLoading: boolean) => void;
type OnEndedCallback = (ayahKey: string) => void;

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentKey: string | null = null;
  private listeners: Set<AudioEventCallback> = new Set();
  private onEndedCallback: OnEndedCallback | null = null;

  private emit(key: string, isPlaying: boolean, isLoading = false) {
    this.listeners.forEach((cb) => cb(key, isPlaying, isLoading));
  }

  subscribe(cb: AudioEventCallback): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  /** Set a callback to be called when the current audio ends naturally */
  setOnEnded(cb: OnEndedCallback | null) {
    this.onEndedCallback = cb;
  }

  play(url: string, ayahKey: string): void {
    // Stop any existing audio first
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      if (this.currentKey) this.emit(this.currentKey, false, false);
    }

    this.audio = new Audio();
    this.currentKey = ayahKey;

    // Emit loading state
    this.emit(ayahKey, false, true);

    this.audio.addEventListener("canplay", () => {
      this.audio?.play().catch((err) => {
        console.error("[AudioManager] Playback failed:", err);
        if (this.currentKey) this.emit(this.currentKey, false, false);
      });
    }, { once: true });

    this.audio.addEventListener("playing", () => {
      this.emit(ayahKey, true, false);
    }, { once: true });

    this.audio.onerror = () => {
      console.error("[AudioManager] Audio error for:", ayahKey);
      this.emit(ayahKey, false, false);
      // Trigger onended so auto-play can skip to next
      if (this.onEndedCallback) this.onEndedCallback(ayahKey);
      this.currentKey = null;
    };

    this.audio.onended = () => {
      this.emit(ayahKey, false, false);
      const key = this.currentKey;
      this.currentKey = null;
      // Fire the auto-next callback after emit so state is clean
      if (key && this.onEndedCallback) {
        this.onEndedCallback(key);
      }
    };

    this.audio.src = url;
    this.audio.load();
  }

  pause(): void {
    if (this.audio && this.currentKey) {
      this.audio.pause();
      this.emit(this.currentKey, false, false);
    }
  }

  resume(): void {
    if (this.audio && this.audio.paused && this.currentKey) {
      this.audio.play().catch(console.error);
      this.emit(this.currentKey, true, false);
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      if (this.currentKey) this.emit(this.currentKey, false, false);
      this.audio = null;
      this.currentKey = null;
    }
    this.onEndedCallback = null;
  }

  getCurrentKey(): string | null { return this.currentKey; }
  isPlaying(): boolean { return !!this.audio && !this.audio.paused && !this.audio.ended; }
}

export const audioManager = typeof window !== "undefined" ? new AudioManager() : null;

export function buildAudioUrl(surahNumber: number, ayahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber * 1000 + ayahNumber}.mp3`;
}
