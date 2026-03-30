import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trophy, Medal, Lock } from 'lucide-react'
import { useLeaderboard }    from '../../hooks/useLeaderboard'
import { useProfile }        from '../../hooks/useProfile'
import { MEDALS, getEarnedMedalIds } from '../../services/achievementService'
import { ICON_OPTIONS }      from '../../components/onboarding/iconOptions'
import { FadeIn }            from '../../components/ui/FadeIn'
import { Card }              from '../../components/ui/Card'
import { Badge }             from '../../components/ui/Badge'
import { Text }              from '../../components/ui/Typography'
import { PageHero }          from '../../components/ui/PageHero'

const DIFFICULTIES = ['easy', 'medium', 'hard']

/* ── Color maps ───────────────────────────────────────────────── */
const medalIconBg = {
  primary:   'bg-[var(--color-primary-container)] text-[var(--color-primary)]',
  secondary: 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]',
  tertiary:  'bg-[var(--color-tertiary-container)] text-[var(--color-tertiary)]',
  error:     'bg-[var(--color-error-container)] text-[var(--color-error)]',
}
const medalNameColor = {
  primary:   'text-[var(--color-primary)]',
  secondary: 'text-[var(--color-secondary)]',
  tertiary:  'text-[var(--color-tertiary)]',
  error:     'text-[var(--color-error)]',
}

/* ── Avatar ───────────────────────────────────────────────────── */
const AVATAR_COLORS = [
  'bg-[var(--color-primary-container)] text-[var(--color-primary)]',
  'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]',
  'bg-[var(--color-tertiary-container)] text-[var(--color-tertiary)]',
]

function Avatar({ name = '?', iconKey = '' }) {
  const idx     = (iconKey.charCodeAt(0) || 0) % AVATAR_COLORS.length
  const option  = ICON_OPTIONS.find((o) => o.key === iconKey)
  const Icon    = option?.icon

  return (
    <div
      className={[
        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
        'font-headline font-black text-base',
        AVATAR_COLORS[idx],
      ].join(' ')}
      aria-hidden="true"
    >
      {Icon
        ? <Icon size={18} strokeWidth={2} />
        : name.charAt(0).toUpperCase()
      }
    </div>
  )
}

/* ── Rank badge ───────────────────────────────────────────────── */
function RankBadge({ rank }) {
  if (rank === 1) return (
    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
      <Trophy size={20} className="text-[var(--color-secondary)]" strokeWidth={2.5} />
    </div>
  )
  if (rank === 2) return (
    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
      <Medal size={18} className="text-[var(--color-on-surface-variant)]" strokeWidth={2} />
    </div>
  )
  if (rank === 3) return (
    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
      <Medal size={18} className="text-[var(--color-tertiary)]" strokeWidth={2} />
    </div>
  )
  return (
    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
      <Text scale="label-md" color="muted" className="normal-case tracking-normal">{rank}</Text>
    </div>
  )
}

/* ── Score row ────────────────────────────────────────────────── */
function ScoreRow({ rank, entry, isYou, youLabel }) {
  return (
    <div
      className={[
        'flex items-center gap-4 px-5 py-4 rounded-[var(--radius-lg)]',
        'transition-colors duration-200',
        rank === 1
          ? 'bg-[var(--color-secondary-container)]/20'
          : isYou
          ? 'bg-[var(--color-primary-container)]/20'
          : 'bg-[var(--color-surface-container-low)]',
      ].join(' ')}
    >
      <RankBadge rank={rank} />
      <Avatar name={entry.playerName} iconKey={entry.iconKey} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Text
            scale="title-md"
            className={['truncate', rank === 1 ? 'text-[var(--color-secondary)]' : 'text-[var(--color-on-surface)]'].join(' ')}
          >
            {entry.playerName}
          </Text>
          {isYou && <Badge variant="primary" className="flex-shrink-0">{youLabel}</Badge>}
        </div>
      </div>
      <Text
        scale="headline-sm"
        className={rank === 1 ? 'text-[var(--color-secondary)]' : 'text-[var(--color-primary)]'}
      >
        {entry.points.toLocaleString()}
      </Text>
    </div>
  )
}

/* ── Loading skeleton ─────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-container-low)] animate-pulse">
      <div className="w-8 h-8 rounded-full bg-[var(--color-surface-container-highest)]" />
      <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-highest)]" />
      <div className="flex-1 h-4 rounded-full bg-[var(--color-surface-container-highest)]" />
      <div className="w-16 h-5 rounded-full bg-[var(--color-surface-container-highest)]" />
    </div>
  )
}

/* ── Tab button ───────────────────────────────────────────────── */
function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex-1 py-3 rounded-[var(--radius-md)]',
        'font-[family-name:var(--font-body)] font-semibold text-sm',
        'transition-all duration-200 cursor-pointer',
        active
          ? 'bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-container))] text-[var(--color-on-primary)] shadow-[0_4px_16px_rgba(40,54,14,0.35)]'
          : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

