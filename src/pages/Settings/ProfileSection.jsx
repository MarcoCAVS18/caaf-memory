import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getLocalProfile, clearProfile } from '../../services/profileService'
import { ICON_OPTIONS }  from '../../components/onboarding/iconOptions'
import { Text }   from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'

export function ProfileSection() {
  const { t } = useTranslation()
  const profile = getLocalProfile()

  if (!profile) return null

  const iconEntry = ICON_OPTIONS.find((o) => o.key === profile.iconKey) ?? ICON_OPTIONS[0]
  const Icon      = iconEntry.icon

  return (
    <section className="flex flex-col gap-3">
      <div>
        <Text scale="title-md" className="text-[var(--color-on-surface)]">
          {t('settings.profile.title')}
        </Text>
        <Text scale="body-md" color="muted">
          {t('settings.profile.subtitle')}
        </Text>
      </div>

      {/* Active player card */}
      <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-container)] rounded-[var(--radius-lg)]">
        <div className="w-11 h-11 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center flex-shrink-0">
          <Icon size={22} className="text-[var(--color-primary)]" strokeWidth={1.8} />
        </div>
        <div className="flex flex-col min-w-0">
          <Text scale="title-sm" className="text-[var(--color-on-surface)] truncate">
            {profile.name}
          </Text>
          <Text scale="label-sm" color="muted">
            {t('settings.profile.activeSession')}
          </Text>
        </div>
      </div>

      <Button
        variant="danger"
        size="md"
        className="w-full justify-center cursor-pointer"
        onClick={clearProfile}
      >
        <LogOut size={16} />
        {t('settings.profile.logout')}
      </Button>
    </section>
  )
}
