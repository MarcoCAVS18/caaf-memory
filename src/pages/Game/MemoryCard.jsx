/**
 * MemoryCard
 *
 * States:
 *   idle        — face-down, clickable (shows watermark back)
 *   flipped     — face-up showing icon, awaiting evaluation
 *   matched     — face-up, permanently revealed with success ring
 *   mismatched  — face-up briefly with error tint before resetting
 */

import { SYMBOL_MAP } from './gameConfig'

const COLOR_MAP = {
  primary: {
    container: 'bg-[var(--color-primary-container)]',
    icon:      'text-[var(--color-primary)]',
    ring:      'ring-2 ring-[var(--color-primary)]/60 shadow-[0_0_20px_rgba(187,206,150,0.25)]',
  },
  secondary: {
    container: 'bg-[var(--color-secondary-container)]',
    icon:      'text-[var(--color-secondary)]',
    ring:      'ring-2 ring-[var(--color-secondary)]/60 shadow-[0_0_20px_rgba(233,193,118,0.25)]',
  },
  tertiary: {
    container: 'bg-[var(--color-tertiary-container)]',
    icon:      'text-[var(--color-tertiary)]',
    ring:      'ring-2 ring-[var(--color-tertiary)]/60',
  },
}

export function MemoryCard({ state = 'idle', iconKey = 'leaf', onClick, disabled }) {
  const symbol    = SYMBOL_MAP[iconKey] ?? SYMBOL_MAP['leaf']
  const colors    = COLOR_MAP[symbol.color]
  const Icon      = symbol.icon
  const isRevealed = state === 'flipped' || state === 'matched' || state === 'mismatched'

  return (
    <div className="aspect-square w-full" style={{ perspective: '600px' }}>
      <div className={`flip-card-inner w-full h-full relative ${isRevealed ? 'flipped' : ''}`}>

        {/* ── Face-down (back of card) ── */}
        <div
          className={[
            'flip-card-face absolute inset-0',
            'rounded-[var(--radius-md)]',
            'bg-[var(--color-surface-container-high)]',
            'flex items-center justify-center overflow-hidden',
            !disabled && state === 'idle'
              ? 'cursor-pointer hover:bg-[var(--color-surface-container-highest)] hover:scale-[1.04] active:scale-95 transition-all duration-150 shadow-md'
              : 'shadow-sm',
          ].join(' ')}
          onClick={!disabled && state === 'idle' ? onClick : undefined}
        >
          {/* Watermark — isologo via mask so it always renders */}
          <div
            aria-hidden="true"
            style={{
              width: '40%',
              height: '40%',
              backgroundColor: 'var(--color-on-surface)',
              opacity: 0.15,
              WebkitMaskImage: 'url(/images/isologo.svg)',
              maskImage: 'url(/images/isologo.svg)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
          />
        </div>

        {/* ── Face-up (front of card) ── */}
        <div
          className={[
            'flip-card-face flip-card-back absolute inset-0',
            'rounded-[var(--radius-md)]',
            'flex items-center justify-center',
            state === 'mismatched'
              ? 'bg-[var(--color-error-container)] shadow-[inset_0_0_0_2px_var(--color-error)]'
              : colors.container,
            state === 'matched' ? colors.ring : '',
            'transition-all duration-300',
          ].join(' ')}
        >
          {state === 'mismatched'
            ? <Icon className="w-2/5 h-2/5 text-[var(--color-error)]" strokeWidth={2} />
            : <Icon className={`w-2/5 h-2/5 ${colors.icon}`} strokeWidth={1.8} />
          }
        </div>

      </div>
    </div>
  )
}
