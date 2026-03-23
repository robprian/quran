"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard, NeumorphicButton } from "@/components/neumorphism";
import { useLangStore } from "@/features/lang/store/langStore";
import type { QiblaState } from "@/features/quran/types";

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function toDeg(rad: number) { return (rad * 180) / Math.PI; }

/**
 * Calculate bearing from (lat1, lng1) to Kaaba
 * Returns bearing in degrees (0 = North, 90 = East)
 */
function calculateQiblaBearing(lat: number, lng: number): number {
  const dLng = toRad(KAABA_LNG - lng);
  const lat1 = toRad(lat);
  const lat2 = toRad(KAABA_LAT);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

export default function QiblaPage() {
  const { lang } = useLangStore();
  const [state, setState] = useState<QiblaState>({
    bearing: 0,
    deviceHeading: null,
    hasPermission: false,
    hasOrientationSupport: false,
    locationGranted: false,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const requestLocation = useCallback(() => {
    setIsLoading(true);
    setState((s) => ({ ...s, error: null }));

    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        error: lang === "id" ? "Geolokasi tidak didukung" : "Geolocation not supported",
        locationGranted: false,
      }));
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const bearing = calculateQiblaBearing(pos.coords.latitude, pos.coords.longitude);
        setState((s) => ({ ...s, bearing, locationGranted: true, error: null }));
        setIsLoading(false);
      },
      (err) => {
        setState((s) => ({
          ...s,
          error: lang === "id"
            ? "Izin lokasi ditolak. Aktifkan lokasi untuk hasil akurat."
            : "Location denied. Enable location for accurate results.",
          locationGranted: false,
        }));
        setIsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [lang]);

  // Set up device orientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading is iOS-specific (true north)
      const heading = (e as any).webkitCompassHeading ?? (e.alpha ? (360 - e.alpha) : null);
      if (heading !== null) {
        setState((s) => ({ ...s, deviceHeading: heading, hasOrientationSupport: true }));
      }
    };

    // Check if DeviceOrientationEvent requires permission (iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      setState((s) => ({ ...s, hasOrientationSupport: true }));
    } else if ("DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation, true);
      setState((s) => ({ ...s, hasOrientationSupport: true }));
    }

    return () => window.removeEventListener("deviceorientation", handleOrientation, true);
  }, []);

  // Request permission on mount
  useEffect(() => { requestLocation(); }, [requestLocation]);

  const requestOrientationPermission = async () => {
    try {
      const perm = await (DeviceOrientationEvent as any).requestPermission();
      if (perm === "granted") {
        setState((s) => ({ ...s, hasPermission: true }));
        window.addEventListener("deviceorientation", (e) => {
          const heading = (e as any).webkitCompassHeading ?? (e.alpha ? 360 - e.alpha : null);
          if (heading !== null) setState((s) => ({ ...s, deviceHeading: heading }));
        }, true);
      }
    } catch {}
  };

  // Arrow rotation: qibla bearing relative to device heading
  const arrowRotation = state.deviceHeading !== null
    ? (state.bearing - state.deviceHeading + 360) % 360
    : state.bearing;

  const compassText =
    arrowRotation < 22.5 || arrowRotation >= 337.5 ? "N"
    : arrowRotation < 67.5 ? "NE"
    : arrowRotation < 112.5 ? "E"
    : arrowRotation < 157.5 ? "SE"
    : arrowRotation < 202.5 ? "S"
    : arrowRotation < 247.5 ? "SW"
    : arrowRotation < 292.5 ? "W"
    : "NW";

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
        <h1 className="text-2xl font-bold text-neu-text dark:text-neu-dark-text">
          {lang === "id" ? "🧭 Arah Qibla" : "🧭 Qibla Direction"}
        </h1>
        <p className="text-sm text-neu-muted dark:text-neu-dark-muted mt-1">
          {lang === "id" ? "Arah menuju Ka'bah" : "Direction towards the Holy Kaaba"}
        </p>
      </motion.div>

      {state.error && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
          ⚠️ {state.error}
          <button
            onClick={requestLocation}
            className="ml-2 text-accent underline text-xs"
          >
            {lang === "id" ? "Coba lagi" : "Retry"}
          </button>
        </div>
      )}

      {/* Compass */}
      <NeumorphicCard className="p-8 flex flex-col items-center">
        {isLoading ? (
          <div className="w-48 h-48 rounded-full bg-[#c8cdd6] dark:bg-[#2a2a2a] animate-pulse flex items-center justify-center">
            <span className="text-neu-muted dark:text-neu-dark-muted text-sm">
              {lang === "id" ? "Mencari lokasi..." : "Finding location..."}
            </span>
          </div>
        ) : (
          <>
            {/* Compass dial */}
            <div className="relative w-56 h-56">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full shadow-neu-flat dark:shadow-neu-dark-flat bg-neu-bg dark:bg-neu-dark flex items-center justify-center">
                {/* Cardinal points */}
                {["N", "E", "S", "W"].map((dir, i) => (
                  <span
                    key={dir}
                    className="absolute text-xs font-bold text-neu-muted dark:text-neu-dark-muted"
                    style={{
                      top: i === 0 ? "8px" : i === 2 ? "auto" : "50%",
                      bottom: i === 2 ? "8px" : "auto",
                      left: i === 3 ? "8px" : i === 1 ? "auto" : "50%",
                      right: i === 1 ? "8px" : "auto",
                      transform: i === 0 || i === 2 ? "translateX(-50%)" : "translateY(-50%)",
                    }}
                  >
                    {dir}
                  </span>
                ))}

                {/* Inner circle */}
                <div className="w-36 h-36 rounded-full shadow-neu-pressed dark:shadow-neu-dark-pressed bg-neu-bg dark:bg-neu-dark flex items-center justify-center">
                  {/* Qibla arrow */}
                  <motion.div
                    animate={{ rotate: arrowRotation }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-3xl">🕋</div>
                      <div className="text-accent font-bold text-xs mt-1">
                        {Math.round(state.bearing)}° {compassText}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {state.deviceHeading !== null ? (
              <p className="mt-4 text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ {lang === "id" ? "Kompas aktif – arahkan ponsel" : "Compass active – orient your phone"}
              </p>
            ) : (
              <p className="mt-4 text-sm text-neu-muted dark:text-neu-dark-muted text-center max-w-xs">
                {lang === "id"
                  ? "Kompas tidak tersedia. Nilai menunjukkan sudut statis dari lokasi Anda."
                  : "No compass sensor. Value shows static bearing from your location."}
              </p>
            )}

            {/* iOS Permission button */}
            {typeof (DeviceOrientationEvent as any).requestPermission === "function" && (
              <NeumorphicButton
                variant="flat"
                className="mt-4"
                onClick={requestOrientationPermission}
              >
                {lang === "id" ? "Aktifkan Kompas" : "Enable Compass"}
              </NeumorphicButton>
            )}
          </>
        )}
      </NeumorphicCard>

      {/* Info card */}
      <NeumorphicCard className="p-4">
        <div className="text-sm text-neu-text dark:text-neu-dark-text space-y-1">
          <div className="flex justify-between">
            <span className="text-neu-muted dark:text-neu-dark-muted">
              {lang === "id" ? "Koordinat Ka'bah" : "Kaaba Coordinates"}
            </span>
            <span className="font-mono font-semibold text-accent">21.4225°N, 39.8262°E</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neu-muted dark:text-neu-dark-muted">
              {lang === "id" ? "Sudut Qibla" : "Qibla Bearing"}
            </span>
            <span className="font-mono font-semibold">{Math.round(state.bearing)}°</span>
          </div>
        </div>
      </NeumorphicCard>
    </div>
  );
}
