import { useState, type FormEvent } from 'react'
import { cleanWord, type Language, type Order } from '../words'

const LANGUAGE_NAMES: Record<Language, string> = { en: 'English', it: 'Italian' }
const REPEAT_CHOICES = [1, 2, 3, 4, 5]

type Props = {
  language: Language
  words: string[]
  currentIndex: number
  onAddWord: (word: string) => void
  onRemoveWord: (index: number) => void
  onPickWord: (index: number) => void
  onResetWords: () => void
  order: Order
  onOrderChange: (order: Order) => void
  repeats: number
  onRepeatsChange: (repeats: number) => void
  onClose: () => void
}

// Grown-up settings: the word list for the current language, order and repeats.
export function SettingsPanel(props: Props) {
  const { language, words, currentIndex, order, repeats } = props
  const [draft, setDraft] = useState('')

  function addWord(e: FormEvent) {
    e.preventDefault()
    if (draft && !words.includes(draft)) props.onAddWord(draft)
    setDraft('')
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
            <input
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
          </div>
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
      </aside>
    </div>
  )
}
