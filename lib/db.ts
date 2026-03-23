import { openDB, IDBPDatabase } from "idb";
import { DB_NAME, DB_VERSION, STORE_SURAHS, STORE_AYAHS } from "./constants";
import type { Surah, AyahEditions } from "@/features/quran/types";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        // On any version change, drop and recreate stores to purge stale data.
        if (db.objectStoreNames.contains(STORE_SURAHS)) {
          db.deleteObjectStore(STORE_SURAHS);
        }
        if (db.objectStoreNames.contains(STORE_AYAHS)) {
          db.deleteObjectStore(STORE_AYAHS);
        }
        db.createObjectStore(STORE_SURAHS, { keyPath: "number" });
        db.createObjectStore(STORE_AYAHS);
      },
    });
  }
  return dbPromise;
}

export async function getCachedSurahList(): Promise<Surah[] | null> {
  const db = getDB();
  if (!db) return null;
  try {
    const database = await db;
    const all = await database.getAll(STORE_SURAHS);
    return all.length > 0 ? (all as Surah[]) : null;
  } catch {
    return null;
  }
}

export async function cacheSurahList(surahs: Surah[]): Promise<void> {
  const db = getDB();
  if (!db) return;
  try {
    const database = await db;
    const tx = database.transaction(STORE_SURAHS, "readwrite");
    await Promise.all([...surahs.map((s) => tx.store.put(s)), tx.done]);
  } catch (e) {
    console.error("[DB] Failed to cache surah list", e);
  }
}

export async function getCachedAyahs(surahNumber: number): Promise<AyahEditions | null> {
  const db = getDB();
  if (!db) return null;
  try {
    const database = await db;
    const result = await database.get(STORE_AYAHS, surahNumber);
    return result ?? null;
  } catch {
    return null;
  }
}

export async function cacheAyahs(surahNumber: number, data: AyahEditions): Promise<void> {
  const db = getDB();
  if (!db) return;
  try {
    const database = await db;
    await database.put(STORE_AYAHS, data, surahNumber);
  } catch (e) {
    console.error("[DB] Failed to cache ayahs", e);
  }
}
