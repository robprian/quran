"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDuaDetail } from "@/features/dua/hooks/useDua";
import { useDuaBookmarkStore } from "@/features/dua/store/duaBookmarkStore";
import { useLangStore } from "@/features/lang/store/langStore";
import { NeumorphicButton, NeumorphicCard } from "@/components/neumorphism";

export default function DuaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const duaId = parseInt(id, 10);
  
  const { lang } = useLangStore();
  const isId = lang === "id";
  
  const { data: dua, isLoading, isError, refetch } = useDuaDetail(duaId);
  const { isBookmarked, toggleBookmark } = useDuaBookmarkStore();
  const bookmarked = isBookmarked(duaId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-neu-muted font-medium">{isId ? "Memuat doa..." : "Loading dua..."}</p>
      </div>
    );
  }

  if (isError || !dua) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
        <div className="text-5xl mb-2">⚠️</div>
        <p className="text-neu-text font-medium">{isId ? "Gagal mengambil data doa" : "Failed to fetch dua"}</p>
        <NeumorphicButton variant="pressed" onClick={() => refetch()} className="mt-4">
          {isId ? "Coba Lagi" : "Retry"}
        </NeumorphicButton>
        <NeumorphicButton variant="flat" onClick={() => router.push("/duas")} className="mt-2 text-sm">
          {isId ? "Kembali" : "Go Back"}
        </NeumorphicButton>
      </div>
    );
  }

  // Handle fallback translation for non-ID languages
  const translation = isId ? dua.translation_id : "Translation not available in your language";
  const desc = isId ? dua.description : "Description not available in your language";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-24 max-w-2xl mx-auto"
    >
      {/* Top Navbar */}
      <div className="flex items-center justify-between pt-2 mb-4">
        <Link href="/duas">
          <NeumorphicButton size="sm" variant="flat" className="text-neu-muted font-semibold">
            ← {isId ? "Kembali" : "Back"}
          </NeumorphicButton>
        </Link>
        <div className="text-[10px] font-bold text-accent px-3 py-1 bg-accent/10 rounded-full uppercase tracking-wider">
          {dua.group}
        </div>
      </div>

      <NeumorphicCard className="p-6 sm:p-8 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-neu-text dark:text-neu-dark-text leading-snug">
            {dua.title}
          </h1>
          <NeumorphicButton 
            variant={bookmarked ? "pressed" : "flat"} 
            onClick={() => toggleBookmark(duaId)}
            className={`flex-shrink-0 !rounded-xl w-12 h-12 flex items-center justify-center text-xl ${bookmarked ? "text-accent" : "text-neu-muted"}`}
            aria-label={isId ? "Tandai doa" : "Bookmark dua"}
          >
            {bookmarked ? "🔖" : "🏷"}
          </NeumorphicButton>
        </div>

        {dua.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dua.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-neu-bg dark:bg-neu-dark shadow-neu-flat dark:shadow-neu-dark-flat rounded-md text-neu-muted dark:text-neu-dark-muted text-[11px] font-semibold">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-neu-pressed dark:via-neu-dark-pressed to-transparent my-6" />

        <div className="space-y-6">
          {/* Arabic */}
          <div className="text-right">
            <p dir="rtl" className="font-arabic text-3xl sm:text-4xl text-neu-text dark:text-neu-dark-text leading-[2.5] py-4">
              {dua.arabic}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#c8cdd6] dark:via-[#2a2a2a] to-transparent my-6" />

          {/* Latin */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Latin</h3>
            <p className="text-neu-muted dark:text-neu-dark-muted italic text-base sm:text-lg leading-relaxed">
              {dua.latin}
            </p>
          </div>

          {/* Translation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{isId ? "Artinya" : "Translation"}</h3>
            <p className="text-neu-text dark:text-neu-dark-text text-base sm:text-lg leading-relaxed">
              {translation}
            </p>
          </div>

          {/* Description */}
          {dua.description && (
            <div className="pt-6 mt-6 border-t border-neu-pressed dark:border-neu-dark-pressed">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{isId ? "Tentang / Faedah" : "About"}</h3>
              <p className="text-neu-muted dark:text-neu-dark-muted text-sm leading-relaxed whitespace-pre-line">
                {desc}
              </p>
            </div>
          )}
        </div>
      </NeumorphicCard>
    </motion.div>
  );
}
