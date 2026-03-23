"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard, NeumorphicButton } from "@/components/neumorphism";

interface RingProps {
  label: string;
  emoji: string;
  color: string;
  max: number;
}

function ProgressRing({ label, emoji, color, max }: RingProps) {
  const [count, setCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem(`progress-${label}`) || "0", 10);
  });

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(count / max, 1);
  const dashOffset = circumference * (1 - progress);

  const increment = () => {
    setCount((prev) => {
      const next = Math.min(prev + 1, max);
      localStorage.setItem(`progress-${label}`, String(next));
      return next;
    });
  };

  const reset = () => {
    setCount(0);
    localStorage.setItem(`progress-${label}`, "0");
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" onClick={increment}>
        <svg width="72" height="72" className="cursor-pointer -rotate-90">
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-[#c8cdd6] dark:text-[#2a2a2a]"
          />
          <motion.circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">{emoji}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-neu-text dark:text-neu-dark-text">
          {count}/{max}
        </div>
        <div className="text-[10px] text-neu-muted dark:text-neu-dark-muted">{label}</div>
      </div>
    </div>
  );
}

import { useLangStore } from "@/features/lang/store/langStore";
import type { LangKey } from "@/lib/i18n";

export function ProgressTracker() {
  const { t } = useLangStore();
  const trackers: RingProps[] = [
    { label: t("prayer"), emoji: "🕌", color: "#D4AF37", max: 5 },
    { label: t("quran"), emoji: "📖", color: "#4CAF50", max: 10 },
    { label: t("dhikr"), emoji: "📿", color: "#9C27B0", max: 33 },
  ];

  return (
    <NeumorphicCard className="p-5">
      <div className="text-sm font-bold text-neu-text dark:text-neu-dark-text mb-4">
        {t("todays_progress")}
      </div>
      <div className="flex items-center justify-around">
        {trackers.map((t) => (
          <ProgressRing key={t.label} {...t} />
        ))}
      </div>
      <p className="text-[10px] text-neu-muted dark:text-neu-dark-muted text-center mt-3">
        {t("tap_increment")}
      </p>
    </NeumorphicCard>
  );
}
