"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard, NeumorphicButton } from "@/components/neumorphism";
import { useLangStore } from "@/features/lang/store/langStore";
import type { Mosque } from "@/features/quran/types";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchNearbyMosques(lat: number, lon: number): Promise<Mosque[]> {
  const radius = 5000; // 5 km
  const query = `
    [out:json][timeout:15];
    node(around:${radius},${lat},${lon})[amenity=place_of_worship][religion=muslim];
    out body 20;
  `;
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  const data = await response.json();

  return (data.elements as any[])
    .map((el: any) => ({
      id: String(el.id),
      name: el.tags?.name || el.tags?.["name:en"] || "Masjid",
      lat: el.lat,
      lon: el.lon,
      distanceKm: haversineKm(lat, lon, el.lat, el.lon),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 15);
}

export default function MosquePage() {
  const { lang } = useLangStore();
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  const loadMosques = () => {
    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setUserLocation({ lat, lon });
        try {
          const results = await fetchNearbyMosques(lat, lon);
          setMosques(results);
        } catch {
          setError(lang === "id" ? "Gagal mengambil data masjid" : "Failed to fetch mosque data");
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError(lang === "id" ? "Izin lokasi ditolak" : "Location permission denied");
        setIsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => { loadMosques(); }, []);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
        <h1 className="text-2xl font-bold text-neu-text dark:text-neu-dark-text">
          📍 {lang === "id" ? "Masjid Terdekat" : "Nearby Mosques"}
        </h1>
        <p className="text-sm text-neu-muted dark:text-neu-dark-muted mt-1">
          {lang === "id" ? "Dalam radius 5 km dari lokasi Anda" : "Within 5 km of your location"}
        </p>
      </motion.div>

      {error && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
          ⚠️ {error}
          <button onClick={loadMosques} className="ml-2 text-accent underline text-xs">
            {lang === "id" ? "Coba lagi" : "Retry"}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#c8cdd6] dark:bg-[#2a2a2a] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : mosques.length === 0 && !error ? (
        <NeumorphicCard className="p-8 text-center">
          <div className="text-4xl mb-3">🕌</div>
          <p className="text-neu-muted dark:text-neu-dark-muted">
            {lang === "id" ? "Tidak ada masjid ditemukan" : "No mosques found nearby"}
          </p>
          <NeumorphicButton variant="flat" className="mt-4" onClick={loadMosques}>
            {lang === "id" ? "Cari Ulang" : "Search Again"}
          </NeumorphicButton>
        </NeumorphicCard>
      ) : (
        <div className="space-y-3">
          {mosques.map((mosque, idx) => (
            <motion.div
              key={mosque.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <NeumorphicCard className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-light/50 to-accent/30 flex items-center justify-center text-xl flex-shrink-0">
                    🕌
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-neu-text dark:text-neu-dark-text truncate">
                      {mosque.name}
                    </div>
                    <div className="text-xs text-neu-muted dark:text-neu-dark-muted">
                      #{idx + 1} {lang === "id" ? "terdekat" : "nearest"}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-accent text-sm">
                      {mosque.distanceKm < 1
                        ? `${Math.round(mosque.distanceKm * 1000)} m`
                        : `${mosque.distanceKm.toFixed(1)} km`}
                    </div>
                    <div className="text-[10px] text-neu-muted dark:text-neu-dark-muted">
                      {lang === "id" ? "dari lokasi" : "away"}
                    </div>
                  </div>
                </div>
                {/* Open in maps link */}
                <a
                  href={`https://www.openstreetmap.org/?mlat=${mosque.lat}&mlon=${mosque.lon}#map=17/${mosque.lat}/${mosque.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-[11px] text-accent hover:underline"
                >
                  {lang === "id" ? "🗺 Buka di peta →" : "🗺 Open in map →"}
                </a>
              </NeumorphicCard>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && mosques.length > 0 && (
        <p className="text-[11px] text-center text-neu-muted dark:text-neu-dark-muted">
          {lang === "id" ? "Data dari" : "Data from"} OpenStreetMap · Overpass API
        </p>
      )}
    </div>
  );
}
