export type Language = 'en' | 'it'
export type Order = 'inOrder' | 'random' | 'endless' | 'alphabet'
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

// Alphabet mode: one word per letter, A to Z, each starting with its letter. The Italian alphabet
// has 21 letters (no J, K, W, X, Y). Each letter has a few toddler words with a picture to choose
// from; one is picked at random to start with, and parents can choose another or type their own.
export const ALPHABET: Record<Language, string[]> = {
  en: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
  it: [...'ABCDEFGHILMNOPQRSTUVZ'],
}

export const ALPHABET_CHOICES: Record<Language, Record<string, string[]>> = {
  en: {
    A: ['APPLE', 'ANT', 'AIRPLANE', 'ALLIGATOR'],
    B: ['BANANA', 'BALL', 'BEAR', 'BEE', 'BUS', 'BOOK', 'BALLOON', 'BIRD'],
    C: ['CAT', 'CAR', 'CAKE', 'COW', 'CUP', 'CARROT', 'COOKIE'],
    D: ['DOG', 'DUCK', 'DAD', 'DRUM', 'DINOSAUR', 'DRAGON'],
    E: ['EGG', 'ELEPHANT', 'EAR', 'EAGLE'],
    F: ['FISH', 'FROG', 'FLOWER', 'FOX', 'FORK'],
    G: ['GRAPES', 'GIFT', 'GIRAFFE', 'GUITAR', 'GHOST'],
    H: ['HAT', 'HORSE', 'HOUSE', 'HEART'],
    I: ['ICE', 'IGUANA', 'ISLAND'],
    J: ['JUICE', 'JACKET', 'JEANS'],
    K: ['KEY', 'KITE', 'KANGAROO', 'KOALA', 'KING'],
    L: ['LION', 'LEAF', 'LEMON', 'LADYBUG'],
    M: ['MOM', 'MOON', 'MILK', 'MOUSE', 'MONKEY'],
    N: ['NOSE', 'NUT', 'NOODLES'],
    O: ['OWL', 'ORANGE', 'OCTOPUS', 'OTTER'],
    P: ['PIG', 'PIZZA', 'PEAR', 'PLANE', 'PENGUIN'],
    Q: ['QUEEN'],
    R: ['RABBIT', 'RAIN', 'RAINBOW', 'ROBOT', 'ROCKET'],
    S: ['SUN', 'STAR', 'SHOE', 'SHEEP', 'SNAKE', 'SOCK', 'SNAIL'],
    T: ['TREE', 'TRAIN', 'TIGER', 'TEDDY', 'TURTLE', 'TOMATO'],
    U: ['UMBRELLA', 'UNICORN'],
    V: ['VAN', 'VIOLIN', 'VOLCANO'],
    W: ['WATER', 'WHALE', 'WATERMELON', 'WORM'],
    X: ['XYLOPHONE'],
    Y: ['YOYO', 'YAK', 'YARN'],
    Z: ['ZEBRA'],
  },
  it: {
    A: ['APE', 'ALBERO', 'ACQUA', 'AEREO', 'ARANCIA', 'ANATRA'],
    B: ['BANANA', 'BARCA', 'BIMBO', 'BALENA', 'BICICLETTA'],
    C: ['CANE', 'CASA', 'CAVALLO', 'CAROTA', 'CHIAVE', 'CUORE'],
    D: ['DRAGO', 'DINOSAURO', 'DADO', 'DENTE'],
    E: ['ELEFANTE', 'ELICOTTERO'],
    F: ['FIORE', 'FRAGOLA', 'FARFALLA', 'FORMAGGIO', 'FOGLIA'],
    G: ['GATTO', 'GELATO', 'GUFO', 'GIRAFFA', 'GALLINA'],
    H: ['HAMBURGER', 'HOCKEY'],
    I: ['ISOLA', 'IGUANA', 'INSALATA'],
    L: ['LUNA', 'LEONE', 'LIBRO', 'LATTE', 'LUMACA', 'LIMONE'],
    M: ['MAMMA', 'MELA', 'MUCCA', 'MARE', 'MACCHINA'],
    N: ['NONNA', 'NONNO', 'NEVE', 'NUVOLA', 'NASO'],
    O: ['ORSO', 'OROLOGIO', 'OCCHIALI'],
    P: ['PALLA', 'PANE', 'PESCE', 'PIZZA', 'PERA', 'PINGUINO'],
    Q: ['QUADERNO', 'QUADRO'],
    R: ['RANA', 'RAGNO', 'RAZZO', 'REGALO', 'ROBOT'],
    S: ['SOLE', 'STELLA', 'SCIMMIA', 'SCARPA', 'SQUALO'],
    T: ['TOPO', 'TRENO', 'TORTA', 'TIGRE', 'TAZZA', 'TAMBURO'],
    U: ['UVA', 'UOVO', 'UNICORNO', 'UCCELLO'],
    V: ['VOLPE', 'VIOLINO', 'VULCANO'],
    Z: ['ZEBRA', 'ZUCCA', 'ZAINO'],
  },
}

// The word chosen for each letter, per language.
export type AlphabetWords = Record<Language, Record<string, string>>

// A random word for each letter, from the choices above.
export function randomAlphabet(language: Language): Record<string, string> {
  const choices = ALPHABET_CHOICES[language]
  return Object.fromEntries(ALPHABET[language].map((l) => [l, choices[l][Math.floor(Math.random() * choices[l].length)]]))
}

// The alphabet words in order, A first. A letter with no saved word gets its first choice.
export function alphabetList(language: Language, chosen: Partial<AlphabetWords>): string[] {
  return ALPHABET[language].map((l) => chosen[language]?.[l] ?? ALPHABET_CHOICES[language][l][0])
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

export function isDigit(key: string): boolean {
  return /^[0-9]$/.test(key)
}

// Turns whatever a parent typed into a word the game can use: capitals, letters only.
export function cleanWord(text: string): string {
  return text.toUpperCase().replace(/[^\p{L}]/gu, '').slice(0, 12)
}

export function nextIndex(current: number, count: number, order: Order): number {
  if (order === 'inOrder' || order === 'alphabet' || count < 2) return (current + 1) % count
  // Random, but never the same word twice in a row.
  const pick = Math.floor(Math.random() * (count - 1))
  return pick >= current ? pick + 1 : pick
}
