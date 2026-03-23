"use client";

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Logo({ className = "w-16 h-16" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initial check
    setIsDark(document.documentElement.classList.contains("dark"));

    // Observe class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return <div className={`${className} bg-transparent`} />;
  }
  
  const src = isDark ? "/logo-dark.png" : "/logo-light.png";

  return (
    <Image
      src={src}
      alt="Al-Quran App Logo"
      width={128}
      height={128}
      className={`${className} object-contain transition-opacity duration-300`}
      priority
    />
  );
}
