import { MAX_COUNT, THINGS } from '../counting'
import { EmojiPicker } from './EmojiPicker'

type Props = {
  number: number | null // null means random
  things: string[] // the pictures used, one picked at random each round; none means all of them
  onNumberChange: (number: number | null) => void
  onAllThings: () => void
  onToggleThing: (thing: string) => void
  added: string[] // pictures added here, after the built-in ones
  onAddThing: (thing: string) => void
  onRemoveThing: (thing: string) => void
  onClose: () => void
}

const NUMBERS = Array.from({ length: MAX_COUNT }, (_, i) => i + 1)

// A popup to fix how many things and which pictures, or leave either random (🎲).
export function CountPicker({ number, things, onNumberChange, onAllThings, onToggleThing, added, onAddThing, onRemoveThing, onClose }: Props) {
  return (
    <div className="overlay centred" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="word-picker count-picker" onClick={(e) => e.stopPropagation()}>
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
          <h3>Pictures</h3>
          <p className="hint count-hint">
            {things.length === 0
              ? '🎲 All of them, one at random each round. Tap pictures to use only those.'
              : things.length === 1
                ? 'Only this one. Tap more to mix them in, or 🎲 for all.'
                : `These ${things.length}, one at random each round. Tap one again to take it out, or 🎲 for all.`}
          </p>
          <div className="word-tiles count-tiles">
            <Tile current={things.length === 0} onClick={onAllThings}>
              🎲
            </Tile>
            {THINGS.map((t) => (
              <Tile key={t} current={things.includes(t)} onClick={() => onToggleThing(t)}>
                {t}
              </Tile>
            ))}
            {added.map((t) => (
              <div key={t} className="count-added">
                <Tile current={things.includes(t)} onClick={() => onToggleThing(t)}>
                  {t}
                </Tile>
                <button className="chip-remove" aria-label={`Remove ${t}`} onClick={() => onRemoveThing(t)}>
                  ×
                </button>
              </div>
            ))}
            {/* Any emoji from the full list (or pasted) joins the pictures, random rounds included. */}
            <EmojiPicker
              value={undefined}
              label="＋"
              title="Add a picture"
              allowNone={false}
              onPick={(t) => {
                // Already in the list: just choose it.
                if (THINGS.includes(t) || added.includes(t)) {
                  if (!things.includes(t)) onToggleThing(t)
                }
                else if (t) onAddThing(t)
              }}
            />
          </div>
          <p className="hint">＋ adds any emoji to the pictures (search the full list, or paste one). Added ones have a × to remove them.</p>
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
