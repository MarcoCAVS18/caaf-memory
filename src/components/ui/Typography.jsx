/**
 * Typography — Tactile Earth Design System
 *
 * Display/Headlines → Epilogue (tight -0.02em tracking)
 * Body/Labels       → Manrope
 *
 * Scales:
 *   display-lg  3.5rem  — Hero Moments only
 *   display-md  2.5rem
 *   display-sm  2rem
 *   headline-lg 1.75rem
 *   headline-md 1.5rem
 *   headline-sm 1.25rem
 *   title-lg    1.125rem
 *   title-md    1rem
 *   body-lg     1rem
 *   body-md     0.875rem
 *   label-md    0.75rem
 *   label-sm    0.625rem
 */

const scales = {
  'display-lg':  'text-[3.5rem] leading-[1.1] font-[family-name:var(--font-display)] font-black tracking-[-0.02em]',
  'display-md':  'text-[2.5rem] leading-[1.15] font-[family-name:var(--font-display)] font-extrabold tracking-[-0.02em]',
  'display-sm':  'text-[2rem] leading-[1.2] font-[family-name:var(--font-display)] font-bold tracking-[-0.02em]',
  'headline-lg': 'text-[1.75rem] leading-[1.25] font-[family-name:var(--font-display)] font-bold tracking-[-0.02em]',
  'headline-md': 'text-[1.5rem] leading-[1.3] font-[family-name:var(--font-display)] font-semibold tracking-[-0.02em]',
  'headline-sm': 'text-[1.25rem] leading-[1.35] font-[family-name:var(--font-display)] font-semibold tracking-[-0.015em]',
  'title-lg':    'text-[1.125rem] leading-[1.4] font-[family-name:var(--font-body)] font-semibold',
  'title-md':    'text-base leading-[1.5] font-[family-name:var(--font-body)] font-semibold',
  'body-lg':     'text-base leading-[1.6] font-[family-name:var(--font-body)] font-normal',
  'body-md':     'text-sm leading-[1.6] font-[family-name:var(--font-body)] font-normal',
  'label-md':    'text-xs leading-[1.4] font-[family-name:var(--font-body)] font-semibold uppercase tracking-widest',
  'label-sm':    'text-[0.625rem] leading-[1.4] font-[family-name:var(--font-body)] font-semibold uppercase tracking-widest',
}

const colorMap = {
  default:  'text-[var(--color-on-surface)]',
  muted:    'text-[var(--color-on-surface-variant)]',
  primary:  'text-[var(--color-primary)]',
  secondary:'text-[var(--color-secondary)]',
  tertiary: 'text-[var(--color-tertiary)]',
  error:    'text-[var(--color-error)]',
}

const tagMap = {
  'display-lg':  'h1',
  'display-md':  'h1',
  'display-sm':  'h2',
  'headline-lg': 'h2',
  'headline-md': 'h3',
  'headline-sm': 'h4',
  'title-lg':    'p',
  'title-md':    'p',
  'body-lg':     'p',
  'body-md':     'p',
  'label-md':    'span',
  'label-sm':    'span',
}

export function Text({
  scale = 'body-md',
  color = 'default',
  as,
  className = '',
  children,
  ...props
}) {
  const Tag = as ?? tagMap[scale] ?? 'p'

  return (
    <Tag
      className={[scales[scale], colorMap[color], className].join(' ')}
      {...props}
    >
      {children}
    </Tag>
  )
}
