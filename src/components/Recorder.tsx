import { useEffect, useRef, useState } from 'react'
import { clipUrl, hasClip, setClipIndex } from '../letterClips'
import { LETTER_HINTS } from '../letterHints'
import { tidyRecording } from '../recording'
import type { Language } from '../words'

const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const LANGUAGE_NAMES: Record<Language, string> = { en: 'English', it: 'Italian' }

type Props = {
  language: Language
  onClose: () => void
}

type Status = 'idle' | 'recording' | 'saving' | 'saved' | 'error'

// Record your own letter sounds: hold Space to record, let go to stop; ← → change letter.
// Saving into the app only works under `npm run dev` (see vite.config.ts).
export function Recorder({ language, onClose }: Props) {
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [, setVersion] = useState(0) // bumped after saving, to redraw which letters have clips
  const recorder = useRef<MediaRecorder | null>(null)
  const starting = useRef(false) // the microphone takes a moment to start
  const stopWhenStarted = useRef(false) // Space was let go before it had
  const letter = ALPHABET[index]
  const canSave = import.meta.env.DEV

  // Clips recorded in this session, played from memory: the dev server may not serve a new file straight away.
  const fresh = useRef(new Map<string, string>())

  function play(l = letter) {
    new Audio(fresh.current.get(l) ?? clipUrl(language, l, true)).play().catch(() => {})
  }

  async function start() {
    if (recorder.current || starting.current || !canSave) return
    starting.current = true
    stopWhenStarted.current = false
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true } })
      const chunks: Blob[] = []
      const rec = new MediaRecorder(stream)
      rec.ondataavailable = (e) => chunks.push(e.data)
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        recorder.current = null
        setStatus('saving')
        try {
          let wav: Blob
          try {
            wav = await tidyRecording(new Blob(chunks, { type: rec.mimeType }))
          } catch (error) {
            // A quick tap leaves too little to decode.
            throw new Error((error as Error).message.includes('silent') ? (error as Error).message : 'Too short. Hold Space while you say the sound.')
          }
          const response = await fetch(`/__sounds/${language}/${letter}`, { method: 'PUT', body: wav })
          if (!response.ok) throw new Error('Saving failed. Is TinyType running with npm run dev?')
          setClipIndex(await response.json())
          fresh.current.set(letter, URL.createObjectURL(wav))
          setVersion((v) => v + 1)
          setStatus('saved')
          setMessage('')
          play()
        } catch (error) {
          setStatus('error')
          setMessage((error as Error).message)
        }
      }
      rec.start()
      recorder.current = rec
      setStatus('recording')
      if (stopWhenStarted.current) rec.stop()
    } catch {
      setStatus('error')
      setMessage('No microphone access. Allow the microphone for this page in the browser.')
    } finally {
      starting.current = false
    }
  }

  function stop() {
    if (starting.current) stopWhenStarted.current = true
    else if (recorder.current?.state === 'recording') recorder.current.stop()
  }

  async function remove() {
    const response = await fetch(`/__sounds/${language}/${letter}`, { method: 'DELETE' })
    setClipIndex(await response.json())
    fresh.current.delete(letter)
    setVersion((v) => v + 1)
    setStatus('idle')
  }

  function goTo(i: number) {
    if (recorder.current) return
    setIndex(Math.max(0, Math.min(ALPHABET.length - 1, i)))
    setStatus('idle')
    setMessage('')
  }

  // Keys: hold Space to record, ← → letters, P to play, Escape to close.
  // The key listener is attached once; this keeps it pointing at the latest functions and letter.
  const keys = useRef({ start, stop, goTo, play, onClose, index })
  useEffect(() => {
    keys.current = { start, stop, goTo, play, onClose, index }
  })
  useEffect(() => {
    function down(e: KeyboardEvent) {
      const k = keys.current
      if (e.key === ' ') {
        e.preventDefault()
        if (!e.repeat) k.start()
      } else if (e.key === 'ArrowRight') k.goTo(k.index + 1)
      else if (e.key === 'ArrowLeft') k.goTo(k.index - 1)
      else if (e.key === 'p' || e.key === 'P') k.play()
      else if (e.key === 'Escape') k.onClose()
    }
    function up(e: KeyboardEvent) {
      if (e.key === ' ') {
        e.preventDefault()
        keys.current.stop()
      }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      recorder.current?.stop()
    }
  }, [])

  const recorded = hasClip(language, letter)
  const done = ALPHABET.filter((l) => hasClip(language, l)).length

  return (
    <div className="recorder">
      <header>
        <h2>Record letter sounds · {LANGUAGE_NAMES[language]}</h2>
        <span className="hint">
          {done} of 26 recorded
        </span>
        <button className="tool" onClick={onClose}>
          Done
        </button>
      </header>

      {!canSave && (
        <p className="recorder-warning">
          Recording saves the clips into the app, so it only works when TinyType runs on your computer with{' '}
          <code>npm run dev</code>.
        </p>
      )}

      <div className="recorder-main">
        <button className="recorder-arrow" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous letter">
          ◀
        </button>
        <div className="recorder-letter">
          <div className={`recorder-big ${status}`}>{letter}</div>
          <div className="recorder-hint">Say: {LETTER_HINTS[language][letter]}</div>
          <div className="recorder-status">
            {status === 'recording' && '● Recording… let go of Space to stop'}
            {status === 'saving' && 'Saving…'}
            {status === 'saved' && '✓ Saved. Listen back; hold Space to redo, → for the next letter'}
            {status === 'error' && message}
            {status === 'idle' && (recorded ? '✓ Recorded. Hold Space to record again' : 'Hold Space and say the sound')}
          </div>
          <div className="recorder-actions">
            <button
              className={status === 'recording' ? 'tool active' : 'tool'}
              disabled={!canSave}
              onMouseDown={start}
              onMouseUp={stop}
              onMouseLeave={stop}
            >
              🎙 Hold to record
            </button>
            <button className="tool" disabled={!recorded} onClick={() => play()}>
              ▶ Play (P)
            </button>
            <button className="tool" disabled={!recorded || !canSave} onClick={remove}>
              Delete
            </button>
          </div>
        </div>
        <button
          className="recorder-arrow"
          onClick={() => goTo(index + 1)}
          disabled={index === ALPHABET.length - 1}
          aria-label="Next letter"
        >
          ▶
        </button>
      </div>

      <div className="recorder-grid">
        {ALPHABET.map((l, i) => (
          <button
            key={l}
            className={[i === index && 'current', hasClip(language, l) && 'has-clip'].filter(Boolean).join(' ')}
            onClick={() => goTo(i)}
          >
            {l}
          </button>
        ))}
      </div>

      <p className="hint recorder-tips">
        Tips: a quiet room, about a hand's width from the laptop, the same voice and volume for every letter. Keep
        b, d, p, t short, with as little "uh" as you can; hold m, s, f, l for about a second.
      </p>
    </div>
  )
}
