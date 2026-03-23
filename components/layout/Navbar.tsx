"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NeumorphicButton } from "@/components/neumorphism";
import { LangSwitcher } from "@/components/ui/LangSwitcher";
import { useLangStore } from "@/features/lang/store/langStore";
import { Logo } from "@/components/ui/Logo";
import { useFavicon } from "@/hooks/useFavicon";

export function Navbar() {
  type ThemeType = "light" | "dark" | "gold";
  const [theme, setTheme] = useState<ThemeType>("light");
  const { t } = useLangStore();
  useFavicon();

  useEffect(() => {
    const stored = localStorage.getItem("quran-theme") as ThemeType | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let initial: ThemeType = "light";
    if (stored === "gold") initial = "gold";
    else if (stored === "dark" || (!stored && prefersDark)) initial = "dark";
    
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    document.documentElement.classList.toggle("gold", initial === "gold");
  }, []);

  const toggleTheme = () => {
    const nextMap: Record<ThemeType, ThemeType> = { light: "dark", dark: "gold", gold: "light" };
    const next = nextMap[theme];
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("gold", next === "gold");
    localStorage.setItem("quran-theme", next);
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
          <Logo className="w-10 h-10 drop-shadow-sm" />
          <div className="hidden sm:block">
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
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Ganti Tema"
            className="text-lg w-10 h-10 flex items-center justify-center p-0"
          >
            {theme === "light" ? "🌙" : theme === "dark" ? "✨" : "☀️"}
          </NeumorphicButton>
        </div>
      </div>
    </motion.nav>
  );
}

