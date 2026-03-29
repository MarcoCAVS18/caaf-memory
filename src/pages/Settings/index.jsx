import { useTranslation } from 'react-i18next'
import { LanguageSection } from './LanguageSection'
import { ThemeSection }    from './ThemeSection'
import { ShareSection }    from './ShareSection'
import { ProfileSection }  from './ProfileSection'
import { Text }            from '../../components/ui/Typography'
import { FadeIn }          from '../../components/ui/FadeIn'
import { Footer }          from '../../components/shared/Footer'

function Divider() {
  return <div className="h-px bg-[var(--color-outline-variant)]/20" />
}

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <>
    <div className="px-4 pt-8 pb-8 max-w-2xl mx-auto w-full flex flex-col gap-8">
      <FadeIn from="top" duration={350}>
        <Text scale="display-sm" as="h2" className="text-[var(--color-on-surface)] leading-none">
          {t('settings.title')}
        </Text>
      </FadeIn>

      {/* Tablet: Language + Theme side by side */}
      <div className="flex flex-col md:grid md:grid-cols-2 md:gap-8 gap-8">
        <FadeIn delay={60}>
          <LanguageSection />
        </FadeIn>
        <FadeIn delay={120}>
          <ThemeSection />
        </FadeIn>
      </div>

      <FadeIn delay={180}>
        <Divider />
      </FadeIn>

      <FadeIn delay={220}>
        <ShareSection />
      </FadeIn>

      <FadeIn delay={280}>
        <Divider />
      </FadeIn>

      <FadeIn delay={320}>
        <ProfileSection />
      </FadeIn>
    </div>
    <Footer />
    </>
  )
}
