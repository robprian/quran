"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeumorphicCard, NeumorphicButton } from "@/components/neumorphism";
import { useLangStore } from "@/features/lang/store/langStore";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PWAInstallPrompt() {
  const { t } = useLangStore();
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("pwa-dismissed") === "1") {
      setDismissed(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("pwa-dismissed", "1");
  };

  const show = prompt && !dismissed && !installed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <NeumorphicCard className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-light to-accent flex items-center justify-center flex-shrink-0 shadow-[3px_3px_6px_rgba(212,175,55,0.4)]">
              <span className="text-2xl">📲</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-neu-text dark:text-neu-dark-text">
                {t("install_app")}
              </div>
              <div className="text-xs text-neu-muted dark:text-neu-dark-muted">
                {t("install_desc")}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <NeumorphicButton variant="accent" size="sm" onClick={handleInstall}>
                {t("install")}
              </NeumorphicButton>
              <button
                onClick={handleDismiss}
                className="text-xs text-neu-muted hover:text-neu-text text-center"
              >
                {t("not_now")}
              </button>
            </div>
          </NeumorphicCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
