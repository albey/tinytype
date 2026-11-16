import type { ReactNode } from 'react'
import type { Game } from '../counting'
import { useText } from '../text'

type Props = {
  game: Game
  touch: boolean // phones and tablets: tap instead of keys
  onAddWords: () => void
  onClose: () => void
}

// How to play, for grown-ups starting out: shown the first time each game is opened, and from ❓ in the top bar.
export function HowToPlay({ game, touch, onAddWords, onClose }: Props) {
  const t = useText()
  return (
    <div className="overlay centred" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="word-picker how-to" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{t.howToPlayTitle} · {game === 'letters' ? 'ABC' : '123'}</h2>
        </header>
        <ul className="how-to-steps">
          {game === 'letters' ? (
            <>
              <Step icon="🔤">{t.copyStep(touch)}</Step>
              <Step icon="🔊">{t.hearStep(touch)}</Step>
              {!touch && <Step icon="↕️">{t.arrowsStep}</Step>}
              <Step icon="✏️">
                {t.addWordsStep}{' '}
                <button className="link" onClick={onAddWords}>
                  {t.addWordsNow}
                </button>
              </Step>
            </>
          ) : (
            <>
              <Step icon="👀">{t.countStep}</Step>
              <Step icon="🔢">{t.numberStep(touch)}</Step>
              <Step icon="☝️">{t.stuckStep(touch)}</Step>
              <Step icon="🎯">{t.pickStep(touch)}</Step>
            </>
          )}
        </ul>
        <p className="hint">{t.howToFooter}</p>
        <button className="tool active how-to-go" onClick={onClose} autoFocus>
          {t.letsPlay}
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
