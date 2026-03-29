import { MemoryCard } from './MemoryCard'

/**
 * MemoryGrid
 *
 * cards: Array<{ id, iconKey, state }>
 * cols:  number — grid columns
 */
export function MemoryGrid({ cards = [], cols = 4, onCardClick, disabled = false }) {
  return (
    <div
      className="grid gap-2 w-full"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <MemoryCard
          key={card.id}
          state={card.state}
          iconKey={card.iconKey}
          onClick={() => onCardClick?.(card.id)}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
