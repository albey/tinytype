import { nextIndex, type Language } from './words'

// Letters: copy a word. Numbers: count the things on screen and press the number.
export type Game = 'letters' | 'numbers'

// Up to 9, so every answer is a single key.
export const MAX_COUNT = 9
// The answers as text: what's typed, spoken and recorded.
export const COUNT_NUMBERS = Array.from({ length: MAX_COUNT }, (_, i) => String(i + 1))

// Things to count: easy to tell apart and nice in a row. Emoji only, so they work in both languages.
export const THINGS = [
  '🍎', '🍌', '🍓', '🍊', '🍐', '🍇', '🥕', '🍪', '🧁', '🍦',
  '🐶', '🐱', '🐟', '🐦', '🦆', '🐷', '🐮', '🐸', '🐝', '🐞', '🦋', '🐢',
  '⭐', '🌸', '🌳', '🎈', '⚽', '🚗', '🚂', '⛵', '✈️', '🧸',
]

export const HOW_MANY: Record<Language, string> = { en: 'How many?', it: 'Quanti sono?' }

export function randomCount(): number {
  return 1 + Math.floor(Math.random() * MAX_COUNT)
}

// A new number from 1 to 9, never the same twice in a row.
export function nextCount(current: number): number {
  return nextIndex(current - 1, MAX_COUNT, 'random') + 1
}

export function randomThing(): string {
  return THINGS[Math.floor(Math.random() * THINGS.length)]
}

// A different thing from the one on screen.
export function nextThing(current: string): string {
  return THINGS[nextIndex(Math.max(THINGS.indexOf(current), 0), THINGS.length, 'random')]
}
