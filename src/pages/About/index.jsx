import { useTranslation } from 'react-i18next'
import {
  TrendingUp, Layers, Tag, Zap,
  Store, Gem, Truck, Network,
} from 'lucide-react'
import { FadeIn }      from '../../components/ui/FadeIn'
import { Card }        from '../../components/ui/Card'
import { Text }        from '../../components/ui/Typography'
import { Badge }       from '../../components/ui/Badge'
import { PageHero }    from '../../components/ui/PageHero'
import { ThemedLogo }  from '../../components/ui/ThemedLogo'

const BENEFIT_ICONS = [TrendingUp, Layers, Tag, Zap, Store, Gem, Truck, Network]

export default function AboutPage() {
  const { t } = useTranslation()
  const benefits = t('about.benefits', { returnObjects: true })

  return (
    <div className="flex flex-col">

      {/* ── Hero background ─────────────────────────────────────────────────── */}
      <PageHero src="/images/maquinaria.png" alt="Maquinaria agrícola CAAF">
        <FadeIn from="top" duration={380}>
          <div className="flex items-end justify-between gap-4">
            <header>
              <Badge variant="secondary" className="mb-4">{t('about.badge')}</Badge>
              <Text scale="display-sm" as="h1" className="text-[var(--color-on-surface)] leading-none mb-3">
                {t('about.title')}
              </Text>
              <Text scale="body-lg" color="muted">
                {t('about.subtitle')}
              </Text>
            </header>
            <ThemedLogo className="h-14 w-auto flex-shrink-0 opacity-90" />
          </div>
        </FadeIn>
      </PageHero>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="px-4 pb-12 max-w-2xl mx-auto w-full flex flex-col gap-10">

      {/* ── Quiénes somos ───────────────────────────────────────────────────── */}
      <FadeIn delay={60}>
        <Card elevation="low" className="p-7 flex flex-col gap-4">
          <Text scale="headline-sm" className="text-[var(--color-on-surface)]">
            {t('about.whoTitle')}
          </Text>
          <Text scale="body-md" color="muted" className="leading-relaxed">
            {t('about.whoBody')}
          </Text>
        </Card>
      </FadeIn>

      {/* ── Beneficios ──────────────────────────────────────────────────────── */}
      <FadeIn delay={100}>
        <section className="flex flex-col gap-5">
          <Text scale="headline-sm" className="text-[var(--color-on-surface)]">
            {t('about.benefitsTitle')}
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.isArray(benefits) && benefits.map((text, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
              return (
                <FadeIn key={i} delay={120 + i * 35}>
                  <Card elevation="low" className="p-5 flex gap-4 items-start h-full">
                    <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-container)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={18} className="text-[var(--color-primary)]" strokeWidth={1.8} />
                    </div>
                    <Text scale="body-md" color="muted" className="leading-snug">
                      {text}
                    </Text>
                  </Card>
                </FadeIn>
              )
            })}
          </div>
        </section>
      </FadeIn>

      {/* ── Servicios ───────────────────────────────────────────────────────── */}
      <FadeIn delay={160}>
        <div className="relative overflow-hidden rounded-[var(--radius-xl)]">
          {/* Background image anchored to bottom */}
          <img
            src="/images/maquinaria.png"
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-full h-auto"
          />
          {/* Dark overlay so text stays legible in both modes */}
          <div className="absolute inset-0 bg-[var(--color-surface)]/80" />

          {/* Content */}
          <div className="relative z-10 p-7 flex flex-col gap-4">
            <Badge variant="tertiary">{t('about.servicesBadge')}</Badge>
            <Text scale="headline-sm" className="text-[var(--color-on-surface)]">
              {t('about.servicesTitle')}
            </Text>
            <Text scale="body-md" color="muted" className="leading-relaxed">
              {t('about.servicesBody')}
            </Text>
          </div>
        </div>
      </FadeIn>

      {/* ── CAAF Memory ─────────────────────────────────────────────────────── */}
      <FadeIn delay={200}>
        <Card elevation="low" className="p-7 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[var(--color-primary)]/10 rounded-full blur-[60px] pointer-events-none" />
          <Badge variant="primary" className="mb-4">{t('about.memoryBadge')}</Badge>
          <Text scale="headline-sm" className="text-[var(--color-on-surface)] mb-3">
            {t('about.memoryTitle')}
          </Text>
          <Text scale="body-md" color="muted" className="leading-relaxed">
            {t('about.memoryBody')}
          </Text>
        </Card>
      </FadeIn>

      {/* ── Slides institucionales ───────────────────────────────────────────── */}
      {['Pagina 1', 'Pagina 2', 'Pagina 3'].map((name, i) => (
        <FadeIn key={name} delay={240 + i * 60}>
          {/* Fondo blanco forzado: los SVGs son documentos de impresión con texto
              negro y fondo transparente — necesitan superficie clara en ambos modos */}
          <img
            src={`/images/${encodeURIComponent(name)}.svg`}
            alt={`CAAF — ${name}`}
            className="w-full h-auto block"
            loading="lazy"
          />
        </FadeIn>
      ))}

      </div>
    </div>
  )
}
