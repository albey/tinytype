import type { ReactNode } from 'react'
import type { Game } from '../counting'
import type { Language } from '../words'

export type Mode = 'copy' | 'free'

type Props = {
  language: Language
  onLanguageChange: (language: Language) => void
  game: Game
  onGameChange: (game: Game) => void
  mode: Mode
  onModeChange?: (mode: Mode) => void // left out to hide the Copy / Free play buttons
  onNextWord: () => void
  onOpenWordPicker: () => void
  onOpenCountPicker: () => void
  onOpenSettings: () => void
  onOpenFeedback: () => void
  onOpenHelp: () => void
}

// Small grown-up controls in the corner.
export function Toolbar({ language, onLanguageChange, game, onGameChange, mode, onModeChange, onNextWord, onOpenWordPicker, onOpenCountPicker, onOpenSettings, onOpenFeedback, onOpenHelp }: Props) {
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen()
  }

  return (
    <div className="toolbar">
      <ToolButton active={language === 'en'} onClick={() => onLanguageChange('en')}>
        🇬🇧 EN
      </ToolButton>
      <ToolButton active={language === 'it'} onClick={() => onLanguageChange('it')}>
        🇮🇹 IT
      </ToolButton>
      <span className="divider" />
      <ToolButton active={game === 'letters'} onClick={() => onGameChange('letters')}>
        ABC
      </ToolButton>
      <ToolButton active={game === 'numbers'} onClick={() => onGameChange('numbers')}>
        123
      </ToolButton>
      {onModeChange && game === 'letters' && (
        <>
          <span className="divider" />
          <ToolButton active={mode === 'copy'} onClick={() => onModeChange('copy')}>
            Copy
          </ToolButton>
          <ToolButton active={mode === 'free'} onClick={() => onModeChange('free')}>
            Free play
          </ToolButton>
        </>
      )}
      <span className="divider" />
      {game === 'letters' ? (
        <ToolButton onClick={onOpenWordPicker}>🔤 Words</ToolButton>
      ) : (
        <ToolButton onClick={onOpenCountPicker}>🎯 Pick</ToolButton>
      )}
      <ToolButton onClick={onNextWord}>{game === 'letters' ? 'Next word →' : 'Next →'}</ToolButton>
      {/* iPhones can't go full screen from a web page. */}
      {document.fullscreenEnabled && <ToolButton onClick={toggleFullscreen}>⛶ Full screen</ToolButton>}
      <ToolButton onClick={onOpenSettings}>⚙ Settings</ToolButton>
      <ToolButton onClick={onOpenHelp} label="How to play">
        ❓
      </ToolButton>
      <ToolButton onClick={onOpenFeedback} label="Send feedback">
        💬
      </ToolButton>
    </div>
  )
}

function ToolButton({ active, onClick, label, children }: { active?: boolean; onClick: () => void; label?: string; children: ReactNode }) {
  return (
    <button
      className={active ? 'tool active' : 'tool'}
      aria-label={label}
      title={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
