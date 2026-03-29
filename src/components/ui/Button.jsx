/**
 * Button — Tactile Earth Design System
 *
 * Variants:
 *   primary   → gradient primary→primary_container (135deg)
 *   secondary → surface_container_highest, no border
 *   tertiary  → text-only in secondary (#e9c176)
 */

const variants = {
  primary: [
    'text-[var(--color-on-primary)]',
    'bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-container))]',
    'hover:brightness-110',
  ].join(' '),

  secondary: [
    'bg-[var(--color-surface-container-highest)]',
    'text-[var(--color-on-surface)]',
    'hover:bg-[var(--color-surface-bright)]',
  ].join(' '),

  tertiary: [
    'bg-transparent',
    'text-[var(--color-secondary)]',
    'hover:text-[var(--color-primary)]',
  ].join(' '),

  danger: [
    'bg-transparent',
    'border border-[var(--color-error)]/30',
    'text-[var(--color-error)]',
    'hover:bg-[var(--color-error-container)]/30',
  ].join(' '),
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-[family-name:var(--font-body)] font-semibold',
        'rounded-[var(--radius-md)]',
        'transition-all duration-200 ease-out',
        'cursor-pointer select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
