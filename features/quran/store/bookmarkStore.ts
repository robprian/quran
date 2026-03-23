"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookmarkItem } from "@/features/quran/types";

interface BookmarkStore {
  bookmarks: BookmarkItem[];
  addBookmark: (item: BookmarkItem) => void;
  removeBookmark: (surahNumber: number, ayahNumber: number) => void;
  removeDuaBookmark: (duaId: number) => void;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  isDuaBookmarked: (duaId: number) => boolean;
  clearAll: () => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (item) =>
        set((state) => {
          const filtered = state.bookmarks.filter((b) => {
            if (item.type === "ayah") return !(b.type === "ayah" && b.surahNumber === item.surahNumber && b.ayahNumber === item.ayahNumber);
            if (item.type === "dua") return !(b.type === "dua" && b.duaId === item.duaId);
            return true;
          });
          return { bookmarks: [item, ...filtered] };
        }),

      removeBookmark: (surahNumber, ayahNumber) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter(
            (b) => !(b.type === "ayah" && b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
          ),
        })),

      removeDuaBookmark: (duaId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => !(b.type === "dua" && b.duaId === duaId)),
        })),

      isBookmarked: (surahNumber, ayahNumber) =>
        get().bookmarks.some(
          (b) => b.type === "ayah" && b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
        ),

      isDuaBookmarked: (duaId) =>
        get().bookmarks.some((b) => b.type === "dua" && b.duaId === duaId),

      clearAll: () => set({ bookmarks: [] }),
    }),
    { name: "quran-bookmarks" }
  )
);
