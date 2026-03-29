import { useState, useEffect } from 'react'

const STORAGE_KEY = 'caaf_theme'
const VALID_MODES = ['dark', 'light', 'system']

function getSystemIsDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(mode) {
  const root = document.documentElement
  const isDark = mode === 'dark' || (mode === 'system' && getSystemIsDark())
  root.classList.toggle('light', !isDark)
  root.classList.toggle('dark',   isDark)
}

/**
 * useTheme
 *
 * Returns:
 *   mode        — 'dark' | 'light' | 'system'
 *   setMode     — (mode) => void
 *   resolvedMode— 'dark' | 'light'  (the actual applied mode)
 */
export function useTheme() {
  const [mode, setModeState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return VALID_MODES.includes(saved) ? saved : 'dark'
  })

  useEffect(() => {
    applyTheme(mode)
  }, [mode])

  // React to system preference changes when mode === 'system'
  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  function setMode(newMode) {
    localStorage.setItem(STORAGE_KEY, newMode)
    setModeState(newMode)
  }

  const resolvedMode =
    mode === 'system'
      ? (getSystemIsDark() ? 'dark' : 'light')
      : mode

  return { mode, setMode, resolvedMode }
}
