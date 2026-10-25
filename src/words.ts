export type Language = 'en' | 'it'
export type Order = 'inOrder' | 'random'
export type WordLists = Record<Language, string[]>

// Starter words for each language. Parents can change them in Settings.
export const WORDS: WordLists = {
  en: ['MOM', 'DAD', 'BABY', 'CAT', 'DOG', 'BALL'],
  it: ['MAMMA', 'PAPÀ', 'NONNA', 'CANE', 'GATTO', 'PALLA'],
}

// Strips accents so a plain "A" on the keyboard counts for "À".
export function baseLetter(letter: string): string {
  return letter.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()
}

export function sameLetter(typed: string, expected: string): boolean {
  return baseLetter(typed) === baseLetter(expected)
}

export function isLetter(key: string): boolean {
  return /^\p{L}$/u.test(key)
}

// Turns whatever a parent typed into a word the game can use: capitals, letters only.
export function cleanWord(text: string): string {
  return text.toUpperCase().replace(/[^\p{L}]/gu, '').slice(0, 12)
}

export function nextIndex(current: number, count: number, order: Order): number {
  if (order === 'inOrder' || count < 2) return (current + 1) % count
  // Random, but never the same word twice in a row.
  const pick = Math.floor(Math.random() * (count - 1))
  return pick >= current ? pick + 1 : pick
}
