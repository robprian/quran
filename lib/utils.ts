// Simple cn() without clsx dependency
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

// Debounce
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Format ayah number as Arabic-style (e.g. 3:15)
export function formatAyahRef(surahNumber: number, ayahNumber: number): string {
  return `${surahNumber}:${ayahNumber}`;
}

// Format number with leading zeros
export function pad(n: number, width = 3): string {
  return String(n).padStart(width, "0");
}

// Highlight matched text with <mark> tag
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// Get current time string HH:MM
export function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

// Calculate minutes until target time HH:MM
export function minutesUntil(target: string): number {
  const [th, tm] = target.split(":").map(Number);
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setHours(th, tm, 0, 0);
  if (targetDate <= now) targetDate.setDate(targetDate.getDate() + 1);
  return Math.floor((targetDate.getTime() - now.getTime()) / 60000);
}

// Format minutes as HH:MM:SS countdown string
export function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

// Detect if the user prefers dark mode
export function prefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Vibrate device (if supported)
export function vibrate(pattern: number | number[] = 50): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
