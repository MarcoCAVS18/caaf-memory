import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ShieldCheck, Database, Eye, Trash2 } from 'lucide-react'
import { FadeIn } from '../../components/ui/FadeIn'
import { Card }   from '../../components/ui/Card'
import { Text }   from '../../components/ui/Typography'
import { Badge }  from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const SECTIONS = [
  {
    icon:  ShieldCheck,
    color: 'primary',
    titleKey: 'privacy.sections.noPersonal.title',
    bodyKey:  'privacy.sections.noPersonal.body',
  },
  {
    icon:  Database,
    color: 'secondary',
    titleKey: 'privacy.sections.collected.title',
    bodyKey:  'privacy.sections.collected.body',
  },
  {
    icon:  Eye,
    color: 'tertiary',
    titleKey: 'privacy.sections.purpose.title',
    bodyKey:  'privacy.sections.purpose.body',
  },
  {
    icon:  Trash2,
    color: 'primary',
    titleKey: 'privacy.sections.deletion.title',
    bodyKey:  'privacy.sections.deletion.body',
  },
]

const colorMap = {
  primary:  { bg: 'bg-[var(--color-primary-container)]',  icon: 'text-[var(--color-primary)]'  },
  secondary:{ bg: 'bg-[var(--color-secondary-container)]',icon: 'text-[var(--color-secondary)]' },
  tertiary: { bg: 'bg-[var(--color-tertiary-container)]', icon: 'text-[var(--color-tertiary)]'  },
}

export default function PrivacyPage() {
  const { t }    = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="px-4 pt-8 pb-12 max-w-2xl mx-auto w-full flex flex-col gap-8">

      {/* Back */}
      <FadeIn from="top" duration={300}>
        <Button
          variant="tertiary"
          size="sm"
          className="self-start gap-1.5 cursor-pointer -ml-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} />
          {t('privacy.back')}
        </Button>
      </FadeIn>

      {/* Header */}
      <FadeIn delay={40}>
        <header>
          <Badge variant="primary" className="mb-4">{t('privacy.badge')}</Badge>
          <Text scale="display-sm" as="h1" className="text-[var(--color-on-surface)] leading-none mb-3">
            {t('privacy.title')}
          </Text>
          <Text scale="body-lg" color="muted">
            {t('privacy.subtitle')}
          </Text>
        </header>
      </FadeIn>

      {/* Sections */}
      {SECTIONS.map(({ icon: Icon, color, titleKey, bodyKey }, i) => {
        const c = colorMap[color]
        return (
          <FadeIn key={titleKey} delay={80 + i * 50}>
            <Card elevation="low" className="p-6 flex gap-5 items-start">
              <div className={`w-11 h-11 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                <Icon size={20} className={c.icon} strokeWidth={1.8} />
              </div>
              <div className="flex flex-col gap-2">
                <Text scale="title-md" className="text-[var(--color-on-surface)]">
                  {t(titleKey)}
                </Text>
                <Text scale="body-md" color="muted" className="leading-relaxed">
                  {t(bodyKey)}
                </Text>
              </div>
            </Card>
          </FadeIn>
        )
      })}

      {/* Footer note */}
      <FadeIn delay={300}>
        <Text scale="label-sm" color="muted" className="text-center normal-case tracking-normal opacity-60 leading-relaxed">
          {t('privacy.footerNote')}
        </Text>
      </FadeIn>

    </div>
  )
}
