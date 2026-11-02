import { useEffect, useRef, useState } from 'react'
import { COLOURS, stepColour } from './colours'
import { ColourPicker } from './components/ColourPicker'
import { Confetti } from './components/Confetti'
import { Feedback } from './components/Feedback'
import { TouchInput } from './components/TouchInput'
import { SettingsPanel } from './components/SettingsPanel'
import { WordPicker } from './components/WordPicker'
import { Toolbar, type Mode } from './components/Toolbar'
import { WordRows, type TypedLetter, type WrongLetter } from './components/WordRows'
import { Recorder } from './components/Recorder'
import { CountPicker } from './components/CountPicker'
import { Objects } from './components/Objects'
import { StatsPanel } from './components/StatsPanel'
import { COUNT_NUMBERS, HOW_MANY, MAX_COUNT, nextCount, nextThing, randomCount, randomThing, type Game } from './counting'
import { hasClip, loadClipIndex, preloadClips } from './letterClips'
import { pictureFor, type CustomPictures } from './pictures'
import { playOops, playWin } from './sounds'
import { speakLetter, speakWord } from './speech'
import { elapsed, recordCorrect, recordWrong, startTimer } from './stats'
import { usePersistentState } from './usePersistentState'
import { useTouchScreen } from './useTouchScreen'
import { ENDLESS_WORDS, WORDS, baseLetter, isDigit, isLetter, nextIndex, sameLetter, type Language, type Order, type WordLists } from './words'

const WRONG_LETTER_MS = 700
const CELEBRATION_MS = 3200
const SAY_WORD_DELAY_MS = 1000
// Counting aloud waits this long between numbers, so fast presses don't talk over each other.
const COUNT_GAP_MS = 600
// Free play is hidden for now: everyone plays Copy. Set to true to bring the toolbar buttons back.
const FREE_PLAY = false

