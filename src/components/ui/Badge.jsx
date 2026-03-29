/**
 * Badge — Tactile Earth Design System
 *
 * Variants:
 *   primary   → primary tint
 *   secondary → secondary (golden) — success/reward states
 *   tertiary  → tertiary tint
 *   surface   → muted surface
 *   error     → error state
 */

const variants = {
  primary: 'bg-[var(--color-primary-container)] text-[var(--color-primary)]',
  secondary: 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]',
  tertiary: 'bg-[var(--color-tertiary-container)] text-[var(--color-tertiary)]',
  surface: 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]',
  error: 'bg-[var(--color-error-container)] text-[var(--color-error)]',
}

export function Badge({ variant = 'surface', className = '', children }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1',
        'px-2.5 py-0.5',
        'rounded-[var(--radius-sm)]',
        'text-xs font-semibold',
        'font-[family-name:var(--font-body)]',
        variants[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
