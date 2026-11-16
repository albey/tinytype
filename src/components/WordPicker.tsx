import { useText } from '../text'

type Props = {
  words: string[]
  currentIndex: number // -1 when the current word isn't one of these
  onPick: (index: number) => void
  // In endless play or alphabet mode, the words being played are listed too, under the parent's own.
  extraTitle?: string
  extraWords?: string[]
  extraIndex?: number
  onPickExtra?: (index: number) => void
  pictureOf: (word: string) => string | undefined
  onAddWords: () => void // opens Settings, where words are added
  onClose: () => void
}

// A popup with the words to choose from, as big tiles: tap one to play it straight away.
export function WordPicker(props: Props) {
  const { extraWords, onPickExtra, onClose } = props
  const t = useText()
  return (
    <div className="overlay centred" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="word-picker" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{t.pickAWord}</h2>
          <button className="tool" onClick={onClose} autoFocus>
            {t.close}
          </button>
        </header>
        <div className="word-picker-lists">
          {extraWords && <h3>{t.yourWords}</h3>}
          <Tiles words={props.words} currentIndex={props.currentIndex} pictureOf={props.pictureOf} onPick={props.onPick} />
          {extraWords && onPickExtra && (
            <>
              <h3>{props.extraTitle}</h3>
              <Tiles words={extraWords} currentIndex={props.extraIndex ?? -1} pictureOf={props.pictureOf} onPick={onPickExtra} />
            </>
          )}
          <p className="hint word-picker-add">
            {t.wantOtherWords}{' '}
            <button className="link" onClick={props.onAddWords}>
              {t.addYourOwn}
            </button>
          </p>
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
