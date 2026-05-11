/**
 * gameConfig
 *
 * Central source of truth for game rules, symbols, and scoring.
 *
 * Grid sizes:
 *   easy   → 4 cols × 3 rows = 12 cards = 6 pairs
 *   medium → 4 cols × 4 rows = 16 cards = 8 pairs
 *   hard   → 4 cols × 4 rows = 16 cards = 8 pairs
 *
 * maxAttempts: number of WRONG pair flips allowed before losing.
 *   null = infinite (easy mode)
 */

// ── 8 symbols (enough for Medium & Hard mode's 8 pairs) ──────────────────────

const IMG = (file) => `/images/1x/${encodeURIComponent(file)}`

export const GAME_SYMBOLS = [
  { key: 'card1', image: IMG('Mesa de trabajo 1-100.jpg'),          color: 'primary'   },
  { key: 'card2', image: IMG('Mesa de trabajo 1 copia-100.jpg'),    color: 'secondary' },
  { key: 'card3', image: IMG('Mesa de trabajo 1 copia 2-100.jpg'),  color: 'tertiary'  },
  { key: 'card4', image: IMG('Mesa de trabajo 1 copia 3-100.jpg'),  color: 'primary'   },
  { key: 'card5', image: IMG('Mesa de trabajo 1 copia 4-100.jpg'),  color: 'secondary' },
  { key: 'card6', image: IMG('Mesa de trabajo 1 copia 5-100.jpg'),  color: 'tertiary'  },
  { key: 'card7', image: IMG('Mesa de trabajo 1 copia 6-100.jpg'),  color: 'primary'   },
  { key: 'card8', image: IMG('Mesa de trabajo 2-100.jpg'),          color: 'secondary' },
]

/** Fast lookup: key → symbol object */
export const SYMBOL_MAP = Object.fromEntries(GAME_SYMBOLS.map((s) => [s.key, s]))

/** All game card image URLs — used for preloading. */
export const GAME_IMAGES = GAME_SYMBOLS.map((s) => s.image)

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
    cols:           4,
    rows:           4,       // 16 cards = 8 pairs
    maxAttempts:    10,      // lose after 10 wrong flips
    timeLimitSec:   40,      // lose if 40 seconds elapse
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
