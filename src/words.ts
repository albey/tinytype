export type Language = 'en' | 'it'

// Starter words for each language. Phase 2 lets parents add their own.
export const WORDS: Record<Language, string[]> = {
  en: ['MOM', 'DAD', 'BABY', 'CAT', 'DOG', 'BALL'],
  it: ['MAMMA', 'PAPÀ', 'NONNA', 'CANE', 'GATTO', 'PALLA'],
}

// Strips accents so a plain "A" on the keyboard counts for "À".
function baseLetter(letter: string): string {
  return letter.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()
}

export function sameLetter(typed: string, expected: string): boolean {
  return baseLetter(typed) === baseLetter(expected)
}

export function isLetter(key: string): boolean {
  return /^\p{L}$/u.test(key)
}
