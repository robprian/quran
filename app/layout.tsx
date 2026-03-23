import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { PWAInstallPrompt } from "@/components/layout/PWAInstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quran App – القرآن الكريم",
    template: "%s | Quran App",
  },
  description:
    "A beautiful, offline-ready Quran reading and listening app with prayer times, bookmarks, and neumorphism design.",
  keywords: ["Quran", "Islam", "Prayer", "Al-Quran", "Audio", "PWA"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quran App",
  },
  icons: {
    apple: "/logo-light.png",
  },
  openGraph: {
    title: "Quran App",
    description: "Read and listen to the Holy Quran with beautiful neumorphic design.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('quran-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen bg-neu-bg dark:bg-neu-dark transition-colors duration-300`}>
        <Providers>
          <OfflineBanner />
          <Navbar />
          <main className="max-w-3xl mx-auto px-4 py-6 pb-28">
            {children}
          </main>
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
