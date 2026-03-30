import { Settings, ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function TopAppBar() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const isSettings = pathname === '/settings'

  return (
    <header
      className="fixed top-0 w-full z-50 bg-[var(--color-surface)]/60 backdrop-blur-xl"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex justify-between items-center px-6 py-4 md:py-5 w-full">

        {/* Left icon */}
        <button
          onClick={() => isSettings ? navigate(-1) : navigate('/')}
          className="text-[var(--color-primary)] transition-transform scale-100 active:scale-90 p-1 cursor-pointer"
          aria-label={isSettings ? 'Back' : 'Home'}
        >
          {isSettings ? (
            <ArrowLeft size={22} className="md:w-6 md:h-6" />
          ) : (
            <div
              className="w-12 h-12 md:w-12 md:h-12"
              style={{
                backgroundColor: 'var(--color-primary)',
                WebkitMaskImage: 'url(/images/isologo.svg)',
                maskImage: 'url(/images/isologo.svg)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
          )}
        </button>

        {/* Title */}
        <h1 className="font-headline font-black text-2xl md:text-3xl tracking-tighter text-[var(--color-primary)] uppercase select-none">
          {isSettings ? t('settings.title') : t('app.title')}
        </h1>

        {/* Right icon — hidden on settings page */}
        <button
          onClick={() => !isSettings && navigate('/settings')}
          className={[
            'text-[var(--color-primary)] transition-transform scale-100 active:scale-90 p-1 cursor-pointer',
            isSettings ? 'invisible' : '',
          ].join(' ')}
          aria-label="Settings"
          tabIndex={isSettings ? -1 : 0}
        >
          <Settings size={22} className="md:w-6 md:h-6" />
        </button>

      </div>
    </header>
  )
}
