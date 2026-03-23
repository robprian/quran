import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DzikirState {
  count: number;
  target: number;
  increment: () => void;
  reset: () => void;
  setTarget: (n: number) => void;
}

export const useDzikirStore = create<DzikirState>()(
  persist(
    (set) => ({
      count: 0,
      target: 33,
      increment: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
      setTarget: (n) => set({ target: n, count: 0 }),
    }),
    {
      name: "dzikir_user",
    }
  )
);
