import { useEffect, useRef, useState } from 'react'

// On phones and tablets there's no physical keyboard: an invisible text box over the word
// opens the device's own keyboard when tapped. Phone keyboards often don't say which key was
// pressed (Android reports "Unidentified"), so this reads what changed in the box instead.

// The box always holds this, so Backspace has something to delete and shows up as a change.
const FILLER = ' '

export function TouchInput({ onKey }: { onKey: (key: string) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  // The phone keyboard covers the bottom of the screen: size the app to the part still visible.
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    function fit() {
      document.documentElement.style.setProperty('--app-h', `${viewport!.height}px`)
      window.scrollTo(0, 0)
    }
    fit()
    viewport.addEventListener('resize', fit)
    return () => {
      viewport.removeEventListener('resize', fit)
      document.documentElement.style.removeProperty('--app-h')
    }
  }, [])

  function reset() {
    const el = input.current
    if (!el) return
    el.value = FILLER
    el.setSelectionRange(FILLER.length, FILLER.length)
  }

  function onInput() {
    const value = input.current?.value ?? FILLER
    if (value.length < FILLER.length) onKey('Backspace')
    else for (const char of value.slice(FILLER.length)) onKey(char)
    reset()
  }

  return (
    <>
      <input
        ref={input}
        className="touch-input"
        aria-label="Type here"
        defaultValue={FILLER}
        autoCapitalize="characters"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="go"
        onInput={onInput}
        onFocus={() => {
          setFocused(true)
          reset()
        }}
        onBlur={() => setFocused(false)}
      />
      {!focused && <div className="touch-prompt">⌨️ Tap here to type</div>}
    </>
  )
}
