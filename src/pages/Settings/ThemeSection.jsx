import { useTranslation } from 'react-i18next'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { Text } from '../../components/ui/Typography'

const MODES = [
  { key: 'dark',   icon: Moon,    labelKey: 'settings.theme.dark'   },
  { key: 'light',  icon: Sun,     labelKey: 'settings.theme.light'  },
  { key: 'system', icon: Monitor, labelKey: 'settings.theme.system' },
]

export function ThemeSection() {
  const { t } = useTranslation()
  const { mode, setMode } = useTheme()

  return (
    <section className="flex flex-col gap-3">
      <div>
        <Text scale="title-md" className="text-[var(--color-on-surface)]">
          {t('settings.theme.title')}
        </Text>
        <Text scale="body-md" color="muted">
          {t('settings.theme.subtitle')}
        </Text>
      </div>

      {/* Segmented control */}
      <div className="flex gap-2 p-1.5 bg-[var(--color-surface-container-highest)] rounded-[var(--radius-lg)]">
        {MODES.map(({ key, icon: Icon, labelKey }) => {
          const isActive = mode === key
          return (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={[
                'flex-1 flex flex-col items-center justify-center gap-1.5',
                'py-3 rounded-[var(--radius-md)]',
                'transition-all duration-200 cursor-pointer',
                isActive
                  ? [
                      'bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-container))]',
                      'text-[var(--color-on-primary)]',
                      'shadow-[0_4px_16px_rgba(40,54,14,0.4)]',
                    ].join(' ')
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
              ].join(' ')}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <Text
                scale="label-sm"
                className={[
                  'normal-case tracking-normal',
                  isActive ? 'text-[var(--color-on-primary)]' : 'text-[var(--color-on-surface-variant)]',
                ].join(' ')}
                as="span"
              >
                {t(labelKey)}
              </Text>
            </button>
          )
        })}
      </div>
    </section>
  )
}
