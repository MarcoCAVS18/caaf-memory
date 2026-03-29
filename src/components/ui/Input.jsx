/**
 * Input — Tactile Earth Design System
 *
 * - Container: surface_container_lowest
 * - Active: surface_container_low + ghost border (surface_tint 20%)
 * - Label: label-md in on_surface_variant
 * - No hard borders (ghost border only on focus)
 */

export function Input({
  label,
  id,
  error,
  className = '',
  ...props
}) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] font-[family-name:var(--font-body)]"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={[
          'w-full px-4 py-3',
          'bg-[var(--color-surface-container-lowest)]',
          'text-[var(--color-on-surface)] text-sm',
          'font-[family-name:var(--font-body)]',
          'rounded-[var(--radius-md)]',
          'outline-none',
          'transition-all duration-200',
          'placeholder:text-[var(--color-on-surface-variant)]',
          // ghost border on focus
          'focus:bg-[var(--color-surface-container-low)]',
          'focus:ring-2 focus:ring-[var(--color-surface-tint)/20]',
          error ? 'ring-2 ring-[var(--color-error)/40]' : '',
          className,
        ].join(' ')}
        {...props}
      />

      {error && (
        <p className="text-xs text-[var(--color-error)] font-[family-name:var(--font-body)]">
          {error}
        </p>
      )}
    </div>
  )
}
