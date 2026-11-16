import type { ReactNode } from 'react'
import type { Game } from '../counting'
import { useText } from '../text'
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
  const t = useText()
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
            {t.copy}
          </ToolButton>
          <ToolButton active={mode === 'free'} onClick={() => onModeChange('free')}>
            {t.freePlay}
          </ToolButton>
        </>
      )}
      <span className="divider" />
      {game === 'letters' ? (
        <ToolButton onClick={onOpenWordPicker}>{t.words}</ToolButton>
      ) : (
        <ToolButton onClick={onOpenCountPicker}>{t.pick}</ToolButton>
      )}
      <ToolButton onClick={onNextWord}>{game === 'letters' ? t.nextWord : t.next}</ToolButton>
      {/* iPhones can't go full screen from a web page. */}
      {document.fullscreenEnabled && <ToolButton onClick={toggleFullscreen}>{t.fullScreen}</ToolButton>}
      <ToolButton onClick={onOpenSettings}>{t.settings}</ToolButton>
      <ToolButton onClick={onOpenHelp} label={t.howToPlay}>
        ❓
      </ToolButton>
      <ToolButton onClick={onOpenFeedback} label={t.sendFeedback}>
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
