"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLangStore } from "@/features/lang/store/langStore";
import { NeumorphicCard, NeumorphicButton } from "@/components/neumorphism";
import ceritaData from "@/data/cerita-islami.json";

interface CeritaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CeritaDetailPage({ params }: CeritaDetailPageProps) {
  const { id: idParam } = use(params);
  const idNumber = parseInt(idParam, 10);
  const { t } = useLangStore();

  const story = ceritaData.find((s) => s.id === idNumber);

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-4xl mb-4">📖</div>
        <h2 className="text-xl font-bold text-neu-text dark:text-neu-dark-text mb-2">
          Cerita Tidak Ditemukan
        </h2>
        <Link href="/cerita">
          <NeumorphicButton variant="flat">Kembali</NeumorphicButton>
        </Link>
      </div>
    );
  }

  // Extract Surah number if possible for deep linking (e.g. "Al-Baqarah: 30-38" -> we can link to the surah if we had a mapper, but text is fine)

  return (
    <div className="space-y-6 pb-32">
      <Link href="/cerita">
        <NeumorphicButton variant="flat" size="sm">
          ← {t("back") || "Kembali"}
        </NeumorphicButton>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NeumorphicCard className="p-6 md:p-8 relative overflow-hidden">
          {/* Decorative subtle background icon */}
          <div className="absolute -top-10 -right-10 text-[150px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none">
            🕌
          </div>

          <div className="relative z-10">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-bold rounded-full bg-accent/10 text-accent dark:bg-accent/20 border border-accent/20">
              Surah {story.surah_reference}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-neu-text dark:text-neu-dark-text leading-snug mb-6">
              {story.title}
            </h1>

            <div className="prose dark:prose-invert prose-p:leading-relaxed prose-p:text-neu-text dark:prose-p:text-neu-dark-text max-w-none text-base">
              <p className="whitespace-pre-line">{story.content}</p>
            </div>

            <div className="mt-10 pt-6 border-t border-[#c8cdd6]/50 dark:border-[#2a2a2a]/50">
              <h3 className="text-sm font-bold text-accent dark:text-accent-light uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm bg-gradient-to-br from-accent-light to-accent flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px]">💡</span>
                </span>
                {t("hikmah") || "Pelajaran"}
              </h3>
              <ul className="space-y-3">
                {story.lessons.map((lesson, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neu-bg dark:bg-neu-dark-bg shadow-[inset_2px_2px_4px_#c8cdd6,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#2a2a2a,inset_-2px_-2px_4px_#3e3e3e] flex items-center justify-center text-xs font-bold text-accent">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-neu-text dark:text-neu-dark-text pt-0.5 font-medium">
                      {lesson}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </NeumorphicCard>
      </motion.div>
    </div>
  );
}
