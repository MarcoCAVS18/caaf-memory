/**
 * AchievementToast
 *
 * A self-contained notification that slides in from the top whenever a new
 * medal is earned. Driven by a custom DOM event so it works from anywhere
 * in the app without needing a context provider.
 *
 * Usage:
 *   import { showAchievementToast } from '../ui/AchievementToast'
 *   showAchievementToast(medal)   // medal is one entry from MEDALS array
 *
 * The <AchievementToast /> component must be mounted once (done in AppShell).
 */

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

const TOAST_EVENT    = 'caaf:achievement'
const AUTO_DISMISS   = 4200   // ms

// ── Trigger (callable from anywhere) ─────────────────────────────────────────

export function showAchievementToast(medal) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: medal }))
}

// ── Color maps ────────────────────────────────────────────────────────────────

const iconBg = {
  primary:   'bg-[var(--color-primary-container)] text-[var(--color-primary)]',
  secondary: 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]',
  tertiary:  'bg-[var(--color-tertiary-container)] text-[var(--color-tertiary)]',
  error:     'bg-[var(--color-error-container)] text-[var(--color-error)]',
}

const accentText = {
  primary:   'text-[var(--color-primary)]',
  secondary: 'text-[var(--color-secondary)]',
  tertiary:  'text-[var(--color-tertiary)]',
  error:     'text-[var(--color-error)]',
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AchievementToast() {
  const { t }                     = useTranslation()
  const [toast, setToast]         = useState(null)   // medal object | null
  const [visible, setVisible]     = useState(false)  // drives CSS class
  const [timerId, setTimerId]     = useState(null)

  const dismiss = useCallback(() => {
    setVisible(false)
    setTimeout(() => setToast(null), 350) // wait for exit animation
  }, [])

  useEffect(() => {
    function handler(e) {
      // Reset any existing timer
      if (timerId) clearTimeout(timerId)

      setToast(e.detail)
      // Trigger enter animation next frame
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))

      const id = setTimeout(dismiss, AUTO_DISMISS)
      setTimerId(id)
    }

    window.addEventListener(TOAST_EVENT, handler)
    return () => window.removeEventListener(TOAST_EVENT, handler)
  }, [dismiss, timerId])

  if (!toast) return null

  const Icon = toast.icon

  return (
    <div
      className={[
        // Position — below TopAppBar, centered
        'fixed top-16 md:top-20 left-1/2 z-[60]',
        'w-[calc(100%-2rem)] max-w-sm',
        '-translate-x-1/2',

        // Card
        'rounded-[var(--radius-2xl)]',
        'bg-[var(--color-surface-bright)]/90 backdrop-blur-xl',
        'shadow-[0_8px_40px_rgba(11,14,9,0.6)]',
        'border border-[var(--color-outline-variant)]/20',

        // Layout
        'flex items-center gap-4 px-5 py-4',

        // Slide + fade animation
        'transition-all duration-350 ease-out',
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none',
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      {/* Medal icon */}
      <div
        className={[
          'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
          iconBg[toast.color] ?? iconBg.primary,
        ].join(' ')}
      >
        <Icon size={22} strokeWidth={2} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-0.5">
          {t('achievements.toast.title')}
        </p>
        <p className={[
          'font-headline font-bold text-sm leading-tight truncate',
          accentText[toast.color] ?? accentText.primary,
        ].join(' ')}>
          {t(toast.nameKey)}
        </p>
        <p className="text-xs text-[var(--color-on-surface-variant)] truncate mt-0.5">
          {t(toast.descKey)}
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors flex-shrink-0 cursor-pointer"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  )
}
