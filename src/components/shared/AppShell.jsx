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

  const showLoader = isLoading || imagesLoading

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
      <main className="flex-1 pt-20 md:pt-24 pb-20 md:pb-28">
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
