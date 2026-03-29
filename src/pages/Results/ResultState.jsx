import { Trophy, TimerOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../../components/ui/Badge'
import { Text }  from '../../components/ui/Typography'

export function ResultState({ outcome }) {
  const { t } = useTranslation()
  const isWin = outcome === 'win'

  return (
    <div className="w-full flex flex-col items-center md:items-start">
      {/* Hero visual */}
      <div className="relative w-full aspect-[4/3] md:aspect-[3/4] rounded-[var(--radius-2xl)] overflow-hidden mb-8 shadow-2xl">

        {/* Background image */}
        {isWin ? (
          <img
            src="/images/result-win.png"
            alt="Golden wheat field at sunset — harvest success"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="/images/result-lose.png"
            alt="Desolate field under dark clouds — harvest failed"
            className="w-full h-full object-cover grayscale brightness-75"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />

        {/* Central icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={[
              'w-20 h-20 rounded-full flex items-center justify-center',
              'shadow-[0_0_60px_0_rgba(0,0,0,0.5)]',
              isWin
                ? 'bg-[var(--color-secondary)] text-[var(--color-on-secondary)]'
                : 'bg-[var(--color-error-container)] text-[var(--color-error)]',
            ].join(' ')}
          >
            {isWin ? <Trophy size={36} /> : <TimerOff size={36} />}
          </div>
        </div>

        {/* Floating badge */}
        <div className="absolute top-5 left-5">
          <Badge variant={isWin ? 'primary' : 'error'}>
            {isWin ? t('results.win.badge') : t('results.lose.badge')}
          </Badge>
        </div>
      </div>

      {/* Title */}
      <div className="text-center md:text-left mb-8 w-full">
        <Text
          scale="display-sm"
          as="h2"
          className="text-[var(--color-on-surface)] mb-2 leading-none"
        >
          {isWin ? t('results.win.title') : t('results.lose.title')}
        </Text>
        <Text scale="body-lg" color="muted">
          {isWin ? t('results.win.subtitle') : t('results.lose.subtitle')}
        </Text>
      </div>
    </div>
  )
}
