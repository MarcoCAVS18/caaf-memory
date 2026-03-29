import { Outlet } from 'react-router-dom'
import { TopAppBar }          from './TopAppBar'
import { BottomNav }          from './BottomNav'
import { OnboardingModal }    from '../onboarding/OnboardingModal'
import { AchievementToast }   from '../ui/AchievementToast'
import { useProfile }         from '../../hooks/useProfile'

export function AppShell() {
  const { needsOnboarding, isLoading, createProfile } = useProfile()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <TopAppBar />

      {/*
        pt  = TopAppBar height (~56px)
        pb  = NavBar height:
              mobile  → ~80px (bar + safe area)
              tablet  → ~88px (floating pill + 20px mb + safe area)
      */}
      <main className="flex-1 pt-20 md:pt-24 pb-20 md:pb-28 overflow-y-auto">
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
