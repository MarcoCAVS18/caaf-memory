import { useState, useEffect, useCallback } from 'react'
import { getLocalProfile, saveProfile } from '../services/profileService'
import { trackLogin } from '../services/analyticsService'

/** Generates a simple collision-resistant ID for the player */
function generatePlayerId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * useProfile
 *
 * Returns:
 *   profile       — current profile object | null
 *   isLoading     — true during initial check
 *   needsOnboarding — true if no profile found → show modal
 *   createProfile — (name, iconKey) → Promise<void>
 */
export function useProfile() {
  const [profile, setProfile]   = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const existing = getLocalProfile()
    setProfile(existing)
    setLoading(false)
    // Pasa el perfil completo para que trackLogin pueda re-sincronizar
    // el documento en Firestore si nunca llegó a escribirse (reglas antiguas).
    if (existing) trackLogin(existing)
  }, [])

  // Reset state when clearProfile() fires the logout event
  useEffect(() => {
    function onLogout() { setProfile(null) }
    window.addEventListener('caaf:logout', onLogout)
    return () => window.removeEventListener('caaf:logout', onLogout)
  }, [])

  const createProfile = useCallback(async (name, iconKey) => {
    const playerId = generatePlayerId()
    const saved    = await saveProfile({ name, iconKey, playerId })
    setProfile(saved)
  }, [])

  return {
    profile,
    isLoading,
    needsOnboarding: !isLoading && !profile,
    createProfile,
  }
}
