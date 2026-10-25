import { useEffect, useState } from 'react'
import { COLOURS } from './colours'
import { ColourPicker } from './components/ColourPicker'
import { Toolbar, type Mode } from './components/Toolbar'
import { WordRows, type TypedLetter, type WrongLetter } from './components/WordRows'
import { playOops } from './sounds'
import { speak } from './speech'
import { usePersistentState } from './usePersistentState'
import { WORDS, isLetter, sameLetter, type Language } from './words'

const WRONG_LETTER_MS = 700
const CELEBRATION_MS = 2500

export default function App() {
  // Remembered between visits.
  const [language, setLanguage] = usePersistentState<Language>('tinytype.language', 'en')
  const [mode, setMode] = usePersistentState<Mode>('tinytype.mode', 'copy')
  const [colour, setColour] = usePersistentState('tinytype.colour', COLOURS[4])

  // Reset on every visit.
  const [wordIndex, setWordIndex] = useState(0)
  const [typed, setTyped] = useState<TypedLetter[]>([])
  const [wrong, setWrong] = useState<WrongLetter | null>(null)

  const words = WORDS[language]
  const word = words[wordIndex % words.length]
  const full = typed.length === [...word].length
  const done = full && typed.every((letter) => letter.correct)

  function nextWord() {
    setWordIndex((i) => i + 1)
    setTyped([])
    setWrong(null)
  }

  function changeLanguage(next: Language) {
    setLanguage(next)
    setWordIndex(0)
    setTyped([])
    setWrong(null)
  }

  // Listen to the physical keyboard.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Leave shortcuts like Cmd+R alone so grown-ups can still use the browser.
      if (e.metaKey || e.ctrlKey) return
      if (done) return

      if (e.key === 'Backspace') {
        e.preventDefault()
        setTyped((t) => t.slice(0, -1))
        return
      }
      if (!isLetter(e.key)) {
        if (e.key === ' ') e.preventDefault() // stop Space scrolling the page
        return
      }

      e.preventDefault()
      // Every slot is filled but something's wrong: Backspace is the way out.
      if (full) {
        playOops()
        return
      }

      const expected = [...word][typed.length]
      const correct = sameLetter(e.key, expected)
      // Show the word's own letter, so a plain A typed for À appears as À.
      const char = correct ? expected : e.key.toUpperCase()

      if (correct) {
        setTyped((t) => [...t, { char, colour, correct }])
        setWrong(null)
      } else if (mode === 'free') {
        // Free play keeps the wrong letter on screen, so the child can delete it and try again.
        setTyped((t) => [...t, { char, colour, correct }])
        playOops()
      } else {
        setWrong({ char, id: Date.now() })
        playOops()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [done, full, word, typed.length, mode, colour])

  // Clear a wrong letter after its wobble.
  useEffect(() => {
    if (!wrong) return
    const timer = setTimeout(() => setWrong(null), WRONG_LETTER_MS)
    return () => clearTimeout(timer)
  }, [wrong])

  // Word finished: read it aloud, celebrate, then move on.
  useEffect(() => {
    if (!done) return
    speak(word, language)
    const timer = setTimeout(nextWord, CELEBRATION_MS)
    return () => clearTimeout(timer)
  }, [done, word, language])

  return (
    <div className="app">
      <Toolbar
        language={language}
        onLanguageChange={changeLanguage}
        mode={mode}
        onModeChange={setMode}
        onNextWord={nextWord}
      />
      <main className="stage">
        <WordRows word={word} typed={typed} wrong={wrong} colour={colour} done={done} />
        {done && <div className="celebration">🎉</div>}
      </main>
      <ColourPicker colour={colour} onChange={setColour} />
    </div>
  )
}
