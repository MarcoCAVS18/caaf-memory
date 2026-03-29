/**
 * NavBar — Tactile Earth Design System
 *
 * Mobile  → full-width glass bar, rounded-t, safe-area padding
 * Tablet+ → floating centered pill, elevated above bottom edge
 */

import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function NavBar({ items = [] }) {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Gradient fade — prevents hard edge against page content */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none" />

      {/* Nav pill — mobile: full-width bar / tablet: floating centered pill */}
      <div
        className={[
          'relative pointer-events-auto mx-auto',
          'flex items-center justify-around',

          // Glass
          'bg-[var(--color-surface)]/80 backdrop-blur-[20px]',
          'shadow-[0_-8px_32px_rgba(11,14,9,0.45)]',

          // Mobile: flush to bottom, rounded top, full max-w
          'rounded-t-[1.75rem]',
          'border-t border-[var(--color-on-surface)]/10',
          'max-w-lg px-4 pt-3',

          // Tablet: floating pill, capped width, full border
          'md:rounded-[9999px]',
          'md:border md:border-[var(--color-outline-variant)]/25',
          'md:max-w-xs md:mb-5 md:px-2',
          'md:shadow-[0_8px_40px_rgba(11,14,9,0.5)]',
        ].join(' ')}
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.875rem)' }}
      >
        {items.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-1',
                'px-4 py-1.5 md:px-5',
                'rounded-[var(--radius-md)]',
                'transition-all duration-200',
                'min-w-[3.5rem] cursor-pointer',
                isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    'flex items-center justify-center rounded-full',
                    'w-10 h-6 md:w-12 md:h-7',
                    'transition-all duration-200',
                    isActive ? 'bg-[var(--color-primary-container)]' : '',
                  ].join(' ')}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </span>
                <span className="text-[0.625rem] font-semibold uppercase tracking-widest font-[family-name:var(--font-body)]">
                  {t(labelKey)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