export default function App() {
  // Remembered between visits.
  const [language, setLanguage] = usePersistentState<Language>('tinytype.language', 'en')
  const [game, setGame] = usePersistentState<Game>('tinytype.game', 'letters')
  // Counting: a fixed number and picture, or null for a random one each round.
  const [countChoice, setCountChoice] = usePersistentState<number | null>('tinytype.countNumber', null)
  const [thingChoice, setThingChoice] = usePersistentState<string | null>('tinytype.countThing', null)
  const [savedMode, setMode] = usePersistentState<Mode>('tinytype.mode', 'copy')
  const [colour, setColour] = usePersistentState('tinytype.colour', COLOURS[4])
  const [wordLists, setWordLists] = usePersistentState<WordLists>('tinytype.words', WORDS)
  const [order, setOrder] = usePersistentState<Order>('tinytype.order', 'inOrder')
  const [repeats, setRepeats] = usePersistentState('tinytype.repeats', 1)
  const [hints, setHints] = usePersistentState('tinytype.hints', false)
  const [boxes, setBoxes] = usePersistentState('tinytype.boxes', true)
  const [confetti, setConfetti] = usePersistentState('tinytype.confetti', true)
  const [winSound, setWinSound] = usePersistentState('tinytype.winSound', true)
  const [letterSounds, setLetterSounds] = usePersistentState('tinytype.letterSounds', true)
  const [oopsSound, setOopsSound] = usePersistentState('tinytype.oopsSound', true)
  const [sayWordAtEnd, setSayWordAtEnd] = usePersistentState('tinytype.sayWord', true)
  const [pictures, setPictures] = usePersistentState('tinytype.pictures', true)
  const [customPictures, setCustomPictures] = usePersistentState<CustomPictures>('tinytype.customPictures', {})

  const mode: Mode = FREE_PLAY ? savedMode : 'copy'

  // Reset on every visit.
  // Endless play starts somewhere new each time.
  const [wordIndex, setWordIndex] = useState(() => (order === 'endless' ? Math.floor(Math.random() * ENDLESS_WORDS[language].length) : 0))
  const [round, setRound] = useState(0) // how many times the current word has been finished
  const [history, setHistory] = useState<number[]>([]) // words shown before this one, for ←
  // Counting: how many things, which thing, and how many have been counted aloud as a hint.
  const [count, setCount] = useState(() => countChoice ?? randomCount())
  const [thing, setThing] = useState(() => thingChoice ?? randomThing())
  const [counted, setCounted] = useState(0)
  const lastCountedAt = useRef(0)
  // `counted` as of the last press, for presses that come faster than React redraws.
  const countedNow = useRef(0)
  // Stats: whether a spoken hint was used for the letter or number being answered.
  const helped = useRef(false)
  const [typed, setTyped] = useState<TypedLetter[]>([])
  const [wrong, setWrong] = useState<WrongLetter | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [recorderOpen, setRecorderOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [countPickerOpen, setCountPickerOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const touch = useTouchScreen()

  // Find out which recorded letter sounds ship with the app.
  useEffect(() => {
    loadClipIndex().then(() => preloadClips(language, COUNT_NUMBERS))
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => preloadClips(language, COUNT_NUMBERS), [language])

  const words = wordLists[language]
  // Endless play draws from the built-in list instead of the parent's.
  const endless = order === 'endless'
  const playList = endless ? ENDLESS_WORDS[language] : words
  const currentIndex = wordIndex % playList.length
  // Counting reuses the typing game: the "word" is the number, typed with the number keys.
  const counting = game === 'numbers'
  const word = counting ? String(count) : playList[currentIndex]
  const full = typed.length === [...word].length
  const done = full && typed.every((letter) => letter.correct)
  const picture = pictureFor(word, customPictures)

  function goToWord(index: number) {
    setWordIndex(index)
    setRound(0)
    setTyped([])
    setWrong(null)
  }

  function startCountRound(n: number, t: string) {
    setCount(n)
    setThing(t)
    setCounted(0)
    countedNow.current = 0
    setTyped([])
    setWrong(null)
  }

  // The next round: the chosen number and picture, or new random ones.
  function nextCountRound() {
    startCountRound(countChoice ?? nextCount(count), thingChoice ?? nextThing(thing))
  }

  // ← and →: one fewer or one more of the same thing, stopping at 1 and 9.
  function stepCount(step: number) {
    const n = Math.min(Math.max(count + step, 1), MAX_COUNT)
    if (n !== count) startCountRound(n, thing)
  }

  // Space, or tapping a thing: count them aloud one at a time, starting again after the last.
  // With recorded numbers it goes as fast as the player, each number cutting off the one before.
  // The computer voice drops words when cut off quickly, so without a clip presses close together are ignored.
  function countAloud() {
    helped.current = true
    const n = countedNow.current >= count ? 1 : countedNow.current + 1
    const clip = hasClip(language, String(n))
    if (!clip && Date.now() - lastCountedAt.current < COUNT_GAP_MS) return
    lastCountedAt.current = Date.now()
    countedNow.current = n
    setCounted(n)
    speakWord(String(n), language)
  }

  // Stats: every answer, right or wrong, and how long the right ones took.
  function recordAnswer(correct: boolean, expected: string, pressed: string) {
    if (counting) {
      if (correct) {
        recordCorrect('numbers', expected, elapsed(), helped.current)
        recordCorrect('things', thing, elapsed(), helped.current)
      } else {
        recordWrong('numbers', expected, pressed)
        recordWrong('things', thing, pressed)
      }
    } else if (correct) {
      // The first letter's time includes looking at the word, so it isn't timed.
      recordCorrect('letters', baseLetter(expected), typed.length === 0 ? null : elapsed(), helped.current)
    } else {
      recordWrong('letters', baseLetter(expected), baseLetter(pressed))
    }
  }

  // The clock for each letter or number starts when it becomes the next one to type.
  useEffect(() => {
    startTimer()
    helped.current = false
  }, [word, typed.length, round, counting])

  // 🔊 and Enter: the word, or "How many?" when counting.
  function sayPrompt() {
    speakWord(counting ? HOW_MANY[language] : word, language)
  }

  function changeGame(next: Game) {
    setGame(next)
    setTyped([])
    setWrong(null)
    setCounted(0)
    countedNow.current = 0
  }

  function nextWord() {
    if (counting) return nextCountRound()
    setHistory((h) => [...h, currentIndex].slice(-50))
    goToWord(nextIndex(currentIndex, playList.length, order))
  }

  // Back to the word shown before this one (works for random order too); stays put at the start.
  function previousWord() {
    if (history.length > 0) {
      goToWord(history[history.length - 1])
      setHistory((h) => h.slice(0, -1))
    } else if (currentIndex > 0) {
      goToWord(currentIndex - 1)
    }
  }

  // After a finished word: the same word again until it's been done `repeats` times.
  // Counting always moves on to a new number.
  function finishWord() {
    if (counting) return nextCountRound()
    if (round + 1 < repeats) {
      setRound(round + 1)
      setTyped([])
    } else {
      nextWord()
    }
  }

  function changeLanguage(next: Language) {
    setLanguage(next)
    goToWord(endless ? Math.floor(Math.random() * ENDLESS_WORDS[next].length) : 0)
    setHistory([])
  }

  // Switching to or from endless play changes the list being played.
  function changeOrder(next: Order) {
    setOrder(next)
    if ((next === 'endless') === endless) return
    setHistory([])
    goToWord(next === 'endless' ? Math.floor(Math.random() * ENDLESS_WORDS[language].length) : 0)
  }

  // The history holds positions in the list, so it's cleared whenever the list changes.
  function setWords(next: string[]) {
    setWordLists({ ...wordLists, [language]: next })
    setHistory([])
  }

  function removeWord(index: number) {
    const next = words.filter((_, i) => i !== index)
    setWords(next)
    // Stay on the same word if it's still there.
    if (endless) return
    const stillThere = next.indexOf(word)
    if (stillThere >= 0) setWordIndex(stillThere)
    else goToWord(0)
  }

  // Keys from the physical keyboard, or from the phone keyboard through TouchInput.
  const handleKey = useRef<(key: string) => boolean>(() => false)

  useEffect(() => {
    // Returns true if TinyType used the key, so the browser shouldn't.
    function handle(key: string): boolean {
      if (settingsOpen || recorderOpen || feedbackOpen || pickerOpen || countPickerOpen || statsOpen) return false

      if (key === 'Enter') {
        sayPrompt()
        return true
      }
      // Up and down move through the colour picker, stopping at the top and bottom.
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        setColour(stepColour(colour, key === 'ArrowDown' ? 1 : -1))
        return true
      }
      // Left and right move between words, or between numbers when counting.
      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        if (counting) stepCount(key === 'ArrowRight' ? 1 : -1)
        else if (key === 'ArrowRight') nextWord()
        else previousWord()
        return true
      }
      if (done) return false

      if (key === 'Backspace') {
        setTyped((t) => t.slice(0, -1))
        return true
      }
      // Space: a spoken hint, the next letter's sound or counting the next thing (it would otherwise scroll the page).
      if (key === ' ') {
        if (counting) countAloud()
        else if (!full) {
          speakLetter([...word][typed.length], language)
          helped.current = true
        }
        return true
      }
      if (!(counting ? isDigit(key) : isLetter(key))) return false

      // Every slot is filled but something's wrong: Backspace is the way out.
      if (full) {
        if (oopsSound) playOops()
        return true
      }

      const expected = [...word][typed.length]
      const correct = sameLetter(key, expected)
      // Show the word's own letter, so a plain A typed for À appears as À.
      const char = correct ? expected : key.toUpperCase()
      recordAnswer(correct, expected, key)

      if (correct) {
        setTyped((t) => [...t, { char, colour, correct }])
        setWrong(null)
        // Counting says its answer once, when the round is won (below).
        if (letterSounds && !counting) speakLetter(char, language)
      } else if (mode === 'free') {
        // Free play keeps the wrong letter on screen, so the child can delete it and try again.
        setTyped((t) => [...t, { char, colour, correct }])
        if (oopsSound) playOops()
      } else {
        setWrong({ char, id: Date.now() })
        if (oopsSound) playOops()
      }
      return true
    }
    handleKey.current = handle

    function onKeyDown(e: KeyboardEvent) {
      // Leave shortcuts like Cmd+R alone so grown-ups can still use the browser.
      if (e.metaKey || e.ctrlKey) return
      // Letters and Backspace typed into the phone-keyboard box arrive through TouchInput instead.
      if (e.target instanceof HTMLElement && e.target.classList.contains('touch-input') && e.key !== 'Enter') return
      if (handle(e.key)) e.preventDefault()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // nextWord, previousWord, stepCount, countAloud and recordAnswer are covered by the values they read: currentIndex, words, order, history, count, thing and counted.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsOpen, recorderOpen, feedbackOpen, pickerOpen, countPickerOpen, statsOpen, done, full, word, typed.length, mode, colour, setColour, language, letterSounds, oopsSound, currentIndex, words, order, history, counting, count, thing, counted])

  // Clear a wrong letter after its wobble.
  useEffect(() => {
    if (!wrong) return
    const timer = setTimeout(() => setWrong(null), WRONG_LETTER_MS)
    return () => clearTimeout(timer)
  }, [wrong])

  // Word finished: ta-da, read it aloud (after the last letter), celebrate, then move on.
  useEffect(() => {
    if (!done) return
    if (winSound) playWin()
    // Wait a moment, so the word doesn't talk over the last letter's sound. Counting's answer is a
    // single digit with no key sound of its own, so it's said straight away, with either switch on.
    const say = counting ? sayWordAtEnd || letterSounds : sayWordAtEnd
    const delay = counting ? 0 : SAY_WORD_DELAY_MS
    const sayTimer = say ? setTimeout(() => speakWord(word, language, { interrupt: false }), delay) : undefined
    const timer = setTimeout(finishWord, CELEBRATION_MS)
    return () => {
      clearTimeout(sayTimer)
      clearTimeout(timer)
    }
    // Run once per finished word; adding finishWord would restart the timer on every render.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [done, word, language])

  const roundsShown = round + (done ? 1 : 0)

  return (
    <div className="app">
      <Toolbar
        language={language}
        onLanguageChange={changeLanguage}
        game={game}
        onGameChange={changeGame}
        mode={mode}
        onModeChange={FREE_PLAY ? setMode : undefined}
        onNextWord={nextWord}
        onOpenWordPicker={() => setPickerOpen(true)}
        onOpenCountPicker={() => setCountPickerOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenFeedback={() => setFeedbackOpen(true)}
      />
      <main className="stage">
        <div className={counting ? 'play counting' : 'play'}>
          <button
            className="speak"
            aria-label={counting ? 'Ask how many' : 'Say the word'}
            onMouseDown={(e) => e.preventDefault()}
            onClick={sayPrompt}
          >
            🔊
          </button>
          {counting && <Objects key={`${thing}-${count}`} thing={thing} count={count} counted={counted} onTap={countAloud} />}
          {counting && (
            // Drawn like the space bar, so it's clear that Space counts the things; clicking it works too.
            // It pulses until the first count of the round.
            <button className={counted === 0 ? 'space-hint waiting' : 'space-hint'} aria-label="Count them (Space)" title="Space: count them" onMouseDown={(e) => e.preventDefault()} onClick={countAloud}>
              <span className="space-key">␣</span>
              <span className="space-hint-numbers">1 2 3…</span>
            </button>
          )}
          <div className="rows-area">
            <WordRows
              word={word}
              typed={typed}
              wrong={wrong}
              colour={colour}
              done={done}
              hints={hints && !counting}
              boxes={boxes}
              hidden={counting}
            />
            {touch && <TouchInput onKey={(key) => handleKey.current(key)} numeric={counting} />}
          </div>
          {!counting && pictures && picture && (
            <div key={word} className="picture" aria-hidden="true">
              {picture}
            </div>
          )}
        </div>
        {repeats > 1 && !counting && (
          <div className="rounds" aria-label={`${roundsShown} of ${repeats}`}>
            {Array.from({ length: repeats }, (_, i) => (
              <span key={i} className={i < roundsShown ? 'round filled' : 'round'} />
            ))}
          </div>
        )}
        {done && <div className="celebration">🎉</div>}
      </main>
      <ColourPicker colour={colour} onChange={setColour} />
      {done && confetti && <Confetti />}

      {settingsOpen && (
        <SettingsPanel
          language={language}
          words={words}
          currentIndex={endless ? -1 : currentIndex}
          onAddWord={(w, pic) => {
            setWords([...words, w])
            // Only remember a picture the parent actually chose; otherwise the built-in one applies.
            if (pic !== undefined) setCustomPictures({ ...customPictures, [w]: pic })
          }}
          pictureOf={(w) => pictureFor(w, customPictures)}
          onRemoveWord={removeWord}
          onPickWord={(i) => {
            // Picking one of your own words leaves endless play, and counting.
            if (endless) setOrder('random')
            if (counting) changeGame('letters')
            goToWord(i)
          }}
          onResetWords={() => {
            setWords(WORDS[language])
            if (!endless) goToWord(0)
          }}
          order={order}
          onOrderChange={changeOrder}
          repeats={repeats}
          onRepeatsChange={setRepeats}
          hints={hints}
          onHintsChange={setHints}
          boxes={boxes}
          onBoxesChange={setBoxes}
          confetti={confetti}
          onConfettiChange={setConfetti}
          winSound={winSound}
          onWinSoundChange={setWinSound}
          letterSounds={letterSounds}
          onLetterSoundsChange={setLetterSounds}
          oopsSound={oopsSound}
          onOopsSoundChange={setOopsSound}
          sayWord={sayWordAtEnd}
          onSayWordChange={setSayWordAtEnd}
          pictures={pictures}
          onPicturesChange={setPictures}
          onOpenRecorder={() => {
            setSettingsOpen(false)
            setRecorderOpen(true)
          }}
          onOpenStats={() => {
            setSettingsOpen(false)
            setStatsOpen(true)
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {recorderOpen && <Recorder language={language} onClose={() => setRecorderOpen(false)} />}
      {statsOpen && <StatsPanel onClose={() => setStatsOpen(false)} />}
      {pickerOpen && (
        <WordPicker
          words={words}
          currentIndex={endless ? -1 : currentIndex}
          onPick={(i) => {
            if (endless) {
              // Picking one of your own words leaves endless play, as in Settings.
              setOrder('random')
              setHistory([])
            } else {
              setHistory((h) => [...h, currentIndex].slice(-50))
            }
            goToWord(i)
            setPickerOpen(false)
          }}
          endlessWords={endless ? playList : undefined}
          endlessIndex={currentIndex}
          onPickEndless={(i) => {
            setHistory((h) => [...h, currentIndex].slice(-50))
            goToWord(i)
            setPickerOpen(false)
          }}
          pictureOf={(w) => pictureFor(w, customPictures)}
          onClose={() => setPickerOpen(false)}
        />
      )}
      {countPickerOpen && (
        <CountPicker
          number={countChoice}
          thing={thingChoice}
          // Picking shows it straight away; 🎲 keeps what's on screen until the next round.
          onNumberChange={(n) => {
            setCountChoice(n)
            if (n !== null) startCountRound(n, thing)
          }}
          onThingChange={(t) => {
            setThingChoice(t)
            if (t !== null) startCountRound(count, t)
          }}
          onClose={() => setCountPickerOpen(false)}
        />
      )}
      {feedbackOpen && <Feedback language={language} onClose={() => setFeedbackOpen(false)} />}
    </div>
  )
}
