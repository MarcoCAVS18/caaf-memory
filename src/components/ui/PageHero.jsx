/**
 * PageHero
 *
 * Thin decorative hero strip with a background image.
 * The image is anchored to the bottom of the container (bottom-0, h-auto)
 * so the lower portion of the photo is always visible regardless of
 * the container height — no object-position guessing needed.
 *
 * Gradients use `var(--color-surface)` → adapts to dark / light mode.
 *
 * Props:
 *   src       — image path (from /public)
 *   alt       — image alt text
 *   height    — container height CSS value (default '220px')
 *   children  — content rendered on top of the image, bottom-aligned
 */
export function PageHero({
  src,
  alt = '',
  height = '220px',
  children,
}) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height }}>

      {/* Image anchored to bottom — shows the lower part of the photo naturally */}
      <img
        src={src}
        alt={alt}
        className="absolute bottom-0 left-0 w-full h-auto"
        loading="eager"
      />

      {/* Top fade — blends with the surface above (TopAppBar area) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)] via-[var(--color-surface)]/30 to-transparent" />

      {/* Bottom fade + blur — soft transition into the page content */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(to top, var(--color-surface) 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent)',
          maskImage: 'linear-gradient(to top, black 60%, transparent)',
        }}
      />

      {/* Content — badge + title, sits at the bottom of the strip */}
      {children && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="w-full max-w-2xl mx-auto px-4 pb-6">
            {children}
          </div>
        </div>
      )}
    </section>
  )
}
