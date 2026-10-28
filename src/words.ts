export type Language = 'en' | 'it'
export type Order = 'inOrder' | 'random' | 'endless'
export type WordLists = Record<Language, string[]>

// Starter words for each language. Parents can change them in Settings.
export const WORDS: WordLists = {
  en: ['MOM', 'DAD', 'BABY', 'CAT', 'DOG', 'BALL'],
  it: ['MAMMA', 'PAPÀ', 'NONNA', 'CANE', 'GATTO', 'PALLA'],
}

// Endless play picks from these at random. Chosen by hand, so there's nothing unsuitable for a
// toddler; each has a picture (see pictures.ts) and is short enough to fit the screen.
export const ENDLESS_WORDS: WordLists = {
  en: [
    'MOM', 'DAD', 'BABY', 'NANA', 'CAT', 'DOG', 'FISH', 'BIRD', 'COW', 'PIG', 'DUCK', 'HORSE', 'SHEEP',
    'LION', 'BEAR', 'FROG', 'MOUSE', 'BUNNY', 'MONKEY', 'TIGER', 'OWL', 'BEE', 'TURTLE', 'APPLE', 'BANANA',
    'MILK', 'CAKE', 'EGG', 'PIZZA', 'BREAD', 'CHEESE', 'PEAR', 'GRAPES', 'ORANGE', 'CARROT', 'WATER',
    'BALL', 'CAR', 'BUS', 'TRAIN', 'BOAT', 'PLANE', 'HOUSE', 'BOOK', 'BED', 'HAT', 'SHOE', 'KEY', 'CUP',
    'GIFT', 'TEDDY', 'SUN', 'MOON', 'STAR', 'TREE', 'FLOWER', 'RAIN', 'SNOW',
  ],
  it: [
    'MAMMA', 'PAPÀ', 'NONNA', 'NONNO', 'BIMBO', 'GATTO', 'CANE', 'PESCE', 'MUCCA', 'MAIALE', 'PAPERA',
    'CAVALLO', 'PECORA', 'LEONE', 'ORSO', 'RANA', 'TOPO', 'SCIMMIA', 'TIGRE', 'GUFO', 'APE', 'MELA',
    'LATTE', 'TORTA', 'UOVO', 'PANE', 'PERA', 'UVA', 'ARANCIA', 'CAROTA', 'ACQUA', 'GELATO', 'PASTA',
    'PALLA', 'AUTO', 'TRENO', 'BARCA', 'AEREO', 'CASA', 'LIBRO', 'LETTO', 'CHIAVE', 'TAZZA', 'REGALO',
    'SOLE', 'LUNA', 'STELLA', 'ALBERO', 'FIORE', 'NEVE',
  ],
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
