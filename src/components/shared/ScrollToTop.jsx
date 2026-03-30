import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/':            'CAAF Memory',
  '/difficulty':  'CAAF Memory — Dificultad',
  '/game':        'CAAF Memory — Juego',
  '/results':     'CAAF Memory — Resultados',
  '/leaderboard': 'CAAF Memory — Ranking',
  '/settings':    'CAAF Memory — Ajustes',
  '/about':       'CAAF Memory — Sobre CAAF',
  '/privacy':     'CAAF Memory — Privacidad',
}

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = PAGE_TITLES[pathname] ?? 'CAAF Memory'
  }, [pathname])

  return null
}
