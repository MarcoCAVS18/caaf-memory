import { Grid2x2, Clock, RefreshCw, Leaf, Zap, Flame } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge }  from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Text }   from '../../components/ui/Typography'

const CONFIG = {
  easy: {
    icon:       Leaf,
    iconBg:     'bg-[var(--color-primary-container)] text-[var(--color-primary)]',
    cardBg:     'bg-[var(--color-surface-container-low)]',
    ctaVariant: 'secondary',
    ctaLabelKey:'difficulty.easy.cta',
    badgeKey:   null,
    image:      '/images/difficulty-easy.png',
  },
  medium: {
    icon:       Zap,
    iconBg:     'bg-[var(--color-primary)] text-[var(--color-on-primary)]',
    cardBg:     'bg-[var(--color-primary-container)]',
    ctaVariant: 'primary',
    ctaLabelKey:'difficulty.medium.cta',
    badgeKey:   'difficulty.medium.recommended',
    image:      '/images/difficulty-medium.png',
  },
  hard: {
    icon:       Flame,
    iconBg:     'bg-[var(--color-error-container)] text-[var(--color-error)]',
    cardBg:     'bg-[var(--color-surface-container-low)]',
    ctaVariant: 'secondary',
    ctaLabelKey:'difficulty.hard.cta',
    badgeKey:   null,
    image:      '/images/difficulty-hard.png',
  },
}

export function DifficultyCard({ level, label, description, grid, time, attempts, onSelect }) {
  const { t } = useTranslation()
  const c = CONFIG[level]
  const Icon = c.icon

  return (
    <div
      className={[
        'relative overflow-hidden rounded-[var(--radius-2xl)] p-6 flex flex-col justify-between h-full',
        'transition-all duration-500 hover:-translate-y-1 cursor-pointer group',
        c.cardBg,
      ].join(' ')}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}
    >
      {/* Background image — low opacity, reveals on hover */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundImage: `url('${c.image}')` }}
      />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className={`w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center ${c.iconBg}`}>
            <Icon size={20} />
          </div>
          {c.badgeKey && <Badge variant="secondary">{t(c.badgeKey)}</Badge>}
        </div>

        <Text scale="headline-md" className="text-[var(--color-on-surface)] mb-2">{label}</Text>
        <Text scale="body-md" color="muted" className="mb-6 leading-relaxed">{description}</Text>
      </div>

      {/* Stats */}
      <div className="relative z-10 flex flex-col gap-2 mb-6">
        <StatLine icon={Grid2x2}   label={grid}     />
        <StatLine icon={Clock}     label={time}     />
        <StatLine icon={RefreshCw} label={attempts} />
      </div>

      {/* CTA */}
      <div className="relative z-10">
        <Button variant={c.ctaVariant} className="w-full justify-center">
          {t(c.ctaLabelKey)}
        </Button>
      </div>
    </div>
  )
}

function StatLine({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 text-[var(--color-on-surface)]/70">
      <Icon size={14} />
      <Text scale="label-md" className="normal-case tracking-wide">{label}</Text>
    </div>
  )
}
