import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trophy, Swords, Star } from 'lucide-react'
import { DifficultyCard } from './DifficultyCard'
import { Text }    from '../../components/ui/Typography'
import { Card }    from '../../components/ui/Card'
import { FadeIn }  from '../../components/ui/FadeIn'
import { getStats } from '../../services/statsService'

function StatSummary({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-3">
      <Icon size={16} className="text-[var(--color-primary)]" strokeWidth={1.8} />
      <Text scale="headline-sm" className="text-[var(--color-on-surface)]">{value}</Text>
      <Text scale="label-sm" color="muted" className="normal-case tracking-normal text-center">{label}</Text>
    </div>
  )
}

const DIFFICULTIES = [
  {
    level:       'easy',
    gridSize:    '3×4',
    timeKey:     'difficulty.timeExtensive',
    attemptsKey: 'difficulty.attemptsInfinite',
  },
  {
    level:       'medium',
    gridSize:    '4×4',
    timeKey:     'difficulty.timeModerate',
    attemptsKey: 'difficulty.attemptsTen',
  },
  {
    level:       'hard',
    gridSize:    '5×6',
    timeKey:     'difficulty.timeLimit60',
    attemptsKey: 'difficulty.attemptsTen',
  },
]

export default function DifficultyPage() {
  const navigate = useNavigate()
  const { t }    = useTranslation()
  const stats    = getStats()

  return (
    <div className="px-4 pt-8 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <FadeIn from="top" duration={400}>
        <header className="mb-10">
          <Text scale="label-md" color="secondary" className="mb-2 block">
            {t('difficulty.badge')}
          </Text>
          <Text scale="display-sm" as="h2" className="text-[var(--color-on-surface)] mb-3 leading-none">
            {t('difficulty.title')}
          </Text>
          <Text scale="body-lg" color="muted" className="max-w-xs">
            {t('difficulty.subtitle')}
          </Text>
        </header>
      </FadeIn>

      {/* Difficulty Cards — staggered / 3-col on tablet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {DIFFICULTIES.map((d, i) => (
          <FadeIn key={d.level} delay={i * 90} className="h-full">
            <DifficultyCard
              level={d.level}
              label={t(`difficulty.${d.level}.label`)}
              description={t(`difficulty.${d.level}.description`)}
              grid={t('difficulty.grid', { size: d.gridSize })}
              time={t(d.timeKey)}
              attempts={t(d.attemptsKey)}
              onSelect={() => navigate('/game', { state: { difficulty: d.level } })}
            />
          </FadeIn>
        ))}
      </div>

      {/* Stats Bar */}
      <FadeIn delay={280}>
        <Card elevation="low" className="p-5 grid grid-cols-3 divide-x divide-[var(--color-outline-variant)]/20">
          <StatSummary icon={Trophy} value={stats.gamesWon}    label={t('difficulty.statsWins')} />
          <StatSummary icon={Swords} value={stats.gamesPlayed} label={t('difficulty.statsPlayed')} />
          <StatSummary icon={Star}   value={stats.hardWins}    label={t('difficulty.statsHard')} />
        </Card>
      </FadeIn>
    </div>
  )
}
