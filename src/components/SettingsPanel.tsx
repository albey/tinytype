import { useRef, useState, type FormEvent } from 'react'
import { cleanWord, type Language, type Order } from '../words'
import { EmojiPicker } from './EmojiPicker'

const LANGUAGE_NAMES: Record<Language, string> = { en: 'English', it: 'Italian' }
const REPEAT_CHOICES = [1, 2, 3, 4, 5]

type Props = {
  language: Language
  words: string[]
  currentIndex: number
  onAddWord: (word: string, picture: string | undefined) => void
  pictureOf: (word: string) => string | undefined
  onRemoveWord: (index: number) => void
  onPickWord: (index: number) => void
  onResetWords: () => void
  order: Order
  onOrderChange: (order: Order) => void
  repeats: number
  onRepeatsChange: (repeats: number) => void
  hints: boolean
  onHintsChange: (on: boolean) => void
  boxes: boolean
  onBoxesChange: (on: boolean) => void
  confetti: boolean
  onConfettiChange: (on: boolean) => void
  winSound: boolean
  onWinSoundChange: (on: boolean) => void
  letterSounds: boolean
  onLetterSoundsChange: (on: boolean) => void
  oopsSound: boolean
  onOopsSoundChange: (on: boolean) => void
  sayWord: boolean
  onSayWordChange: (on: boolean) => void
  pictures: boolean
  onPicturesChange: (on: boolean) => void
  onOpenRecorder: () => void
  onClose: () => void
}

// Grown-up settings: the word list for the current language, order and repeats.
export function SettingsPanel(props: Props) {
  const { language, words, currentIndex, order, repeats } = props
  const [draft, setDraft] = useState('')
  const wordInput = useRef<HTMLInputElement>(null)
  // The picture chosen for the new word; undefined means "use the built-in one, if any".
  const [picture, setPicture] = useState<string | undefined>(undefined)
  const shownPicture = picture === undefined ? props.pictureOf(draft) : picture || undefined

  function addWord(e: FormEvent) {
    e.preventDefault()
    if (draft && !words.includes(draft)) props.onAddWord(draft, picture)
    setDraft('')
    setPicture(undefined)
  }

  return (
    <div className="overlay" onClick={props.onClose} onKeyDown={(e) => e.key === 'Escape' && props.onClose()}>
      <aside className="settings" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>Settings</h2>
          <button className="tool" onClick={props.onClose}>
            Done
          </button>
        </header>

        <section>
          <h3>{LANGUAGE_NAMES[language]} words</h3>
          <p className="hint">Tap a word to practise it now.</p>
          <ul className="word-list">
            {words.map((w, i) => (
              <li key={w} className={i === currentIndex ? 'chip current' : 'chip'}>
                <button className="chip-word" onClick={() => props.onPickWord(i)}>
                  {props.pictureOf(w) && <span className="chip-picture">{props.pictureOf(w)}</span>}
                  {w}
                </button>
                {words.length > 1 && (
                  <button className="chip-remove" aria-label={`Remove ${w}`} onClick={() => props.onRemoveWord(i)}>
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
          <form className="add-word" onSubmit={addWord}>
            <EmojiPicker
              value={shownPicture}
              onPick={(p) => {
                setPicture(p)
                wordInput.current?.focus() // so Enter adds the word straight after picking
              }}
            />
            <input
              ref={wordInput}
              value={draft}
              onChange={(e) => setDraft(cleanWord(e.target.value))}
              placeholder="Add a word, e.g. BANANA"
              autoFocus
            />
            <button className="tool active" disabled={!draft}>
              Add
            </button>
          </form>
          <button className="link" onClick={props.onResetWords}>
            Reset to the starter words
          </button>
        </section>

        <section>
          <h3>Order</h3>
          <div className="choices">
            <button className={order === 'inOrder' ? 'tool active' : 'tool'} onClick={() => props.onOrderChange('inOrder')}>
              In order
            </button>
            <button className={order === 'random' ? 'tool active' : 'tool'} onClick={() => props.onOrderChange('random')}>
              Random
            </button>
            <button className={order === 'endless' ? 'tool active' : 'tool'} onClick={() => props.onOrderChange('endless')}>
              ♾️ Endless
            </button>
          </div>
          {order === 'endless' && (
            <p className="hint">
              Endless: random words from TinyType's own list of {LANGUAGE_NAMES[language]} toddler words (animals, food, toys…), each with a
              picture. Your word list is kept for later.
            </p>
          )}
        </section>

        <section>
          <h3>Repeat each word</h3>
          <div className="choices">
            {REPEAT_CHOICES.map((n) => (
              <button key={n} className={n === repeats ? 'tool active' : 'tool'} onClick={() => props.onRepeatsChange(n)}>
                {n === 1 ? 'Once' : `${n} times`}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3>Sounds</h3>
          <Toggle
            label="Letter sounds"
            detail="Say each letter as it's typed"
            on={props.letterSounds}
            onChange={props.onLetterSoundsChange}
          />
          {/* Recording saves into the app's files, so it's only offered when running locally with `npm run dev`. */}
          {import.meta.env.DEV && (
            <button className="tool record-button" onClick={props.onOpenRecorder}>
              🎙 Record letter sounds ({LANGUAGE_NAMES[language]})
            </button>
          )}
          <Toggle
            label="Say the word"
            detail="Read the word aloud when it's finished (🔊 and Enter always work)"
            on={props.sayWord}
            onChange={props.onSayWordChange}
          />
          <Toggle
            label="Wrong-letter sound"
            detail='A soft "bonk" when a wrong letter is typed'
            on={props.oopsSound}
            onChange={props.onOopsSoundChange}
          />
          <Toggle
            label="Win sound"
            detail="A happy fanfare when a word is finished"
            on={props.winSound}
            onChange={props.onWinSoundChange}
          />
        </section>

        <section>
          <h3>Help</h3>
          <Toggle
            label="Pictures"
            detail="A picture next to the word, when there is one for it"
            on={props.pictures}
            onChange={props.onPicturesChange}
          />
          <Toggle
            label="Hint letters"
            detail="Show the letter to type, in light grey, in each empty slot"
            on={props.hints}
            onChange={props.onHintsChange}
          />
          <Toggle
            label="Letter boxes"
            detail="A box round each letter and its slot underneath"
            on={props.boxes}
            onChange={props.onBoxesChange}
          />
          <Toggle
            label="Confetti"
            detail="Confetti over the whole screen when a word is finished"
            on={props.confetti}
            onChange={props.onConfettiChange}
          />
        </section>
      </aside>
    </div>
  )
}

function Toggle({ label, detail, on, onChange }: { label: string; detail: string; on: boolean; onChange: (on: boolean) => void }) {
  return (
    <div className="toggle">
      <div>
        <div className="toggle-label">{label}</div>
        <div className="hint">{detail}</div>
      </div>
      <button className={on ? 'switch on' : 'switch'} role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} />
    </div>
  )
}
