/**
 * useGameState
 *
 * Core game state machine for Harvest Memory.
 *
 * Flip logic:
 *   1. Player clicks a face-down card → card flips to 'flipped'
 *   2. Second card clicked → evaluate pair:
 *      - Match  → both become 'matched', check win condition
 *      - Miss   → both briefly become 'mismatched', then reset to 'idle'
 *                 increment failedAttempts, check lose condition
 *
 * Phases: 'playing' → 'won' | 'lost'
 * The Game page watches `phase` and navigates to /results when it changes.
 */

import { useState, useEffect } from 'react'
import { GAME_CONFIG, generateCards, calculateScore } from '../pages/Game/gameConfig'

const MISMATCH_DELAY = 900  // ms before mismatched cards flip back

export function useGameState(difficulty = 'medium') {
  const config     = GAME_CONFIG[difficulty]
  const totalPairs = (config.cols * config.rows) / 2

  const [cards,          setCards]    = useState(() => generateCards(difficulty))
  const [flipped,        setFlipped]  = useState([])           // at most 2 card IDs
  const [matchedPairs,   setMatched]  = useState(new Set())    // set of matched pairIds
  const [failedAttempts, setFailed]   = useState(0)
  const [elapsed,        setElapsed]  = useState(0)            // seconds
  const [phase,          setPhase]    = useState('playing')    // 'playing'|'won'|'lost'
  const [locked,         setLocked]   = useState(false)        // blocks clicks while evaluating

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => {
      setElapsed((s) => {
        const next = s + 1
        if (config.timeLimitSec !== null && next >= config.timeLimitSec) {
          setPhase('lost')
        }
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Click handler ─────────────────────────────────────────────────────────────
  function handleCardClick(cardId) {
    if (locked || phase !== 'playing') return

    const card = cards.find((c) => c.id === cardId)
    if (!card) return

    // Ignore already-revealed or locked cards
    if (card.state === 'matched' || card.state === 'flipped' || card.state === 'mismatched') return
    if (flipped.length >= 2) return

    // Flip this card face-up
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, state: 'flipped' } : c)))
    const newFlipped = [...flipped, cardId]
    setFlipped(newFlipped)

    // First card — wait for the second
    if (newFlipped.length < 2) return

    // ── Second card: evaluate ──────────────────────────────────────────────────
    setLocked(true)
    const firstCard = cards.find((c) => c.id === newFlipped[0])

    if (firstCard.pairId === card.pairId) {
      // ✓ MATCH
      const newMatched = new Set([...matchedPairs, card.pairId])
      setMatched(newMatched)
      setCards((prev) =>
        prev.map((c) => (newFlipped.includes(c.id) ? { ...c, state: 'matched' } : c)),
      )
      setFlipped([])
      setLocked(false)
      if (newMatched.size === totalPairs) setPhase('won')
    } else {
      // ✗ MISMATCH — briefly show error state then reset
      setCards((prev) =>
        prev.map((c) => (newFlipped.includes(c.id) ? { ...c, state: 'mismatched' } : c)),
      )
      const newFailed  = failedAttempts + 1
      setFailed(newFailed)
      const willLose   = config.maxAttempts !== null && newFailed >= config.maxAttempts

      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (newFlipped.includes(c.id) ? { ...c, state: 'idle' } : c)),
        )
        setFlipped([])
        setLocked(false)
        if (willLose) setPhase('lost')
      }, MISMATCH_DELAY)
    }
  }

  // ── Derived values ────────────────────────────────────────────────────────────
  const attemptsLeft = config.maxAttempts !== null
    ? Math.max(0, config.maxAttempts - failedAttempts)
    : null

  const attemptsPercent = config.maxAttempts !== null
    ? Math.round((attemptsLeft / config.maxAttempts) * 100)
    : 100

  const timeLimitSec = config.timeLimitSec
  const timeLeft     = timeLimitSec !== null ? Math.max(0, timeLimitSec - elapsed) : null

  return {
    cards,
    elapsed,
    attemptsLeft,
    attemptsPercent,
    totalAttempts: config.maxAttempts,
    failedAttempts,
    matchedPairs:  matchedPairs.size,
    totalPairs,
    phase,
    score:         calculateScore(difficulty, elapsed, failedAttempts),
    locked,
    cols:          config.cols,
    timeLimitSec,
    timeLeft,
    handleCardClick,
  }
}
