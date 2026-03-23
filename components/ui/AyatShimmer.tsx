"use client";

export function AyatShimmer() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-neu-bg dark:bg-neu-dark rounded-2xl p-6 shadow-neu-flat dark:shadow-neu-dark-flat overflow-hidden"
        >
          {/* Ayah number badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8cdd6] to-[#b0b9ca] dark:from-[#2a2a2a] dark:to-[#1a1a1a] shimmer" />
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#c8cdd6] to-[#b0b9ca] dark:from-[#2a2a2a] dark:to-[#1a1a1a] shimmer" />
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#c8cdd6] to-[#b0b9ca] dark:from-[#2a2a2a] dark:to-[#1a1a1a] shimmer" />
            </div>
          </div>

          {/* Arabic text */}
          <div className="space-y-2 mb-4">
            <div className="h-7 rounded-lg bg-gradient-to-br from-[#c8cdd6] to-[#b0b9ca] dark:from-[#2a2a2a] dark:to-[#1a1a1a] shimmer" style={{ width: `${75 + (i % 3) * 10}%`, marginLeft: "auto" }} />
            <div className="h-7 rounded-lg bg-gradient-to-br from-[#c8cdd6] to-[#b0b9ca] dark:from-[#2a2a2a] dark:to-[#1a1a1a] shimmer" style={{ width: `${55 + (i % 4) * 8}%`, marginLeft: "auto" }} />
          </div>

          {/* Translation */}
          <div className="space-y-1.5">
            <div className="h-4 rounded bg-gradient-to-br from-[#c8cdd6] to-[#b0b9ca] dark:from-[#2a2a2a] dark:to-[#1a1a1a] shimmer w-full" />
            <div className="h-4 rounded bg-gradient-to-br from-[#c8cdd6] to-[#b0b9ca] dark:from-[#2a2a2a] dark:to-[#1a1a1a] shimmer w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
