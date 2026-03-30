import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { TopAppBar }          from './TopAppBar'
import { BottomNav }          from './BottomNav'
import { ScrollToTop }        from './ScrollToTop'
import { OnboardingModal }    from '../onboarding/OnboardingModal'
import { AchievementToast }   from '../ui/AchievementToast'
import { useProfile }         from '../../hooks/useProfile'
import { useImagePreload }    from '../../hooks/useImagePreload'
import { Loader }             from '../ui/Loader'

const APP_IMAGES = [
  '/images/hero-wheat-field.png',
  '/images/silos.png',
  '/images/maquinaria.png',
  '/images/result-win.png',
  '/images/result-lose.png',
]

export function AppShell() {
  const { needsOnboarding, isLoading, createProfile } = useProfile()
  const imagesLoading = useImagePreload(APP_IMAGES)
  const prevNeedsOnboarding = useRef(false)

  const showLoader = isLoading || imagesLoading

  // Scroll to top when onboarding completes (pathname doesn't change, so
  // ScrollToTop won't fire — we detect the true→false transition manually)
  useEffect(() => {
    if (prevNeedsOnboarding.current && !needsOnboarding && !isLoading) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    prevNeedsOnboarding.current = needsOnboarding
  }, [needsOnboarding, isLoading])

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      {showLoader && <Loader />}
      <ScrollToTop />
      <TopAppBar />

      {/*
        pt  = TopAppBar height (~56px)
        pb  = NavBar height:
              mobile  → ~80px (bar + safe area)
              tablet  → ~88px (floating pill + 20px mb + safe area)
      */}
      <main className="flex-1 pt-safe-topbar pb-20 md:pb-28">
        <Outlet />
      </main>

      <BottomNav />

      {!isLoading && needsOnboarding && (
        <OnboardingModal onComplete={createProfile} />
      )}

      <AchievementToast />
    </div>
  )
}
