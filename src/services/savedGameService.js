/**
 * savedGameService
 *
 * Persists an in-progress game to Firestore so the player can resume
 * on any device or session.
 *
 * Firestore schema:
 *   /savedGames/{playerId}
 *     difficulty:      string
 *     cards:           Card[]       (mid-flip cards reset to 'idle')
 *     elapsed:         number       (seconds)
 *     failedAttempts:  number
 *     matchedPairs:    string[]     (pairId array, serialised from Set)
 *     savedAt:         number       (Date.now())
 *
 * A localStorage mirror is kept for synchronous reads during the
 * initial render (Firestore reads are async).
 */

import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { db }                              from '../lib/firebase'
import { getLocalProfile }                 from './profileService'

const LS_KEY    = 'caaf_saved_game'
const COLL      = 'savedGames'

// ── Local cache helpers ───────────────────────────────────────────────────────

function writeCache(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

function clearCache() {
  try { localStorage.removeItem(LS_KEY) } catch { /* ignore */ }
}

function readCache() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? null } catch { return null }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Save the current game state.
 * Cards that are mid-flip (flipped/mismatched) are reset to 'idle'.
 * Writes to Firestore; also updates the local cache immediately.
 */
export function saveGame({ difficulty, cards, elapsed, failedAttempts, matchedPairs }) {
  const cleaned = cards.map((c) =>
    c.state === 'matched' ? c : { ...c, state: 'idle' },
  )
  const data = {
    difficulty,
    cards:          cleaned,
    elapsed,
    failedAttempts,
    matchedPairs:   [...matchedPairs],
    savedAt:        Date.now(),
  }

  writeCache(data)

  const profile = getLocalProfile()
  if (profile?.playerId) {
    setDoc(doc(db, COLL, profile.playerId), data).catch((err) =>
      console.warn('[savedGameService] Firestore write failed:', err),
    )
  }
}

/**
 * Returns the saved game synchronously from localStorage cache.
 * Call `fetchSavedGame()` on mount if you need the authoritative Firestore value.
 */
export function getSavedGame() {
  return readCache()
}

/**
 * Fetches the saved game from Firestore and refreshes the local cache.
 * Returns the saved game or null.
 */
export async function fetchSavedGame() {
  const profile = getLocalProfile()
  if (!profile?.playerId) return readCache()

  try {
    const snap = await getDoc(doc(db, COLL, profile.playerId))
    if (!snap.exists()) {
      clearCache()
      return null
    }
    const data = snap.data()
    writeCache(data)
    return data
  } catch (err) {
    console.warn('[savedGameService] Firestore read failed, using cache:', err)
    return readCache()
  }
}

/**
 * Delete the saved game (call on win, lose, or when starting a fresh game).
 */
export function clearSavedGame() {
  clearCache()

  const profile = getLocalProfile()
  if (profile?.playerId) {
    deleteDoc(doc(db, COLL, profile.playerId)).catch((err) =>
      console.warn('[savedGameService] Firestore delete failed:', err),
    )
  }
}
