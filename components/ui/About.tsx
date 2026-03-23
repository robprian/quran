"use client";

import { APP_VERSION } from "@/constants/version";
import { NeumorphicCard } from "@/components/neumorphism";

export function About() {
  return (
    <NeumorphicCard className="p-5 mt-6 mb-12 flex flex-col items-center justify-center text-center space-y-2">
      <h3 className="text-sm font-bold text-neu-text dark:text-neu-dark-text">About App</h3>
      <div className="text-xs text-neu-muted dark:text-neu-dark-muted space-y-1">
        <p>
          Developer:{" "}
          <a
            href="mailto:robprian@gmail.com"
            className="text-accent hover:underline transition-all"
          >
            robprian@gmail.com
          </a>
        </p>
        <p>
          GitHub:{" "}
          <a
            href="https://github.com/robprian/quran"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline transition-all"
          >
            github.com/robprian/quran
          </a>
        </p>
        <p className="mt-2 font-mono bg-neu-bg dark:bg-neu-dark-bg px-2 py-0.5 rounded shadow-[inset_1px_1px_2px_#c8cdd6,inset_-1px_-1px_2px_#ffffff] dark:shadow-[inset_1px_1px_2px_#2a2a2a,inset_-1px_-1px_2px_#3e3e3e] inline-block">
          v{APP_VERSION}
        </p>
      </div>
    </NeumorphicCard>
  );
}
