import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Text } from '../../components/ui/Typography'

const LANGUAGES = [
  { code: 'en', label: 'English', sublabel: 'EN' },
  { code: 'es', label: 'Español', sublabel: 'ES' },
]

export function LanguageSection() {
  const { t, i18n } = useTranslation()
  const current = i18n.language

  return (
    <section className="flex flex-col gap-3">
      <div>
        <Text scale="title-md" className="text-[var(--color-on-surface)]">
          {t('settings.language.title')}
        </Text>
        <Text scale="body-md" color="muted">
          {t('settings.language.subtitle')}
        </Text>
      </div>

      <div className="flex flex-col gap-2">
        {LANGUAGES.map(({ code, label, sublabel }) => {
          const isActive = current === code
          return (
            <button
              key={code}
              onClick={() => i18n.changeLanguage(code)}
              className={[
                'flex items-center justify-between px-5 py-4',
                'rounded-[var(--radius-lg)]',
                'transition-all duration-200',
                'text-left w-full cursor-pointer',
                isActive
                  ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]'
                  : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-bright)]',
              ].join(' ')}
            >
              <div className="flex items-center gap-4">
                <span
                  className={[
                    'w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center',
                    'font-headline font-black text-sm tracking-tight flex-shrink-0',
                    isActive
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                      : 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]',
                  ].join(' ')}
                >
                  {sublabel}
                </span>
                <Text
                  scale="title-md"
                  className={isActive ? 'text-[var(--color-on-primary-container)]' : 'text-[var(--color-on-surface)]'}
                >
                  {label}
                </Text>
              </div>
              {isActive && (
                <Check size={18} className="text-[var(--color-primary)]" strokeWidth={2.5} />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
