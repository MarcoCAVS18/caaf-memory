import { useEffect, useRef, useState } from 'react'

/**
 * useInView
 *
 * Observes when an element enters the viewport using IntersectionObserver.
 *
 * @param {object} options
 * @param {number}  options.threshold  — 0–1, how much of the element must be visible (default 0.12)
 * @param {string}  options.rootMargin — CSS margin on the viewport (default '-32px')
 * @param {boolean} options.once       — stop observing after first intersection (default true)
 *
 * @returns {{ ref, inView }}
 */
export function useInView({
  threshold  = 0.12,
  rootMargin = '-32px',
  once       = true,
} = {}) {
  const ref    = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If IntersectionObserver is not supported (very old browsers), show immediately
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}
