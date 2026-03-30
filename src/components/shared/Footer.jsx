import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ThemedIsologo } from '../ui/ThemedLogo'
import { Text } from '../ui/Typography'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="pt-6 pb-32 px-6 text-center border-t border-[var(--color-outline-variant)]/10">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">

        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <ThemedIsologo size="120px" style={{ opacity: 0.5 }} />
          <Text scale="label-sm" color="muted" className="normal-case tracking-normal opacity-60">
            {t('home.footer.gameSubtitle')}
          </Text>
        </div>

        {/* Links */}
        <div className="flex justify-center gap-8">
          <Link
            to="/privacy"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors font-bold text-[10px] tracking-widest uppercase cursor-pointer"
          >
            {t('home.footer.privacy')}
          </Link>
          <a
            href="https://acopiadorescoop.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors font-bold text-[10px] tracking-widest uppercase cursor-pointer"
          >
            {t('home.footer.community')}
          </a>
          <a
            href="#"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors font-bold text-[10px] tracking-widest uppercase cursor-pointer"
          >
            {t('home.footer.portfolio')}
          </a>
        </div>

        {/* Copyright */}
        <Text scale="label-sm" color="muted" className="opacity-40 uppercase tracking-widest">
          {t('home.footer.copyright')}
        </Text>
      </div>
    </footer>
  )
}
