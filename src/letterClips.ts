import type { Language } from './words'

// Recorded letter and number sounds that ship with the app, in public/sounds/<lang>/<LETTER or 1-9>.wav.
// index.json lists which exist; anything without a clip falls back to the computer voice.

type Index = Partial<Record<Language, string[]>>

let index: Index = {}
let playing: HTMLAudioElement | AudioBufferSourceNode | null = null

// Clips are decoded ahead of time and played through Web Audio, so a clip starts the moment a key
// is pressed and the next one cuts it off cleanly (counting can go as fast as the player).
let audio: AudioContext | null = null
const decoded = new Map<string, Promise<AudioBuffer | null>>()
const ready = new Map<string, AudioBuffer>()

function decode(url: string): Promise<AudioBuffer | null> {
  audio ??= new AudioContext()
  const ctx = audio
  let clip = decoded.get(url)
  if (!clip) {
    clip = fetch(url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
      .then((data) => ctx.decodeAudioData(data))
      .catch(() => null)
    decoded.set(url, clip)
  }
  return clip
}

export function clipUrl(language: Language, letter: string, bust = false): string {
  return `${import.meta.env.BASE_URL}sounds/${language}/${letter}.wav${bust ? `?${Date.now()}` : ''}`
}

// Loads (or reloads, after recording) the list of clips. Missing or broken list = no clips.
export async function loadClipIndex(): Promise<Index> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}sounds/index.json?${Date.now()}`)
    index = response.ok ? await response.json() : {}
  } catch {
    index = {}
  }
  return index
}

// After recording: the dev server replies with the up-to-date list.
export function setClipIndex(next: Index) {
  index = next
  // A clip may have been re-recorded: decode it again when it's next needed.
  decoded.clear()
  ready.clear()
}

// Decodes the clips for these letters/numbers in the background, so they play without a delay.
export function preloadClips(language: Language, letters: string[]) {
  for (const letter of letters) {
    if (!hasClip(language, letter)) continue
    const url = clipUrl(language, letter)
    decode(url).then((buffer) => buffer && ready.set(url, buffer))
  }
}

export function hasClip(language: Language, letter: string): boolean {
  return index[language]?.includes(letter) ?? false
}

// Plays the recorded clip for a letter or number, cutting off the one before.
// Returns false if there isn't one, so the caller can fall back.
export function playClip(language: Language, letter: string): boolean {
  if (!hasClip(language, letter)) return false
  stopClip()
  const url = clipUrl(language, letter)
  const buffer = ready.get(url)
  if (buffer && audio) {
    if (audio.state === 'suspended') audio.resume()
    const source = audio.createBufferSource()
    source.buffer = buffer
    source.connect(audio.destination)
    source.start()
    playing = source
  } else {
    // Not decoded yet: play it the simple way this time, and have it ready for next time.
    playing = new Audio(url)
    playing.play().catch(() => {})
    preloadClips(language, [letter])
  }
  return true
}

function stopClip() {
  if (playing instanceof HTMLAudioElement) playing.pause()
  else playing?.stop()
  playing = null
}
