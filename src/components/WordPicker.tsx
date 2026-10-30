type Props = {
  words: string[]
  currentIndex: number // -1 when the current word isn't one of these
  onPick: (index: number) => void
  // In endless play, the built-in endless words are listed too, under the parent's own.
  endlessWords?: string[]
  endlessIndex?: number
  onPickEndless?: (index: number) => void
  pictureOf: (word: string) => string | undefined
  onClose: () => void
}

// A popup with the words to choose from, as big tiles: tap one to play it straight away.
export function WordPicker(props: Props) {
  const { endlessWords, onPickEndless, onClose } = props
  return (
    <div className="overlay centred" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="word-picker" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>Pick a word</h2>
          <button className="tool" onClick={onClose} autoFocus>
            Close
          </button>
        </header>
        <div className="word-picker-lists">
          {endlessWords && <h3>Your words</h3>}
          <Tiles words={props.words} currentIndex={props.currentIndex} pictureOf={props.pictureOf} onPick={props.onPick} />
          {endlessWords && onPickEndless && (
            <>
              <h3>♾️ Endless words</h3>
              <Tiles words={endlessWords} currentIndex={props.endlessIndex ?? -1} pictureOf={props.pictureOf} onPick={onPickEndless} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

type TilesProps = { words: string[]; currentIndex: number; pictureOf: (word: string) => string | undefined; onPick: (index: number) => void }

function Tiles({ words, currentIndex, pictureOf, onPick }: TilesProps) {
  return (
    <div className="word-tiles">
      {words.map((w, i) => (
        <button key={w} className={i === currentIndex ? 'word-tile current' : 'word-tile'} onClick={() => onPick(i)}>
          <span className="word-tile-picture" aria-hidden="true">
            {pictureOf(w) ?? '🔤'}
          </span>
          {w}
        </button>
      ))}
    </div>
  )
}
