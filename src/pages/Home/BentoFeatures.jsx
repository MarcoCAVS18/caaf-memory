import { useState, useEffect } from 'react'
import { Brain, Trophy, Lock, ArrowRight, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card }     from '../../components/ui/Card'
import { Text }     from '../../components/ui/Typography'
import { FadeIn }   from '../../components/ui/FadeIn'
import { useInView } from '../../hooks/useInView'
import { MEDALS, getEarnedMedalIds } from '../../services/achievementService'

/* ── Medal icon color map (matches achievementService colors) ──── */
const medalIconBg = {
  primary:   'bg-[var(--color-primary)]/20 text-[var(--color-primary)]',
  secondary: 'bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]',
  tertiary:  'bg-[var(--color-tertiary-container)] text-[var(--color-tertiary)]',
  error:     'bg-[var(--color-error-container)] text-[var(--color-error)]',
}

/* ── Stage resolver ──────────────────────────────────────────────
   0 medals → stage 0 (original content)
   1–4      → stage 1
   5–7      → stage 2
*/
function getStage(count) {
  if (count === 0) return 0
  if (count <= 4)  return 1
  return 2
}

/* ── MedalRow — single earned-medal row inside the stats card ─── */
function MedalRow({ medal }) {
  const { t }  = useTranslation()
  const Icon   = medal.icon
  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${medalIconBg[medal.color]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <Text scale="title-md" className="text-[var(--color-on-surface)] truncate">
          {t(medal.nameKey)}
        </Text>
        <Text scale="body-md" color="muted" className="truncate">{t(medal.descKey)}</Text>
      </div>
    </div>
  )
}

