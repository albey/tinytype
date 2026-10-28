import type { ReactNode } from 'react'
import type { Language } from '../words'

export type Mode = 'copy' | 'free'

type Props = {
  language: Language
  onLanguageChange: (language: Language) => void
  mode: Mode
  onModeChange: (mode: Mode) => void
  onNextWord: () => void
  onOpenSettings: () => void
  onOpenFeedback: () => void
}

// Small grown-up controls in the corner.
export function Toolbar({ language, onLanguageChange, mode, onModeChange, onNextWord, onOpenSettings, onOpenFeedback }: Props) {
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
      <ToolButton active={mode === 'copy'} onClick={() => onModeChange('copy')}>
        Copy
      </ToolButton>
      <ToolButton active={mode === 'free'} onClick={() => onModeChange('free')}>
        Free play
      </ToolButton>
      <span className="divider" />
      <ToolButton onClick={onNextWord}>Next word →</ToolButton>
      {/* iPhones can't go full screen from a web page. */}
      {document.fullscreenEnabled && <ToolButton onClick={toggleFullscreen}>⛶ Full screen</ToolButton>}
      <ToolButton onClick={onOpenSettings}>⚙ Settings</ToolButton>
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
