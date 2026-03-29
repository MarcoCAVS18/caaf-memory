import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { Share2, Copy, Check } from 'lucide-react'
import { Text } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'

export function ShareSection() {
  const { t }  = useTranslation()
  const [copied, setCopied] = useState(false)

  const appUrl = window.location.origin

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(appUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard not available in some mobile browsers */
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'CAAF Memory', url: appUrl })
      } catch { /* user cancelled */ }
    } else {
      handleCopy()
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <Text scale="title-md" className="text-[var(--color-on-surface)]">
          {t('settings.share.title')}
        </Text>
        <Text scale="body-md" color="muted">
          {t('settings.share.subtitle')}
        </Text>
      </div>

      {/* QR Card */}
      <div className="flex flex-col items-center gap-4 py-7 px-6 rounded-[var(--radius-2xl)] bg-[var(--color-surface-container-high)]">
        {/* QR white frame */}
        <div className="p-4 bg-white rounded-[var(--radius-lg)] shadow-[0_8px_40px_rgba(11,14,9,0.3)]">
          <QRCodeSVG
            value={appUrl}
            size={160}
            bgColor="#ffffff"
            fgColor="#121410"
            level="M"
            style={{ display: 'block' }}
          />
        </div>

        <Text scale="label-md" color="muted" className="normal-case tracking-normal text-center">
          {t('settings.share.scanLabel')}
        </Text>

        {/* URL chip */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-container-highest)] max-w-full overflow-hidden">
          <Text
            scale="label-sm"
            className="text-[var(--color-on-surface-variant)] truncate normal-case tracking-normal"
            as="span"
          >
            {appUrl}
          </Text>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="flex-1 justify-center gap-2"
          onClick={handleCopy}
        >
          {copied
            ? <><Check size={16} /> Copiado</>
            : <><Copy size={16} /> Copiar URL</>
          }
        </Button>

        <Button
          variant="primary"
          className="flex-1 justify-center gap-2"
          onClick={handleShare}
        >
          <Share2 size={16} /> Compartir
        </Button>
      </div>
    </section>
  )
}
