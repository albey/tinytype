import { MAX_COUNT, THINGS } from '../counting'
import { useText } from '../text'
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
  const t = useText()
  return (
    <div className="overlay centred" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="word-picker count-picker" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{t.whatToCount}</h2>
          <button className="tool" onClick={onClose} autoFocus>
            {t.done}
          </button>
        </header>
        <div className="word-picker-lists">
          <h3>{t.howMany}</h3>
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
          <h3>{t.picturesHeading}</h3>
          <p className="hint count-hint">
            {things.length === 0
              ? t.allThings
              : things.length === 1
                ? t.oneThing
                : t.someThings(things.length)}
          </p>
          <div className="word-tiles count-tiles">
            <Tile current={things.length === 0} onClick={onAllThings}>
              🎲
            </Tile>
            {THINGS.map((thing) => (
              <Tile key={thing} current={things.includes(thing)} onClick={() => onToggleThing(thing)}>
                {thing}
              </Tile>
            ))}
            {added.map((thing) => (
              <div key={thing} className="count-added">
                <Tile current={things.includes(thing)} onClick={() => onToggleThing(thing)}>
                  {thing}
                </Tile>
                <button className="chip-remove" aria-label={t.remove(thing)} onClick={() => onRemoveThing(thing)}>
                  ×
                </button>
              </div>
            ))}
            {/* Any emoji from the full list (or pasted) joins the pictures, random rounds included. */}
            <EmojiPicker
              value={undefined}
              label="＋"
              title={t.addPicture}
              allowNone={false}
              onPick={(thing) => {
                // Already in the list: just choose it.
                if (THINGS.includes(thing) || added.includes(thing)) {
                  if (!things.includes(thing)) onToggleThing(thing)
                }
                else if (thing) onAddThing(thing)
              }}
            />
          </div>
          <p className="hint">{t.addPictureHint}</p>
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
