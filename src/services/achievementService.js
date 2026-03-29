/**
 * achievementService
 *
 * Defines the 7 game medals and manages their localStorage persistence.
 * Firestore sync is fire-and-forget via profileService.updateProfile.
 *
 * Medal check flow:
 *   1. Game completes → caller builds a `stats` object
 *   2. Call checkAndGrantMedals(stats) → returns array of newly earned medals
 *   3. For each new medal, dispatch showAchievementToast(medal)
 */

import { Sprout, Leaf, Sun, Droplets, Zap, Flame, Trophy } from 'lucide-react'

const LS_KEY = 'caaf_medals'

// ── Medal catalogue ───────────────────────────────────────────────────────────

/**
 * `color` maps to design-system token groups:
 *   primary | secondary | tertiary | error
 *
 * `condition` receives a stats object:
 *   { gamesPlayed, gamesWon, hardWins, fastestWinSec, leaderboardRank }
 *   Any missing field is treated as 0 / null.
 */
export const MEDALS = [
  {
    id:        'primera_siembra',
    icon:      Sprout,
    color:     'primary',
    nameKey:   'achievements.medals.primera_siembra.name',
    descKey:   'achievements.medals.primera_siembra.desc',
    condition: (s) => (s.gamesPlayed ?? 0) >= 1,
  },
  {
    id:        'suelo_fertil',
    icon:      Leaf,
    color:     'primary',
    nameKey:   'achievements.medals.suelo_fertil.name',
    descKey:   'achievements.medals.suelo_fertil.desc',
    condition: (s) => (s.gamesPlayed ?? 0) >= 5,
  },
  {
    id:        'flujo_optimo',
    icon:      Droplets,
    color:     'tertiary',
    nameKey:   'achievements.medals.flujo_optimo.name',
    descKey:   'achievements.medals.flujo_optimo.desc',
    condition: (s) => (s.gamesPlayed ?? 0) >= 10,
  },
  {
    id:        'cosecha_express',
    icon:      Zap,
    color:     'secondary',
    nameKey:   'achievements.medals.cosecha_express.name',
    descKey:   'achievements.medals.cosecha_express.desc',
    condition: (s) => s.fastestWinSec != null && s.fastestWinSec <= 20,
  },
  {
    id:        'horizonte_despejado',
    icon:      Sun,
    color:     'secondary',
    nameKey:   'achievements.medals.horizonte_despejado.name',
    descKey:   'achievements.medals.horizonte_despejado.desc',
    condition: (s) => s.leaderboardRank != null && s.leaderboardRank <= 3,
  },
  {
    id:        'maestro_cosechador',
    icon:      Flame,
    color:     'error',
    nameKey:   'achievements.medals.maestro_cosechador.name',
    descKey:   'achievements.medals.maestro_cosechador.desc',
    condition: (s) => (s.hardWins ?? 0) >= 1,
  },
  {
    id:        'leyenda_dorada',
    icon:      Trophy,
    color:     'secondary',
    nameKey:   'achievements.medals.leyenda_dorada.name',
    descKey:   'achievements.medals.leyenda_dorada.desc',
    condition: (s) => s.leaderboardRank === 1,
  },
]

// ── Storage helpers ───────────────────────────────────────────────────────────

export function getEarnedMedalIds() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) ?? []
  } catch {
    return []
  }
}

/**
 * Marks a medal as earned in localStorage.
 * Returns `true` if this is a **new** earn (wasn't earned before).
 */
function grantMedal(id) {
  const earned = getEarnedMedalIds()
  if (earned.includes(id)) return false
  localStorage.setItem(LS_KEY, JSON.stringify([...earned, id]))
  return true
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Checks all medals against the provided stats snapshot and grants any
 * newly-unlocked ones. Returns an array of medal objects that were
 * earned for the first time — callers should display toasts for these.
 *
 * @param {{ gamesPlayed?: number, gamesWon?: number, hardWins?: number,
 *           fastestWinSec?: number|null, leaderboardRank?: number|null }} stats
 * @returns {typeof MEDALS[number][]}
 */
export function checkAndGrantMedals(stats) {
  return MEDALS.filter((medal) => {
    if (!medal.condition(stats)) return false
    return grantMedal(medal.id)
  })
}
