import type { Language } from './words'

// Recorded letter sounds that ship with the app, in public/sounds/<lang>/<LETTER>.wav.
// index.json lists which exist; letters without a clip fall back to the computer voice.

type Index = Partial<Record<Language, string[]>>

let index: Index = {}
let playing: HTMLAudioElement | null = null

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
}

export function hasClip(language: Language, letter: string): boolean {
  return index[language]?.includes(letter) ?? false
}

// Plays the recorded clip for a letter. Returns false if there isn't one, so the caller can fall back.
export function playClip(language: Language, letter: string): boolean {
  if (!hasClip(language, letter)) return false
  playing?.pause()
  playing = new Audio(clipUrl(language, letter))
  playing.play().catch(() => {})
  return true
}
