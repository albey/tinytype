import type { ReactNode } from 'react'
import type { Game } from '../counting'

type Props = {
  game: Game
  touch: boolean // phones and tablets: tap instead of keys
  onAddWords: () => void
  onClose: () => void
}

// How to play, for grown-ups starting out: shown the first time each game is opened, and from ❓ in the top bar.
export function HowToPlay({ game, touch, onAddWords, onClose }: Props) {
  return (
    <div className="overlay centred" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="word-picker how-to" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>How to play · {game === 'letters' ? 'ABC' : '123'}</h2>
        </header>
        <ul className="how-to-steps">
          {game === 'letters' ? (
            <>
              <Step icon="🔤">
                Copy the word: {touch ? 'tap the word to open the keyboard, then type' : 'press'} each letter. The faint letter in the
                box is the next one.
              </Step>
              <Step icon="🔊">Tap 🔊{touch ? '' : ' or press Enter'} to hear the word.{touch ? '' : ' Space says the next letter, as a hint.'}</Step>
              {!touch && <Step icon="↕️">↑ ↓ change the colour, ← → change the word.</Step>}
              <Step icon="✏️">
                Add your own words, with a picture: ⚙ Settings → type a word → Add. 🔤 Words picks one to play.{' '}
                <button className="link" onClick={onAddWords}>
                  Add words now
                </button>
              </Step>
            </>
          ) : (
            <>
              <Step icon="👀">Count the things on the screen.</Step>
              <Step icon="🔢">
                {touch ? 'Tap the box with the ? to open the keyboard, and type' : 'Press'} the number: it goes in the box with the ?
              </Step>
              <Step icon="☝️">
                Stuck? {touch ? 'Tap the things' : 'Press Space (or tap the things)'} to count them aloud one by one. The last number, in red, is the
                answer.
              </Step>
              <Step icon="🎯">
                🎯 Pick sets how many and which picture, to practise one; random (🎲) by default.{!touch && ' ← → one fewer or one more.'}
              </Step>
            </>
          )}
        </ul>
        <p className="hint">Sounds, help and your word list are in ⚙ Settings. This help is under ❓ in the top bar.</p>
        <button className="tool active how-to-go" onClick={onClose} autoFocus>
          Let's play
        </button>
      </div>
    </div>
  )
}

function Step({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <li>
      <span className="how-to-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{children}</span>
    </li>
  )
}