/* ── Medal card ───────────────────────────────────────────────── */
function MedalCard({ medal, earned }) {
  const { t } = useTranslation()
  const Icon  = medal.icon

  return (
    <div
      className={[
        'flex flex-col items-center gap-3 p-4 rounded-[var(--radius-xl)]',
        'text-center transition-all duration-200',
        'md:hover:-translate-y-1.5 active:-translate-y-1.5',
        earned
          ? 'bg-[var(--color-surface-container-low)]'
          : 'bg-[var(--color-surface-container-low)] opacity-40',
      ].join(' ')}
    >
      {/* Icon circle */}
      <div
        className={[
          'w-14 h-14 rounded-full flex items-center justify-center relative',
          earned
            ? medalIconBg[medal.color]
            : 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]',
        ].join(' ')}
      >
        {earned
          ? <Icon size={24} strokeWidth={2} />
          : <Lock size={18} strokeWidth={2} />
        }
      </div>

      {/* Name */}
      <Text
        scale="label-sm"
        className={[
          'normal-case tracking-normal leading-tight',
          earned ? medalNameColor[medal.color] : 'text-[var(--color-on-surface-variant)]',
        ].join(' ')}
      >
        {t(medal.nameKey)}
      </Text>

      {/* Description — only show when earned */}
      {earned && (
        <Text scale="label-sm" color="muted" className="normal-case tracking-normal opacity-70 leading-snug">
          {t(medal.descKey)}
        </Text>
      )}
      {!earned && (
        <Text scale="label-sm" color="muted" className="normal-case tracking-normal opacity-60">
          {t('achievements.locked')}
        </Text>
      )}
    </div>
  )
}

/* ── Main page ────────────────────────────────────────────────── */
export default function LeaderboardPage() {
  const { t }               = useTranslation()
  const { profile }         = useProfile()
  const [active, setActive] = useState('medium')
  const { scores, loading } = useLeaderboard(active)
  const earnedIds           = getEarnedMedalIds()

  return (
    <div className="flex flex-col">

      {/* ── Hero background ─────────────────────────────────────────────────── */}
      <PageHero src="/images/silos.png" alt="Silos de acopio CAAF">
        <FadeIn from="top" duration={380}>
          <header>
            <Badge variant="secondary" className="mb-4">{t('leaderboard.badge')}</Badge>
            <Text scale="display-sm" as="h1" className="text-[var(--color-on-surface)] leading-none mb-3">
              {t('leaderboard.title')}
            </Text>
            <Text scale="body-lg" color="muted" className="max-w-sm">
              {t('leaderboard.subtitle')}
            </Text>
          </header>
        </FadeIn>
      </PageHero>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="px-4 pb-8 max-w-2xl mx-auto w-full flex flex-col gap-8">

      {/* Difficulty tabs */}
      <FadeIn delay={60}>
        <div className="flex gap-2 p-1.5 bg-[var(--color-surface-container-highest)] rounded-[var(--radius-lg)]">
          {DIFFICULTIES.map((d) => (
            <Tab
              key={d}
              label={t(`leaderboard.tabs.${d}`)}
              active={active === d}
              onClick={() => setActive(d)}
            />
          ))}
        </div>
      </FadeIn>

      {/* Leaderboard list */}
      <FadeIn delay={120}>
        <div className="flex flex-col gap-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : scores.length === 0 ? (
            <Card elevation="low" className="p-10 flex flex-col items-center gap-4 text-center">
              <Trophy size={40} className="text-[var(--color-on-surface-variant)] opacity-30" />
              <Text scale="body-lg" color="muted">{t('leaderboard.empty')}</Text>
            </Card>
          ) : (
            scores.map((entry, i) => (
              <ScoreRow
                key={entry.playerId + i}
                rank={i + 1}
                entry={entry}
                isYou={profile?.playerId === entry.playerId}
                youLabel={t('leaderboard.you')}
              />
            ))
          )}
        </div>
      </FadeIn>

      {/* ── Medals section ──────────────────────────────────────── */}
      <FadeIn delay={200}>
        <div className="flex flex-col gap-5">
          <div className="h-px bg-[var(--color-outline-variant)]/20" />

          <div>
            <Text scale="headline-sm" className="text-[var(--color-on-surface)] mb-1">
              {t('achievements.sectionTitle')}
            </Text>
            <Text scale="body-md" color="muted">
              {t('achievements.sectionSubtitle')}
            </Text>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {MEDALS.map((medal, i) => (
              <FadeIn key={medal.id} delay={240 + i * 40}>
                <MedalCard
                  medal={medal}
                  earned={earnedIds.includes(medal.id)}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      </div>
    </div>
  )
}
