/**
 * statsService
 *
 * Tracks cumulative game statistics in localStorage.
 * These are read by achievementService to check medal conditions.
 *
 * Schema (caaf_stats):
 *   gamesPlayed   — total games completed (win or lose)
 *   gamesWon      — total wins
 *   easyWins      — wins on easy difficulty
 *   mediumWins    — wins on medium difficulty
 *   hardWins      — wins on hard difficulty
 *   fastestWinSec — fastest win in seconds (null = never won)
 */

const LS_KEY = 'caaf_stats'

const DEFAULT_STATS = {
  gamesPlayed:   0,
  gamesWon:      0,
  easyWins:      0,
  mediumWins:    0,
  hardWins:      0,
  fastestWinSec: null,
}

export function getStats() {
  try {
    return { ...DEFAULT_STATS, ...JSON.parse(localStorage.getItem(LS_KEY)) }
  } catch {
    return { ...DEFAULT_STATS }
  }
}

/**
 * Records the outcome of a completed game and returns the updated stats.
 * Call this from the Results page on mount.
 *
 * @param {'win'|'lose'} outcome
 * @param {'easy'|'medium'|'hard'} difficulty
 * @param {number} elapsedSec
 * @returns {object} updated stats
 */
export function recordGame(outcome, difficulty, elapsedSec) {
  const prev    = getStats()
  const isWin   = outcome === 'win'
  const diffKey = `${difficulty}Wins`

  const updated = {
    ...prev,
    gamesPlayed: prev.gamesPlayed + 1,
    gamesWon:    prev.gamesWon + (isWin ? 1 : 0),
    [diffKey]:   (prev[diffKey] ?? 0) + (isWin ? 1 : 0),
    fastestWinSec: isWin
      ? (prev.fastestWinSec === null ? elapsedSec : Math.min(prev.fastestWinSec, elapsedSec))
      : prev.fastestWinSec,
  }

  try {
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
  } catch {
    // storage full — silently ignore
  }

  return updated
}
