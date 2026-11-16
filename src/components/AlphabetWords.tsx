import { useState, type FormEvent } from 'react'
import { ALPHABET, ALPHABET_CHOICES, baseLetter, cleanWord, type Language } from '../words'
import { useText } from '../text'
import { EmojiPicker } from './EmojiPicker'

type Props = {
  language: Language
  words: string[] // the word for each letter, in alphabet order
  currentIndex: number // the letter being played, or -1
  pictureOf: (word: string) => string | undefined
  onChoose: (letter: string, word: string, picture: string | undefined) => void
  onPlay: (index: number) => void
  onShuffle: () => void
}

// Alphabet mode in Settings: the word for each letter. Tap a letter to choose another word for it,
// from TinyType's suggestions or your own (it has to start with that letter).
export function AlphabetWords({ language, words, currentIndex, pictureOf, onChoose, onPlay, onShuffle }: Props) {
  const t = useText()
  const [open, setOpen] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [picture, setPicture] = useState<string | undefined>(undefined)
  const shownPicture = picture === undefined ? pictureOf(draft) : picture || undefined
  const letters = ALPHABET[language]

  function toggle(letter: string) {
    setOpen(open === letter ? null : letter)
    setDraft('')
    setPicture(undefined)
  }

  function addOwn(e: FormEvent, letter: string) {
    e.preventDefault()
    if (!draft || baseLetter(draft[0]) !== letter) return
    onChoose(letter, draft, picture)
    setDraft('')
    setPicture(undefined)
  }

  return (
    <div className="alphabet-words">
      <p className="hint">
        {t.alphabetHint(letters[letters.length - 1])}{' '}
        <button className="link" onClick={onShuffle}>
          {t.newRandomWords}
        </button>
      </p>
      <ul className="alphabet-list">
        {letters.map((letter, i) => {
          const word = words[i]
          const choices = ALPHABET_CHOICES[language][letter]
          // A word the parent typed shows among the choices too, so it stays selectable.
          const shown = choices.includes(word) ? choices : [...choices, word]
          const draftOk = draft.length > 0 && baseLetter(draft[0]) === letter
          return (
            <li key={letter} className={i === currentIndex ? 'alphabet-row current' : 'alphabet-row'}>
              <button className="alphabet-summary" aria-expanded={open === letter} onClick={() => toggle(letter)}>
                <span className="alphabet-letter">{letter}</span>
                <span className="alphabet-word">
                  {pictureOf(word) && <span className="chip-picture">{pictureOf(word)}</span>}
                  {word}
                </span>
                <span className="alphabet-more" aria-hidden="true">
                  {open === letter ? '▴' : '▾'}
                </span>
              </button>
              {open === letter && (
                <div className="alphabet-choices">
                  <ul className="word-list">
                    {shown.map((w) => (
                      <li key={w} className={w === word ? 'chip current' : 'chip'}>
                        <button className="chip-word" onClick={() => onChoose(letter, w, undefined)}>
                          {pictureOf(w) && <span className="chip-picture">{pictureOf(w)}</span>}
                          {w}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <form className="add-word" onSubmit={(e) => addOwn(e, letter)}>
                    <EmojiPicker value={shownPicture} onPick={setPicture} />
                    <input
                      value={draft}
                      onChange={(e) => setDraft(cleanWord(e.target.value))}
                      placeholder={t.ownLetterWord(letter)}
                      aria-label={t.ownLetterWordLabel(letter)}
                      autoFocus
                    />
                    <button className="tool active" disabled={!draftOk}>
                      {t.use}
                    </button>
                  </form>
                  {draft.length > 0 && !draftOk && <p className="hint">{t.mustStartWith(letter)}</p>}
                  <button className="link" onClick={() => onPlay(i)}>
                    {t.playLetterNow(letter)}
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
