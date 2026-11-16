import type { CSSProperties } from 'react'
import { useText } from '../text'

type Props = {
  thing: string
  count: number
  counted: number // how many have been counted aloud so far (Space, or tapping)
  onTap: () => void
}

// The things to count, in rows of five (like a ten frame), so 6–10 read as "five and some more".
export function Objects({ thing, count, counted, onTap }: Props) {
  const t = useText()
  return (
    <div className="objects" style={{ gridTemplateColumns: `repeat(${Math.min(count, 5)}, auto)` }}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          className={['object', i < counted && 'counted', i === count - 1 && counted === count && 'final'].filter(Boolean).join(' ')}
          style={{ '--delay': `${i * 0.06}s` } as CSSProperties}
          aria-label={t.count}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onTap}
        >
          {thing}
          {/* The last one is the answer: shown big. */}
          {i < counted && <span className={i === count - 1 ? 'object-number final' : 'object-number'}>{i + 1}</span>}
        </button>
      ))}
    </div>
  )
}
