import { ICON_OPTIONS } from './iconOptions'

export function IconPicker({ selected, onChange }) {
  return (
    <div className="grid grid-cols-6 gap-2.5">
      {ICON_OPTIONS.map(({ key, icon: Icon, label }) => {
        const isSelected = selected === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-label={label}
            className={[
              'flex flex-col items-center justify-center',
              'aspect-square rounded-[var(--radius-md)]',
              'transition-all duration-200',
              'focus:outline-none',
              isSelected
                ? [
                    'bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-container))]',
                    'text-[var(--color-on-primary)]',
                    'scale-110 shadow-[0_4px_20px_rgba(187,206,150,0.35)]',
                  ].join(' ')
                : [
                    'bg-[var(--color-surface-container-highest)]',
                    'text-[var(--color-on-surface-variant)]',
                    'hover:bg-[var(--color-surface-bright)]',
                    'hover:text-[var(--color-on-surface)]',
                    'active:scale-95',
                  ].join(' '),
            ].join(' ')}
          >
            <Icon size={20} strokeWidth={isSelected ? 2.5 : 1.8} />
          </button>
        )
      })}
    </div>
  )
}
