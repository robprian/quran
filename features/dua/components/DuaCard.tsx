import { motion } from "framer-motion";
import Link from "next/link";
import { Dua } from "../types";
import { NeumorphicCard } from "@/components/neumorphism";

export function DuaCard({ dua }: { dua: Dua }) {
  return (
    <Link href={`/duas/${dua.id}`}>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
        <NeumorphicCard className="p-5 h-full flex flex-col hover:shadow-[inset_2px_2px_5px_#A3B1C6,inset_-2px_-2px_5px_#FFFFFF] dark:hover:shadow-[inset_2px_2px_5px_#0a0a0a,inset_-2px_-2px_5px_#2a2a00] transition-shadow">
          <div className="flex items-start justify-between mb-3 gap-2">
            <h3 className="font-bold text-neu-text dark:text-neu-dark-text text-lg leading-snug">
              {dua.title}
            </h3>
          </div>
          
          <div className="mt-auto pt-4 flex flex-col gap-3">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-[11px] font-bold self-start uppercase tracking-wide">
              {dua.group}
            </span>
             
            {dua.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {dua.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-[10px] bg-neu-bg dark:bg-neu-dark shadow-neu-flat dark:shadow-neu-dark-flat rounded-md text-neu-muted dark:text-neu-dark-muted font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </NeumorphicCard>
      </motion.div>
    </Link>
  );
}
