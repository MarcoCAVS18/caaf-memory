/**
 * profileService
 *
 * Persists the player profile using Firebase Firestore as primary store
 * and localStorage as fallback (if Firebase is unavailable or not yet configured).
 *
 * Schema:
 *   /players/{playerId}
 *     name:      string
 *     iconKey:   string
 *     createdAt: ISO string
 */

import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

const LS_KEY = 'caaf_player'

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToStorage(profile) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(profile))
  } catch {
    // storage full or private mode — silently fail
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the existing player profile from localStorage.
 * Firestore is intentionally NOT read on every boot for speed —
 * localStorage is the source of truth for the session.
 */
export function getLocalProfile() {
  return loadFromStorage()
}

/**
 * Saves a new player profile.
 *   1. Writes to localStorage immediately (sync).
 *   2. Attempts to write to Firestore (async, fire-and-forget).
 *
 * Returns the saved profile object.
 */
export async function saveProfile({ name, iconKey, playerId }) {
  const profile = {
    playerId,
    name:      name.trim(),
    iconKey,
    createdAt: new Date().toISOString(),
  }

  // 1. localStorage — always first, never blocks UI
  saveToStorage(profile)

  // 2. Firestore — truly fire-and-forget (no await).
  //    Using .catch() instead of await+try so the UI is NEVER blocked
  //    by a pending/failing network call.
  setDoc(doc(db, 'players', playerId), profile).catch((err) =>
    console.warn('[profileService] Firestore write failed, localStorage is source of truth:', err.message)
  )

  return profile
}

/**
 * Looks up an existing player by name + iconKey.
 *
 * Returns the full profile object if found, or null if free / unreachable.
 * Used both for duplicate-check and session recovery.
 */
export async function findProfileByNameAndIcon(name, iconKey) {
  try {
    const q    = query(collection(db, 'players'), where('name', '==', name.trim()))
    const snap = await getDocs(q)
    const match = snap.docs.find((d) => d.data().iconKey === iconKey)
    return match ? match.data() : null
  } catch (err) {
    console.warn('[profileService] lookup failed, allowing through:', err.message)
    return null  // fail open — never block the user due to a network error
  }
}

/**
 * Restores a previously saved profile from Firestore into localStorage.
 * Used when the player recovers their session after losing localStorage.
 */
export async function recoverProfile(playerId) {
  try {
    const snap = await getDoc(doc(db, 'players', playerId))
    if (!snap.exists()) return null
    const profile = snap.data()
    saveToStorage(profile)
    return profile
  } catch (err) {
    console.warn('[profileService] recovery failed:', err.message)
    return null
  }
}

/**
 * Clears the player session from localStorage and signals all mounted
 * `useProfile` instances to reset via the `caaf:logout` DOM event.
 * Game stats and medals are also cleared (fresh start).
 * Language and theme preferences are intentionally preserved.
 */
export function clearProfile() {
  ['caaf_player', 'caaf_stats', 'caaf_medals'].forEach((key) => {
    try { localStorage.removeItem(key) } catch {}
  })
  window.dispatchEvent(new CustomEvent('caaf:logout'))
}

/**
 * Updates an existing profile field (e.g. score, lastPlayed).
 * Mirrors the same dual-write strategy.
 */
export async function updateProfile(patch) {
  const current = loadFromStorage()
  if (!current) return

  const updated = { ...current, ...patch }
  saveToStorage(updated)

  setDoc(doc(db, 'players', current.playerId), updated, { merge: true }).catch((err) =>
    console.warn('[profileService] Firestore update failed:', err.message)
  )

  return updated
}
