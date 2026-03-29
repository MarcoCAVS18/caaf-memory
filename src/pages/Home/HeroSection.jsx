import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/Button'
import { Badge }  from '../../components/ui/Badge'
import { Text }   from '../../components/ui/Typography'

export function HeroSection() {
  const navigate = useNavigate()
  const { t }    = useTranslation()

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 'min(85dvh, 720px)' }}>

      {/* Background — full bleed */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-wheat-field.png"
          alt="Golden wheat field"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full min-h-[inherit] flex items-end md:items-center">
        <div className="w-full max-w-4xl mx-auto px-6 pb-16 md:pb-0">
          {/* Logo — above headline */}
          <img
            src="/images/logo.svg"
            alt="CAAF"
            draggable={false}
            className="mb-8 block"
            style={{ width: '160px', height: 'auto' }}
          />

          <Badge variant="secondary" className="mb-6">
            {t('home.badge')}
          </Badge>

          <h2
            className="font-headline font-black tracking-tighter leading-[0.85] text-[var(--color-on-surface)] mb-6"
            style={{
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              textShadow: '0 4px 12px rgba(18,20,16,0.8)',
            }}
          >
            {t('home.headline')} <br />
            <span className="text-[var(--color-primary)] italic">{t('home.accent')}</span>
          </h2>

          <Text scale="body-lg" color="muted" className="max-w-md mb-10 opacity-90">
            {t('home.subline')}
          </Text>

          <Button
            size="lg"
            variant="primary"
            className="gap-3 shadow-[0_20px_50px_rgba(40,54,14,0.4)]"
            onClick={() => navigate('/difficulty')}
          >
            {t('home.cta')} <Play size={18} />
          </Button>
        </div>
      </div>
    </section>
  )
}
