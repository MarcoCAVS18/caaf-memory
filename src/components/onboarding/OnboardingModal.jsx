import { useState } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconPicker }              from './IconPicker'
import { ICON_OPTIONS }            from './iconOptions'
import { findProfileByNameAndIcon, recoverProfile } from '../../services/profileService'
import { Button } from '../ui/Button'
import { Input }  from '../ui/Input'
import { Text }   from '../ui/Typography'
import { Badge }  from '../ui/Badge'

// 'idle' | 'checking' | 'saving' | 'recovering'
const STATUS = { IDLE: 'idle', CHECKING: 'checking', SAVING: 'saving', RECOVERING: 'recovering' }

export function OnboardingModal({ onComplete }) {
  const { t } = useTranslation()
  const [name,           setName]          = useState('')
  const [iconKey,        setIconKey]       = useState(ICON_OPTIONS[0].key)
  const [status,         setStatus]        = useState(STATUS.IDLE)
  const [error,          setError]         = useState('')
  const [existingProfile, setExistingProfile] = useState(null)  // found profile to recover

  const busy = status !== STATUS.IDLE

  function clearErrors() {
    setError('')
    setExistingProfile(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError(t('onboarding.nameRequired')); return }

    clearErrors()
    setStatus(STATUS.CHECKING)

    const found = await findProfileByNameAndIcon(trimmed, iconKey)

    if (found) {
      // Name + icon already exists → offer recovery instead of blocking
      setExistingProfile(found)
      setStatus(STATUS.IDLE)
      return
    }

    // Free combination → create new profile
    setStatus(STATUS.SAVING)
    await onComplete(trimmed, iconKey)
  }

  async function handleRecover() {
    setStatus(STATUS.RECOVERING)
    const profile = await recoverProfile(existingProfile.playerId)
    if (profile) {
      // Trigger app re-render with the restored profile
      window.dispatchEvent(new CustomEvent('caaf:login', { detail: profile }))
    } else {
      // Firestore unreachable — just complete with the known data
      await onComplete(existingProfile.name, existingProfile.iconKey, existingProfile.playerId)
    }
  }

  function getButtonLabel() {
    if (status === STATUS.CHECKING)   return t('onboarding.checking')
    if (status === STATUS.SAVING)     return t('onboarding.saving')
    if (status === STATUS.RECOVERING) return t('onboarding.saving')
    return t('onboarding.submit')
  }

  return (
    <>
      {/* Blur backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-[var(--color-surface)]/75 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8"
      >
        <div className="w-full max-w-sm bg-[var(--color-surface-container)] rounded-[var(--radius-2xl)] shadow-[0_32px_80px_rgba(11,14,9,0.6)] overflow-hidden">

          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 bg-[radial-gradient(ellipse_at_70%_0%,var(--color-primary-container)_0%,transparent_70%)]">
            <Badge variant="secondary" className="mb-4">
              {t('onboarding.badge')}
            </Badge>
            <Text
              id="onboarding-title"
              scale="headline-lg"
              as="h2"
              className="text-[var(--color-on-surface)] leading-tight mb-1"
            >
              {t('onboarding.title').split('\n').map((line, i) => (
                <span key={i}>
                  {i === 1
                    ? <span className="text-[var(--color-primary)] italic">{line}</span>
                    : line}
                  {i === 0 && <br />}
                </span>
              ))}
            </Text>
            <Text scale="body-md" color="muted">
              {t('onboarding.subtitle')}
            </Text>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-8 pt-5 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <Input
                label={t('onboarding.nameLabel')}
                placeholder={t('onboarding.namePlaceholder')}
                value={name}
                onChange={(e) => { setName(e.target.value); clearErrors() }}
                error={error}
                autoFocus
                maxLength={24}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Text scale="label-md" color="muted">{t('onboarding.iconLabel')}</Text>
              <IconPicker
                selected={iconKey}
                onChange={(key) => { setIconKey(key); clearErrors() }}
              />
            </div>

            {/* Recovery prompt — shown when name+icon already exists */}
            {existingProfile && (
              <div className="flex flex-col gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--color-primary-container)]/40 border border-[var(--color-primary)]/20">
                <div>
                  <Text scale="title-md" className="text-[var(--color-primary)] mb-1">
                    {t('onboarding.recover', { name: existingProfile.name })}
                  </Text>
                  <Text scale="body-sm" color="muted">
                    {t('onboarding.recoverHint')}
                  </Text>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="w-full justify-center gap-2"
                  onClick={handleRecover}
                  disabled={busy}
                >
                  <RotateCcw size={15} />
                  {t('onboarding.recoverBtn')}
                </Button>
                <button
                  type="button"
                  onClick={clearErrors}
                  className="text-[var(--color-on-surface-variant)] text-xs font-semibold uppercase tracking-widest hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
                >
                  {t('onboarding.recoverDismiss')}
                </button>
              </div>
            )}

            {!existingProfile && (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                disabled={busy || !name.trim()}
              >
                {getButtonLabel()}
                {!busy && <ArrowRight size={18} />}
              </Button>
            )}
          </form>

        </div>
      </div>
    </>
  )
}
