import { MAX_COUNT, THINGS } from '../counting'

type Props = {
  number: number | null // null means random
  thing: string | null // null means random
  onNumberChange: (number: number | null) => void
  onThingChange: (thing: string | null) => void
  onClose: () => void
}

const NUMBERS = Array.from({ length: MAX_COUNT }, (_, i) => i + 1)

// A popup to fix how many things and which thing, or leave either random (🎲).
export function CountPicker({ number, thing, onNumberChange, onThingChange, onClose }: Props) {
  return (
    <div className="overlay centred" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="word-picker" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>What to count</h2>
          <button className="tool" onClick={onClose} autoFocus>
            Done
          </button>
        </header>
        <div className="word-picker-lists">
          <h3>How many</h3>
          <div className="word-tiles count-tiles count-numbers">
            <Tile current={number === null} onClick={() => onNumberChange(null)}>
              🎲
            </Tile>
            {NUMBERS.map((n) => (
              <Tile key={n} current={number === n} onClick={() => onNumberChange(n)}>
                {n}
              </Tile>
            ))}
          </div>
          <h3>Picture</h3>
          <div className="word-tiles count-tiles">
            <Tile current={thing === null} onClick={() => onThingChange(null)}>
              🎲
            </Tile>
            {THINGS.map((t) => (
              <Tile key={t} current={thing === t} onClick={() => onThingChange(t)}>
                {t}
              </Tile>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Tile({ current, onClick, children }: { current: boolean; onClick: () => void; children: string | number }) {
  return (
    <button className={current ? 'word-tile current' : 'word-tile'} onClick={onClick}>
      <span className="word-tile-picture">{children}</span>
    </button>
  )
}