/* ── Main bento section ──────────────────────────────────────── */
export function BentoFeatures() {
  const { t }    = useTranslation()
  const navigate = useNavigate()

  const earnedIds    = getEarnedMedalIds()
  const earnedMedals = MEDALS.filter((m) => earnedIds.includes(m.id))
  const total        = MEDALS.length
  const count        = earnedMedals.length
  const pct          = Math.round((count / total) * 100)
  const stage        = getStage(count)

  // Dynamic content for the Cognitive Farming card
  const cognitiveTitle = stage === 2
    ? t('home.features.cognitiveTitle2')
    : stage === 1
    ? t('home.features.cognitiveTitle1')
    : t('home.features.cognitiveTitle')

  const cognitiveDesc = stage === 2
    ? t('home.features.cognitiveDesc2')
    : stage === 1
    ? t('home.features.cognitiveDesc1')
    : t('home.features.cognitiveDesc')

  // Show up to 3 earned medals in the stats card; rest shown as "+N more"
  const displayMedals  = earnedMedals.slice(0, 3)
  const overflowCount  = count - displayMedals.length

  // Progress bar — animate from 0 → pct when the bar enters view
  const { ref: progressRef, inView: progressInView } = useInView({ threshold: 0.4, once: true })
  const [animatedPct, setAnimatedPct] = useState(0)

  useEffect(() => {
    if (!progressInView) return
    const t = setTimeout(() => setAnimatedPct(Math.max(pct, 3)), 150)
    return () => clearTimeout(t)
  }, [progressInView, pct])

  return (
    <section className="relative z-20 px-4 -mt-24 mb-24 max-w-4xl mx-auto w-full">
      {/*
        Mobile:  2 columns
        Tablet:  3 columns — F1 (2/3) | F2 (1/3)
                             F3 (1/3) | F4 (2/3)
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {/* Feature 1 — Cognitive Farming (dynamic) */}
        <FadeIn className="col-span-2 md:col-span-2">
          <Card elevation="low" className="p-7 flex flex-col justify-between gap-6 overflow-hidden relative group h-full">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-[80px] group-hover:bg-[var(--color-primary)]/20 transition-all pointer-events-none" />
            <div>
              <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[var(--color-primary-container)] flex items-center justify-center mb-5">
                <Brain size={22} className="text-[var(--color-primary)]" />
              </div>
              <Text scale="headline-sm" className="text-[var(--color-on-surface)] mb-3 transition-all duration-500">
                {cognitiveTitle}
              </Text>
              <Text scale="body-md" color="muted" className="transition-all duration-500">
                {cognitiveDesc}
              </Text>
            </div>

            {/* Progress bar — driven by medal progress, animates on enter */}
            <div ref={progressRef} className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-[var(--color-primary)]/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${animatedPct}%` }}
                />
              </div>
              <Text scale="label-sm" color="primary">
                {t('home.features.efficiencyPct', { pct })}
              </Text>
            </div>
          </Card>
        </FadeIn>

        {/* Feature 2 — Golden Silo trophy */}
        <FadeIn className="col-span-2 sm:col-span-1 md:col-span-1" delay={60}>
          <Card elevation="low" className="h-full p-7 flex flex-col items-center text-center justify-center gap-3 bg-[var(--color-secondary-container)]/20 relative group">
            <Trophy size={44} className="text-[var(--color-secondary)]" />
            <Text scale="headline-sm" className="text-[var(--color-on-surface)]">
              {t('home.features.siloTitle')}
            </Text>
            <Text scale="body-md" color="muted">{t('home.features.siloDesc')}</Text>
            <button
              onClick={() => navigate('/leaderboard')}
              className="mt-2 text-[var(--color-secondary)] flex items-center gap-2 group-hover:gap-4 transition-all font-label font-black text-xs uppercase tracking-widest cursor-pointer"
            >
              {t('home.features.viewTrophies')} <ArrowRight size={14} />
            </button>
          </Card>
        </FadeIn>

        {/* Feature 3 — Earned medals */}
        <FadeIn className="col-span-2 sm:col-span-1 md:col-span-1" delay={140}>
          <Card elevation="default" className="h-full p-7 flex flex-col gap-5 justify-center">
            {count === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center gap-4 text-center py-2">
                <div className="w-14 h-14 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center">
                  <Lock size={22} className="text-[var(--color-on-surface-variant)] opacity-40" />
                </div>
                <Text scale="body-md" color="muted" className="opacity-70 leading-relaxed">
                  {t('home.features.noMedalsYet')}
                </Text>
              </div>
            ) : (
              <>
                {displayMedals.map((medal) => (
                  <MedalRow key={medal.id} medal={medal} />
                ))}
                {overflowCount > 0 && (
                  <button
                    onClick={() => navigate('/leaderboard')}
                    className="text-[var(--color-primary)] font-label font-black text-xs uppercase tracking-widest cursor-pointer text-left hover:opacity-80 transition-opacity"
                  >
                    {t('home.features.andMore', { count: overflowCount })}
                  </button>
                )}
              </>
            )}
          </Card>
        </FadeIn>

        {/* Feature 4 — Productos CAAF */}
        <FadeIn className="col-span-2 md:col-span-2" delay={80}>
          <a
            href="https://acopiadorescoop.com.ar/#!/-productos/"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative h-52 md:h-64 rounded-[var(--radius-2xl)] overflow-hidden group cursor-pointer"
          >
            <img
              src="/images/silos.png"
              alt="Productos CAAF"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[var(--color-surface)]/60 group-hover:bg-[var(--color-surface)]/40 transition-colors duration-500" />
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <Text scale="label-sm" color="muted" className="normal-case tracking-normal mb-1 opacity-70">
                {t('home.features.productsLabel')}
              </Text>
              <div className="flex items-end justify-between gap-4">
                <Text scale="headline-sm" className="text-[var(--color-on-surface)]">
                  {t('home.features.productsTitle')}
                </Text>
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-label font-black text-xs uppercase tracking-widest flex-shrink-0 group-hover:gap-3 transition-all duration-300">
                  {t('home.features.productsLink')} <ExternalLink size={13} />
                </div>
              </div>
            </div>
          </a>
        </FadeIn>

      </div>
    </section>
  )
}
