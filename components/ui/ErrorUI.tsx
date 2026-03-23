"use client";

import { NeumorphicButton } from "@/components/neumorphism";

interface ErrorUIProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorUI({ message = "Something went wrong", onRetry }: ErrorUIProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
      <div className="text-6xl">⚠️</div>
      <div>
        <h3 className="text-xl font-bold text-neu-text dark:text-neu-dark-text mb-2">
          Failed to Load
        </h3>
        <p className="text-neu-muted dark:text-neu-dark-muted text-sm max-w-sm">
          {message}. Please check your connection and try again.
        </p>
      </div>
      {onRetry && (
        <NeumorphicButton variant="accent" onClick={onRetry}>
          🔄 Retry
        </NeumorphicButton>
      )}
    </div>
  );
}
