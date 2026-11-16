import { useRef, useState, type FormEvent } from 'react'
import { useText } from '../text'
import { cleanWord, type Language, type Order } from '../words'
import { AlphabetWords } from './AlphabetWords'
import { EmojiPicker } from './EmojiPicker'

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
  alphabetWords: string[]
  alphabetIndex: number
  onChooseAlphabetWord: (letter: string, word: string, picture: string | undefined) => void
  onPlayAlphabetLetter: (index: number) => void
  onShuffleAlphabet: () => void
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
  onOpenStats: () => void
  onClose: () => void
}

// Grown-up settings: the word list for the current language, order and repeats.
export function SettingsPanel(props: Props) {
  const { language, words, currentIndex, order, repeats } = props
  const t = useText()
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
          <h2>{t.settingsTitle}</h2>
          <button className="tool" onClick={props.onClose}>
            {t.done}
          </button>
        </header>

        <section>
          <h3>{t.yourWordsHeading[language]}</h3>
          <p className="hint">{t.tapToPractise}</p>
          <ul className="word-list">
            {words.map((w, i) => (
              <li key={w} className={i === currentIndex ? 'chip current' : 'chip'}>
                <button className="chip-word" onClick={() => props.onPickWord(i)}>
                  {props.pictureOf(w) && <span className="chip-picture">{props.pictureOf(w)}</span>}
                  {w}
                </button>
                {words.length > 1 && (
                  <button className="chip-remove" aria-label={t.remove(w)} onClick={() => props.onRemoveWord(i)}>
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
              placeholder={t.addWordPlaceholder}
              autoFocus
            />
            <button className="tool active" disabled={!draft}>
              {t.add}
            </button>
          </form>
          <button className="link" onClick={props.onResetWords}>
            {t.resetWords}
          </button>
        </section>

        <section>
          <h3>{t.mode}</h3>
          <div className="choices">
            <button className={order === 'inOrder' ? 'tool active' : 'tool'} onClick={() => props.onOrderChange('inOrder')}>
              {t.inOrder}
            </button>
            <button className={order === 'random' ? 'tool active' : 'tool'} onClick={() => props.onOrderChange('random')}>
              {t.random}
            </button>
            <button className={order === 'endless' ? 'tool active' : 'tool'} onClick={() => props.onOrderChange('endless')}>
              {t.endless}
            </button>
            <button className={order === 'alphabet' ? 'tool active' : 'tool'} onClick={() => props.onOrderChange('alphabet')}>
              {t.alphabet}
            </button>
          </div>
          {order === 'endless' && (
            <p className="hint">{t.endlessHint(t.languageNames[language])}</p>
          )}
          {order === 'alphabet' && (
            <AlphabetWords
              language={language}
              words={props.alphabetWords}
              currentIndex={props.alphabetIndex}
              pictureOf={props.pictureOf}
              onChoose={props.onChooseAlphabetWord}
              onPlay={props.onPlayAlphabetLetter}
              onShuffle={props.onShuffleAlphabet}
            />
          )}
        </section>

        <section>
          <h3>{t.repeatEachWord}</h3>
          <div className="choices">
            {REPEAT_CHOICES.map((n) => (
              <button key={n} className={n === repeats ? 'tool active' : 'tool'} onClick={() => props.onRepeatsChange(n)}>
                {n === 1 ? t.once : t.times(n)}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3>{t.sounds}</h3>
          <Toggle
            label={t.letterSounds}
            detail={t.letterSoundsDetail}
            on={props.letterSounds}
            onChange={props.onLetterSoundsChange}
          />
          {/* Recording saves into the app's files, so it's only offered when running locally with `npm run dev`. */}
          {import.meta.env.DEV && (
            <button className="tool record-button" onClick={props.onOpenRecorder}>
              {t.recordSounds(t.languageNames[language])}
            </button>
          )}
          <Toggle
            label={t.sayWord}
            detail={t.sayWordDetail}
            on={props.sayWord}
            onChange={props.onSayWordChange}
          />
          <Toggle
            label={t.oopsSound}
            detail={t.oopsSoundDetail}
            on={props.oopsSound}
            onChange={props.onOopsSoundChange}
          />
          <Toggle
            label={t.winSound}
            detail={t.winSoundDetail}
            on={props.winSound}
            onChange={props.onWinSoundChange}
          />
        </section>

        <section>
          <h3>{t.help}</h3>
          <Toggle
            label={t.pictures}
            detail={t.picturesDetail}
            on={props.pictures}
            onChange={props.onPicturesChange}
          />
          <Toggle
            label={t.hintLetters}
            detail={t.hintLettersDetail}
            on={props.hints}
            onChange={props.onHintsChange}
          />
          <Toggle
            label={t.letterBoxes}
            detail={t.letterBoxesDetail}
            on={props.boxes}
            onChange={props.onBoxesChange}
          />
          <Toggle
            label={t.confetti}
            detail={t.confettiDetail}
            on={props.confetti}
            onChange={props.onConfettiChange}
          />
        </section>

        <section>
          <h3>{t.stats}</h3>
          <p className="hint">{t.statsDetail}</p>
          <button className="tool" onClick={props.onOpenStats}>
            {t.seeStats}
          </button>
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
