import { Children, cloneElement, isValidElement } from 'react'
import { useInView } from '../../hooks/useInView'

/**
 * FadeIn
 *
 * Wraps any element and fades it in (+ subtle translate) when it scrolls
 * into view. Uses IntersectionObserver — zero scroll event overhead.
 *
 * Automatically respects `prefers-reduced-motion`: if the OS has reduced
 * motion enabled, the element is visible immediately with no transition.
 *
 * Props:
 *   from      — direction of entrance: 'bottom' | 'top' | 'left' | 'right' | 'none'
 *   delay     — ms before transition starts (default 0)
 *   duration  — ms of the transition (default 480)
 *   distance  — px of translate offset (default 18)
 *   threshold — 0–1, visibility threshold (default 0.12)
 *   once      — animate only once (default true)
 *   as        — HTML tag to render (default 'div')
 *   className — forwarded to the wrapper element
 *
 * Usage:
 *   <FadeIn><Card>…</Card></FadeIn>
 *   <FadeIn from="left" delay={120}>…</FadeIn>
 */

const TRANSLATE = {
  bottom: (d) => `translateY(${d}px)`,
  top:    (d) => `translateY(-${d}px)`,
  left:   (d) => `translateX(-${d}px)`,
  right:  (d) => `translateX(${d}px)`,
  none:   ()  => 'none',
}

export function FadeIn({
  children,
  from      = 'bottom',
  delay     = 0,
  duration  = 480,
  distance  = 18,
  threshold = 0.12,
  once      = true,
  as: Tag   = 'div',
  className = '',
  style     = {},
  ...props
}) {
  const { ref, inView } = useInView({ threshold, once })

  // Respect prefers-reduced-motion — show immediately, no transition
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const transitionStyle = reducedMotion
    ? {}
    : {
        opacity:           inView ? 1 : 0,
        transform:         inView ? 'none' : TRANSLATE[from](distance),
        transition:        `opacity ${duration}ms ease, transform ${duration}ms ease`,
        transitionDelay:   inView ? `${delay}ms` : '0ms',
        willChange:        inView ? 'auto' : 'opacity, transform',
      }

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ ...transitionStyle, ...style }}
      {...props}
    >
      {children}
    </Tag>
  )
}

/**
 * FadeInStagger
 *
 * Wraps a list of children and applies increasing delays automatically.
 * Ideal for grids, lists, and bento layouts.
 *
 * Props:
 *   stagger   — ms between each child's delay (default 80)
 *   baseDelay — ms added before the first child (default 0)
 *   ...rest   — all FadeIn props are forwarded to each child wrapper
 *
 * Usage:
 *   <FadeInStagger stagger={80}>
 *     <Card />
 *     <Card />
 *     <Card />
 *   </FadeInStagger>
 *
 * Note: wraps each child in a FadeIn — if the child is a block element
 * that needs specific display, pass `as="li"` or similar.
 */
export function FadeInStagger({
  children,
  stagger   = 80,
  baseDelay = 0,
  ...fadeProps
}) {
  return Children.map(children, (child, i) => {
    if (!isValidElement(child)) return child
    return (
      <FadeIn key={i} {...fadeProps} delay={baseDelay + i * stagger}>
        {child}
      </FadeIn>
    )
  })
}
