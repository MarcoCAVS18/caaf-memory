import { useTheme } from '../../hooks/useTheme'

/**
 * ThemedLogo — full logo (logo.svg / logo-black.svg)
 * Dark mode → logo.svg (colored), Light mode → logo-black.svg (#121212)
 */
export function ThemedLogo({ className = 'h-8 w-auto', alt = 'CAAF' }) {
  const { resolvedMode } = useTheme()
  const src = resolvedMode === 'light'
    ? '/images/logo-black.svg'
    : '/images/logo.svg'

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      draggable={false}
    />
  )
}

/**
 * ThemedIsologo — isologo as monochrome mask
 * Dark mode → white, Light mode → #121212
 * Accepts width/height via `size` (CSS value, default '32px').
 */
export function ThemedIsologo({ size = '32px', style = {}, className = '' }) {
  const { resolvedMode } = useTheme()
  const color = resolvedMode === 'light' ? '#121212' : '#ffffff'

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: 'url(/images/isologo.svg)',
        maskImage: 'url(/images/isologo.svg)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}
