import { useState, useEffect } from 'react'

/**
 * Preloads an array of image URLs in parallel.
 * Returns `loading: true` until ALL images have resolved (loaded or errored).
 * On subsequent visits images are cached by the browser — resolves instantly.
 */
export function useImagePreload(urls) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    Promise.all(
      urls.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image()
            img.onload  = resolve
            img.onerror = resolve   // don't block on a broken image
            img.src = src
          }),
      ),
    ).then(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return loading
}
