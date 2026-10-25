import { useEffect, useState } from 'react'
import { COLOURS } from './colours'
import { ColourPicker } from './components/ColourPicker'
import { SettingsPanel } from './components/SettingsPanel'
import { Toolbar, type Mode } from './components/Toolbar'
import { WordRows, type TypedLetter, type WrongLetter } from './components/WordRows'
import { playOops } from './sounds'
import { speakLetter, speakWord } from './speech'
import { usePersistentState } from './usePersistentState'
import { WORDS, isLetter, nextIndex, sameLetter, type Language, type Order, type WordLists } from './words'

const WRONG_LETTER_MS = 700
const CELEBRATION_MS = 2500

export default function App() {
  // Remembered between visits.
  const [language, setLanguage] = usePersistentState<Language>('tinytype.language', 'en')
  const [mode, setMode] = usePersistentState<Mode>('tinytype.mode', 'copy')
  const [colour, setColour] = usePersistentState('tinytype.colour', COLOURS[4])
  const [wordLists, setWordLists] = usePersistentState<WordLists>('tinytype.words', WORDS)
  const [order, setOrder] = usePersistentState<Order>('tinytype.order', 'inOrder')
  const [repeats, setRepeats] = usePersistentState('tinytype.repeats', 1)

  // Reset on every visit.
  const [wordIndex, setWordIndex] = useState(0)
  const [round, setRound] = useState(0) // how many times the current word has been finished
  const [typed, setTyped] = useState<TypedLetter[]>([])
  const [wrong, setWrong] = useState<WrongLetter | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const words = wordLists[language]
  const currentIndex = wordIndex % words.length
  const word = words[currentIndex]
  const full = typed.length === [...word].length
  const done = full && typed.every((letter) => letter.correct)

  function goToWord(index: number) {
    setWordIndex(index)
    setRound(0)
    setTyped([])
    setWrong(null)
  }

  function nextWord() {
    goToWord(nextIndex(currentIndex, words.length, order))
  }

  // After a finished word: the same word again until it's been done `repeats` times.
  function finishWord() {
    if (round + 1 < repeats) {
      setRound(round + 1)
      setTyped([])
    } else {
      nextWord()
    }
  }

  function changeLanguage(next: Language) {
    setLanguage(next)
    goToWord(0)
  }

  function setWords(next: string[]) {
    setWordLists({ ...wordLists, [language]: next })
  }

  function removeWord(index: number) {
    const next = words.filter((_, i) => i !== index)
    setWords(next)
    // Stay on the same word if it's still there.
    const stillThere = next.indexOf(word)
    if (stillThere >= 0) setWordIndex(stillThere)
    else goToWord(0)
  }

  // Listen to the physical keyboard.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Leave shortcuts like Cmd+R alone so grown-ups can still use the browser.
      if (e.metaKey || e.ctrlKey) return
      if (settingsOpen) return

      if (e.key === 'Enter') {
        e.preventDefault()
        speakWord(word, language)
        return
      }
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
        speakLetter(char, language)
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
  }, [settingsOpen, done, full, word, typed.length, mode, colour, language])

  // Clear a wrong letter after its wobble.
  useEffect(() => {
    if (!wrong) return
    const timer = setTimeout(() => setWrong(null), WRONG_LETTER_MS)
    return () => clearTimeout(timer)
  }, [wrong])

  // Word finished: read it aloud (after the last letter), celebrate, then move on.
  useEffect(() => {
    if (!done) return
    speakWord(word, language, { interrupt: false })
    const timer = setTimeout(finishWord, CELEBRATION_MS)
    return () => clearTimeout(timer)
    // Run once per finished word; adding finishWord would restart the timer on every render.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [done, word, language])

  const roundsShown = round + (done ? 1 : 0)

  return (
    <div className="app">
      <Toolbar
        language={language}
        onLanguageChange={changeLanguage}
        mode={mode}
        onModeChange={setMode}
        onNextWord={nextWord}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <main className="stage">
        <div className="play">
          <button
            className="speak"
            aria-label="Say the word"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => speakWord(word, language)}
          >
            🔊
          </button>
          <WordRows word={word} typed={typed} wrong={wrong} colour={colour} done={done} />
        </div>
        {repeats > 1 && (
          <div className="rounds" aria-label={`${roundsShown} of ${repeats}`}>
            {Array.from({ length: repeats }, (_, i) => (
              <span key={i} className={i < roundsShown ? 'round filled' : 'round'} />
            ))}
          </div>
        )}
        {done && <div className="celebration">🎉</div>}
      </main>
      <ColourPicker colour={colour} onChange={setColour} />

      {settingsOpen && (
        <SettingsPanel
          language={language}
          words={words}
          currentIndex={currentIndex}
          onAddWord={(w) => setWords([...words, w])}
          onRemoveWord={removeWord}
          onPickWord={goToWord}
          onResetWords={() => {
            setWords(WORDS[language])
            goToWord(0)
          }}
          order={order}
          onOrderChange={setOrder}
          repeats={repeats}
          onRepeatsChange={setRepeats}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}
