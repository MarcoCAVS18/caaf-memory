/**
 * scoreService
 *
 * Persists game scores to Firestore using a per-difficulty leaderboard document.
 * Schema: /leaderboards/{difficulty}  →  { scores: ScoreEntry[] }
 *
 * Each document holds the top 10 scores, sorted descending by points.
 * Writes use a transaction to prevent race conditions.
 */

import { doc, getDoc, runTransaction } from 'firebase/firestore'
import { db } from '../lib/firebase'

/**
 * Saves a completed-game score into the leaderboard.
 * Fire-and-forget — the UI is never blocked.
 *
 * @param {{ playerId: string, playerName: string, iconKey: string, difficulty: string, points: number }} entry
 */
/**
 * Saves a score and returns the player's leaderboard rank (1-based),
 * or null if the score did not make the top 10.
 */
export async function saveScore({ playerId, playerName, iconKey, difficulty, points }) {
  const ref = doc(db, 'leaderboards', difficulty)
  const entry = {
    playerId,
    playerName,
    iconKey,
    points,
    savedAt: new Date().toISOString(),
  }

  try {
    const rank = await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref)
      const current = snap.exists() ? (snap.data().scores ?? []) : []
      const updated = [...current, entry]
        .sort((a, b) => b.points - a.points)
        .slice(0, 10)
      tx.set(ref, { scores: updated })
      const idx = updated.findIndex((s) => s.playerId === playerId && s.points === points)
      return idx >= 0 ? idx + 1 : null
    })
    return rank
  } catch (err) {
    console.warn('[scoreService] Firestore write failed:', err.message)
    return null
  }
}

/**
 * Fetches the top-10 leaderboard for a given difficulty.
 * Returns [] on any error (offline, no data, etc.).
 *
 * @param {'easy'|'medium'|'hard'} difficulty
 * @returns {Promise<ScoreEntry[]>}
 */
export async function getLeaderboard(difficulty) {
  try {
    const snap = await getDoc(doc(db, 'leaderboards', difficulty))
    return snap.exists() ? (snap.data().scores ?? []) : []
  } catch (err) {
    console.warn('[scoreService] Firestore read failed:', err.message)
    return []
  }
}
