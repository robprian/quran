"use client";

"use client";

import { useEffect } from "react";

export function useFavicon() {
  useEffect(() => {
    const updateFavicon = () => {
      const isDark = document.documentElement.classList.contains("dark");
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      
      if (!link) {
        link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }

      link.href = isDark ? "/favicon-dark.ico" : "/favicon-light.ico";
    };

    // Initial setting
    updateFavicon();

    // Observe changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateFavicon();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);
}
