/**
 * Card — Tactile Earth Design System
 *
 * Elevation levels (no borders, only background shifts):
 *   low    → surface_container_low
 *   default→ surface_container_high
 *   high   → surface_bright
 *   game   → surface_container_high + hover scale + primary_fixed glow
 */

const elevations = {
  low:     'bg-[var(--color-surface-container-low)]',
  default: 'bg-[var(--color-surface-container-high)]',
  high:    'bg-[var(--color-surface-bright)]',
  game: [
    'bg-[var(--color-surface-container-high)]',
    'hover:bg-[var(--color-primary-fixed)/15]',
    'hover:scale-[1.02]',
    'cursor-pointer',
  ].join(' '),
}

export function Card({
  elevation = 'default',
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={[
        'rounded-[var(--radius-lg)]',
        'shadow-[0_8px_40px_0_rgba(11,14,9,0.40)]',
        'transition-all duration-200 ease-out',
        elevations[elevation],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
