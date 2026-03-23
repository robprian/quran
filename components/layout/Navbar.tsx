"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NeumorphicButton } from "@/components/neumorphism";
import { LangSwitcher } from "@/components/ui/LangSwitcher";
import { useLangStore } from "@/features/lang/store/langStore";


export function Navbar() {
  const [dark, setDark] = useState(false);
  const { t } = useLangStore();

  useEffect(() => {
    const stored = localStorage.getItem("quran-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("quran-theme", next ? "dark" : "light");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-neu-bg dark:bg-neu-dark border-b border-[#c8cdd6]/50 dark:border-[#2a2a2a]/50 backdrop-blur-md"
    >
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-light to-accent flex items-center justify-center shadow-[3px_3px_6px_rgba(212,175,55,0.4)]">
            <span className="text-white text-lg">☪</span>
          </div>
          <div>
            <div className="text-sm font-bold text-neu-text dark:text-neu-dark-text leading-tight tracking-wide">
              Quran App
            </div>
            <div className="text-[10px] text-neu-muted dark:text-neu-dark-muted leading-none">
              القرآن الكريم
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-1">
          {[
            { href: "/", labelKey: "home" as const },
            { href: "/quran", labelKey: "quran" as const },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm font-medium text-neu-muted dark:text-neu-dark-muted hover:text-accent transition-colors rounded-xl hover:bg-[#d4d9e4] dark:hover:bg-[#2a2a2a]"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        {/* Lang Switcher + Dark Mode */}
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <NeumorphicButton
            variant="flat"
            size="sm"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="text-lg"
          >
            {dark ? "☀️" : "🌙"}
          </NeumorphicButton>
        </div>
      </div>
    </motion.nav>
  );
}

