import { useState, useEffect } from 'react'
import { getLeaderboard } from '../services/scoreService'

/**
 * Fetches the top-10 leaderboard for a given difficulty level.
 * Re-fetches automatically when `difficulty` changes.
 */
export function useLeaderboard(difficulty) {
  const [scores, setScores]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getLeaderboard(difficulty).then((data) => {
      if (!cancelled) {
        setScores(data)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [difficulty])

  return { scores, loading }
}
