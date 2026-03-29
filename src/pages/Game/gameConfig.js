/**
 * gameConfig
 *
 * Central source of truth for game rules, symbols, and scoring.
 *
 * Grid sizes:
 *   easy   → 4 cols × 3 rows = 12 cards = 6 pairs
 *   medium → 4 cols × 4 rows = 16 cards = 8 pairs
 *   hard   → 5 cols × 6 rows = 30 cards = 15 pairs
 *
 * maxAttempts: number of WRONG pair flips allowed before losing.
 *   null = infinite (easy mode)
 */

import {
  Leaf, Sprout, Sun, Flame, Droplets,
  Wind, TreePine, Bird, Star, Moon,
  Mountain, Flower, Cloud, Snowflake, Zap,
} from 'lucide-react'

// ── 15 symbols (enough for Hard mode's 15 pairs) ─────────────────────────────

export const GAME_SYMBOLS = [
  { key: 'leaf',      icon: Leaf,      color: 'primary'   },
  { key: 'sprout',    icon: Sprout,    color: 'primary'   },
  { key: 'sun',       icon: Sun,       color: 'secondary' },
  { key: 'flame',     icon: Flame,     color: 'secondary' },
  { key: 'droplets',  icon: Droplets,  color: 'tertiary'  },
  { key: 'wind',      icon: Wind,      color: 'tertiary'  },
  { key: 'tree',      icon: TreePine,  color: 'primary'   },
  { key: 'bird',      icon: Bird,      color: 'secondary' },
  { key: 'star',      icon: Star,      color: 'secondary' },
  { key: 'moon',      icon: Moon,      color: 'tertiary'  },
  { key: 'mountain',  icon: Mountain,  color: 'primary'   },
  { key: 'flower',    icon: Flower,    color: 'tertiary'  },
  { key: 'cloud',     icon: Cloud,     color: 'secondary' },
  { key: 'snowflake', icon: Snowflake, color: 'tertiary'  },
  { key: 'zap',       icon: Zap,       color: 'secondary' },
]

/** Fast lookup: key → symbol object */
export const SYMBOL_MAP = Object.fromEntries(GAME_SYMBOLS.map((s) => [s.key, s]))

// ── Difficulty configuration ──────────────────────────────────────────────────

export const GAME_CONFIG = {
  easy: {
    cols:           4,
    rows:           3,       // 12 cards = 6 pairs
    maxAttempts:    null,    // unlimited wrong attempts
    timeLimitSec:   null,    // no time limit
    baseScore:      1000,
    timePenalty:    1,       // pts deducted per second elapsed
    attemptPenalty: 0,
  },
  medium: {
    cols:           4,
    rows:           4,       // 16 cards = 8 pairs
    maxAttempts:    10,      // lose after 10 wrong flips
    timeLimitSec:   null,    // no time limit
    baseScore:      3000,
    timePenalty:    5,
    attemptPenalty: 100,     // pts deducted per wrong flip
  },
  hard: {
    cols:           5,
    rows:           6,       // 30 cards = 15 pairs
    maxAttempts:    10,      // lose after 10 wrong flips
    timeLimitSec:   60,      // lose if 60 seconds elapse
    baseScore:      8000,
    timePenalty:    10,
    attemptPenalty: 300,
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Generates a fresh, shuffled card array for the given difficulty.
 * Each card: { id, pairId, iconKey, color, state }
 */
export function generateCards(difficulty) {
  const { cols, rows } = GAME_CONFIG[difficulty]
  const pairsNeeded    = (cols * rows) / 2
  const symbols        = GAME_SYMBOLS.slice(0, pairsNeeded)
  return shuffle([...symbols, ...symbols]).map((sym, i) => ({
    id:      `card_${i}`,
    pairId:  sym.key,
    iconKey: sym.key,
    color:   sym.color,
    state:   'idle',          // 'idle' | 'flipped' | 'matched' | 'mismatched'
  }))
}

/**
 * Score formula:
 *   base - (elapsedSec × timePenalty) - (failedAttempts × attemptPenalty)
 *   Floored at 100 — you always get something.
 */
export function calculateScore(difficulty, elapsedSec, failedAttempts) {
  const { baseScore, timePenalty, attemptPenalty } = GAME_CONFIG[difficulty]
  return Math.max(
    100,
    Math.round(baseScore - elapsedSec * timePenalty - failedAttempts * attemptPenalty),
  )
}
