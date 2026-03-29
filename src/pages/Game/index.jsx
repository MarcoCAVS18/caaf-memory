import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGameState } from '../../hooks/useGameState'
import { MemoryGrid }   from './MemoryGrid'
import { Text }   from '../../components/ui/Typography'
import { Card }   from '../../components/ui/Card'
import { FadeIn } from '../../components/ui/FadeIn'

function padTime(n) { return String(n).padStart(2, '0') }
function formatTime(s) { return `${padTime(Math.floor(s / 60))}:${padTime(s % 60)}` }

export default function GamePage() {
  const navigate        = useNavigate()
  const { state }       = useLocation()
  const { t }           = useTranslation()
  const difficulty      = state?.difficulty ?? 'medium'

  const {
    cards,
    elapsed,
    attemptsLeft,
    attemptsPercent,
    totalAttempts,
    failedAttempts,
    matchedPairs,
    totalPairs,
    phase,
    score,
    locked,
    cols,
    timeLimitSec,
    timeLeft,
    handleCardClick,
  } = useGameState(difficulty)

  // Navigate to results when game ends
  useEffect(() => {
    if (phase === 'playing') return
    const timeout = setTimeout(() => {
      navigate('/results', {
        replace: true,
        state: {
          outcome:       phase === 'won' ? 'win' : 'lose',
          difficulty,
          elapsed,
          failedAttempts,
          score:         phase === 'won' ? score : 0,
        },
      })
    }, 600) // brief pause so the last matched/mismatched animation can finish
    return () => clearTimeout(timeout)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const showAttemptsBar = totalAttempts !== null

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto w-full">
      <div className="flex flex-col md:grid md:grid-cols-[1fr_2fr] md:gap-10 md:items-start gap-6">

        {/* ── Left / Top: info panel ── */}
        <div className="flex flex-col gap-5">

          {/* Timer */}
          <FadeIn from="top" duration={350}>
            <section className="flex flex-col items-center md:items-start">
              <Text scale="label-md" color="muted" className="mb-1">
                {timeLimitSec !== null ? t('game.timeLeft') : t('game.timeElapsed')}
              </Text>
              <Text
                scale="display-sm"
                className={[
                  'font-headline font-black tracking-tighter',
                  timeLimitSec !== null && timeLeft <= 10
                    ? 'text-[var(--color-error)]'
                    : 'text-[var(--color-primary-fixed-dim)]',
                ].join(' ')}
              >
                {timeLimitSec !== null ? formatTime(timeLeft) : formatTime(elapsed)}
              </Text>
            </section>
          </FadeIn>

          {/* Attempts bar — only for limited modes */}
          {showAttemptsBar && (
            <FadeIn delay={80}>
              <section className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <Text scale="label-md" color="muted">
                    {t('game.remainingAttempts')}
                  </Text>
                  <Text
                    scale="headline-sm"
                    className={attemptsLeft <= 1
                      ? 'text-[var(--color-error)]'
                      : 'text-[var(--color-secondary)]'
                    }
                  >
                    {attemptsLeft} / {totalAttempts}
                  </Text>
                </div>
                <div className="h-2.5 w-full bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden p-0.5">
                  <div
                    className={[
                      'h-full rounded-full transition-all duration-500',
                      attemptsLeft <= 1
                        ? 'bg-[var(--color-error)]'
                        : 'bg-[linear-gradient(90deg,var(--color-secondary),var(--color-primary-fixed-dim))]',
                    ].join(' ')}
                    style={{ width: `${attemptsPercent}%` }}
                  />
                </div>
              </section>
            </FadeIn>
          )}

          {/* Progress: pairs matched */}
          <FadeIn delay={120}>
            <section className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <Text scale="label-md" color="muted">{t('game.hint')}</Text>
              </div>
              <div className="h-2.5 w-full bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                  style={{ width: totalPairs > 0 ? `${Math.round((matchedPairs / totalPairs) * 100)}%` : '0%' }}
                />
              </div>
              <Text scale="label-sm" color="primary">
                {matchedPairs} / {totalPairs}
              </Text>
            </section>
          </FadeIn>

          {/* Stats cards */}
          <FadeIn delay={160}>
            <section className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <Card elevation="low" className="p-4 flex flex-col gap-1">
                <Text scale="label-md" color="muted">{t('game.level')}</Text>
                <Text scale="headline-sm" className="text-[var(--color-primary)] capitalize">
                  {t(`difficulty.${difficulty}.label`)}
                </Text>
              </Card>
              <Card elevation="low" className="p-4 flex flex-col gap-1">
                <Text scale="label-md" color="muted">{t('game.trophy')}</Text>
                <Text scale="headline-sm" className="text-[var(--color-secondary)]">
                  {score.toLocaleString()} pts
                </Text>
              </Card>
            </section>
          </FadeIn>
        </div>

        {/* ── Right / Bottom: memory grid ── */}
        <FadeIn delay={40} className="w-full">
          <section className="w-full">
            <MemoryGrid
              cards={cards}
              cols={cols}
              onCardClick={handleCardClick}
              disabled={locked || phase !== 'playing'}
            />
          </section>
        </FadeIn>

      </div>
    </div>
  )
}
