"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { NeumorphicCard } from "@/components/neumorphism";
import { MENU_ITEMS } from "@/lib/constants";
import { useLangStore } from "@/features/lang/store/langStore";
import type { LangKey } from "@/lib/i18n";

export function MenuGrid() {
  const { t } = useLangStore();
  return (
    <div className="grid grid-cols-2 gap-3">
      {MENU_ITEMS.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href={item.href}>
            <NeumorphicCard className="p-5 flex flex-col items-center gap-3 group text-center hover:ring-2 hover:ring-accent/30">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <span className="text-sm font-semibold text-neu-text dark:text-neu-dark-text">
                {t(item.labelKey as LangKey)}
              </span>
            </NeumorphicCard>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
