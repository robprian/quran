import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DuaBookmarkStore {
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
}

export const useDuaBookmarkStore = create<DuaBookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      toggleBookmark: (id: number) => {
        const { bookmarks } = get();
        if (bookmarks.includes(id)) {
          set({ bookmarks: bookmarks.filter((b) => b !== id) });
        } else {
          set({ bookmarks: [...bookmarks, id] });
        }
      },
      isBookmarked: (id: number) => get().bookmarks.includes(id),
    }),
    {
      name: "dua_bookmark_user",
    }
  )
);
