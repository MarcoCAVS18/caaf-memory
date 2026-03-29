/**
 * analyticsService
 *
 * Fire-and-forget Firestore writes for congress analytics.
 * All functions are silent on failure — they never block the user.
 *
 * Collections written:
 *   /players/{playerId}  — lastActiveAt kept up-to-date
 *   /games/{gameId}      — one document per completed game
 *
 * Game document schema:
 *   gameId, playerId, playerName, iconKey
 *   difficulty, outcome, score, elapsed, failedAttempts
 *   completedAt           — ISO timestamp
 *   shared                — true if user tapped "Compartir"
 *   sharedAt              — ISO timestamp of share action (null if not shared)
 *   sharedVia             — 'native' (Web Share API) | 'download' | null
 *   device.ua             — truncated user agent (≤250 chars)
 *   device.mobile         — boolean (coarse detection)
 *   device.screen         — e.g. "390x844"
 */

import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const warn = (label, err) =>
  console.warn(`[analytics] ${label} failed:`, err?.message ?? err)

// ── Device snapshot (called once per session) ────────────────────────────────

function getDeviceInfo() {
  return {
    ua:     navigator.userAgent.slice(0, 250),
    mobile: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent),
    screen: `${screen.width}x${screen.height}`,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Called when an existing player profile is loaded (app open / "login").
 *
 * Escribe el perfil completo con merge para dos propósitos:
 *   1. Re-sincroniza el documento si nunca se escribió en Firestore
 *      (caso: usuario registrado cuando las reglas eran deny-all).
 *   2. Actualiza lastActiveAt en cada sesión.
 *
 * @param {{ playerId, name, iconKey, createdAt }} profile
 */
export function trackLogin(profile) {
  const { playerId, name, iconKey, createdAt } = profile
  setDoc(
    doc(db, 'players', playerId),
    { playerId, name, iconKey, createdAt, lastActiveAt: new Date().toISOString() },
    { merge: true }
  ).catch((e) => warn('trackLogin', e))
}

/**
 * Called on Results page mount.
 * Creates one /games document for the completed session.
 * Returns the gameId so callers can reference it later (e.g. for trackShare).
 *
 * @returns {string} gameId
 */
export function trackGame({
  playerId,
  playerName,
  iconKey,
  difficulty,
  outcome,
  score,
  elapsed,
  failedAttempts,
}) {
  const gameId = `${playerId}_${Date.now().toString(36)}`

  setDoc(doc(db, 'games', gameId), {
    gameId,
    playerId,
    playerName:    playerName ?? '',
    iconKey:       iconKey    ?? '',
    difficulty,
    outcome,
    score:         outcome === 'win' ? score : 0,
    elapsed,
    failedAttempts,
    completedAt:   new Date().toISOString(),
    shared:        false,
    sharedAt:      null,
    sharedVia:     null,
    device:        getDeviceInfo(),
  }).catch((e) => warn('trackGame', e))

  return gameId
}

/**
 * Called when the user taps "Compartir Resultado".
 * Marks the game document as shared and records the share method.
 *
 * @param {string}             gameId
 * @param {'native'|'download'} via — 'native' = Web Share API, 'download' = canvas download
 */
export function trackShare(gameId, via = 'native') {
  if (!gameId) return
  setDoc(
    doc(db, 'games', gameId),
    {
      shared:    true,
      sharedAt:  new Date().toISOString(),
      sharedVia: via,
    },
    { merge: true }
  ).catch((e) => warn('trackShare', e))
}
