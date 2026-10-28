// A picture (emoji) for common toddler words, English and Italian. Words not listed get no picture.
const PICTURES: Record<string, string> = {
  // Family
  MOM: '👩', MUM: '👩', MUMMY: '👩', MOMMY: '👩', DAD: '👨', DADDY: '👨', BABY: '👶',
  GRANDMA: '👵', NANA: '👵', GRANDPA: '👴', GRANNY: '👵',
  MAMMA: '👩', PAPÀ: '👨', PAPA: '👨', NONNA: '👵', NONNO: '👴', BIMBO: '👶', BIMBA: '👶',

  // Animals
  CAT: '🐱', DOG: '🐶', FISH: '🐟', BIRD: '🐦', COW: '🐮', PIG: '🐷', DUCK: '🦆', HORSE: '🐴',
  SHEEP: '🐑', LION: '🦁', BEAR: '🐻', FROG: '🐸', MOUSE: '🐭', RABBIT: '🐰', BUNNY: '🐰',
  MONKEY: '🐵', ELEPHANT: '🐘', TIGER: '🐯', OWL: '🦉', BEE: '🐝', SNAKE: '🐍', TURTLE: '🐢',
  GATTO: '🐱', CANE: '🐶', PESCE: '🐟', UCCELLO: '🐦', MUCCA: '🐮', MAIALE: '🐷', PAPERA: '🦆',
  CAVALLO: '🐴', PECORA: '🐑', LEONE: '🦁', ORSO: '🐻', RANA: '🐸', TOPO: '🐭', CONIGLIO: '🐰',
  SCIMMIA: '🐵', ELEFANTE: '🐘', TIGRE: '🐯', GUFO: '🦉', APE: '🐝', SERPENTE: '🐍', TARTARUGA: '🐢',

  // Food
  APPLE: '🍎', BANANA: '🍌', MILK: '🥛', CAKE: '🎂', EGG: '🥚', PIZZA: '🍕', BREAD: '🍞',
  CHEESE: '🧀', PEAR: '🍐', GRAPES: '🍇', ORANGE: '🍊', CARROT: '🥕', WATER: '💧',
  MELA: '🍎', LATTE: '🥛', TORTA: '🎂', UOVO: '🥚', PANE: '🍞', FORMAGGIO: '🧀', PERA: '🍐',
  UVA: '🍇', ARANCIA: '🍊', CAROTA: '🥕', ACQUA: '💧', GELATO: '🍦', PASTA: '🍝',

  // Things
  BALL: '⚽', CAR: '🚗', BUS: '🚌', TRAIN: '🚂', BOAT: '⛵', PLANE: '✈️', HOUSE: '🏠', BOOK: '📖',
  BED: '🛏️', HAT: '🎩', SHOE: '👟', KEY: '🔑', CUP: '☕', BALLOON: '🎈', GIFT: '🎁', TEDDY: '🧸',
  PALLA: '⚽', MACCHINA: '🚗', AUTO: '🚗', TRENO: '🚂', BARCA: '⛵', AEREO: '✈️', CASA: '🏠',
  LIBRO: '📖', LETTO: '🛏️', CAPPELLO: '🎩', SCARPA: '👟', CHIAVE: '🔑', TAZZA: '☕',
  PALLONCINO: '🎈', REGALO: '🎁', ORSACCHIOTTO: '🧸',

  // Nature
  SUN: '☀️', MOON: '🌙', STAR: '⭐', TREE: '🌳', FLOWER: '🌸', RAIN: '🌧️', SNOW: '❄️',
  SOLE: '☀️', LUNA: '🌙', STELLA: '⭐', ALBERO: '🌳', FIORE: '🌸', PIOGGIA: '🌧️', NEVE: '❄️',
}

// Pictures parents chose for their own words. "" means "no picture" (even if there's a built-in one).
export type CustomPictures = Record<string, string>

export function pictureFor(word: string, custom: CustomPictures = {}): string | undefined {
  if (word in custom) return custom[word] || undefined
  return PICTURES[word]
}

// Extra pictures for the picker, with English and Italian names so they can be searched.
const EXTRAS: Record<string, string> = {
  HEART: '❤️', CUORE: '❤️', LOVE: '❤️', AMORE: '❤️',
  RAINBOW: '🌈', ARCOBALENO: '🌈',
  PAINT: '🎨', COLORI: '🎨', ROCKET: '🚀', RAZZO: '🚀',
  UNICORN: '🦄', UNICORNO: '🦄', DINOSAUR: '🦖', DINO: '🦖', DINOSAURO: '🦖',
  LADYBUG: '🐞', LADYBIRD: '🐞', COCCINELLA: '🐞', BUTTERFLY: '🦋', FARFALLA: '🦋',
  STRAWBERRY: '🍓', FRAGOLA: '🍓', COOKIE: '🍪', BISCUIT: '🍪', BISCOTTO: '🍪',
  MUSIC: '🎵', MUSICA: '🎵', BIKE: '🚲', BICICLETTA: '🚲', BATH: '🛁', BAGNO: '🛁',
  SOCK: '🧦', CALZINO: '🧦', TOOTHBRUSH: '🪥', SPAZZOLINO: '🪥',
  CHICKEN: '🐔', GALLINA: '🐔', PENGUIN: '🐧', PINGUINO: '🐧', GIRAFFE: '🦒', GIRAFFA: '🦒',
  WHALE: '🐳', BALENA: '🐳', OCTOPUS: '🐙', POLPO: '🐙', SHARK: '🦈', SQUALO: '🦈',
  SNAIL: '🐌', LUMACA: '🐌', SPIDER: '🕷️', RAGNO: '🕷️', DRAGON: '🐉', DRAGO: '🐉',
  TRACTOR: '🚜', TRATTORE: '🚜', FIRE: '🚒', POMPIERI: '🚒', POLICE: '🚓', POLIZIA: '🚓',
  HELICOPTER: '🚁', ELICOTTERO: '🚁', ROBOT: '🤖', GHOST: '👻', FANTASMA: '👻',
  DRUM: '🥁', TAMBURO: '🥁', GUITAR: '🎸', CHITARRA: '🎸', CROWN: '👑', CORONA: '👑',
  SPOON: '🥄', CUCCHIAIO: '🥄', PHONE: '📱', TELEFONO: '📱', CLOCK: '⏰', OROLOGIO: '⏰',
  SEA: '🌊', MARE: '🌊', MOUNTAIN: '⛰️', MONTAGNA: '⛰️', CLOUD: '☁️', NUVOLA: '☁️',
  LEAF: '🍃', FOGLIA: '🍃', TOMATO: '🍅', POMODORO: '🍅', CHERRY: '🍒', CILIEGIA: '🍒',
  WATERMELON: '🍉', ANGURIA: '🍉', CHOCOLATE: '🍫', CIOCCOLATO: '🍫', CANDY: '🍬', CARAMELLA: '🍬',
}

// Everything the picker offers, each with the words it can be found by.
export const PICTURE_CHOICES: { emoji: string; names: string[] }[] = (() => {
  const byEmoji = new Map<string, string[]>()
  for (const [name, emoji] of Object.entries({ ...PICTURES, ...EXTRAS })) {
    byEmoji.set(emoji, [...(byEmoji.get(emoji) ?? []), name])
  }
  return [...byEmoji].map(([emoji, names]) => ({ emoji, names }))
})()

// The full emoji list (about 1,400, see scripts/build-emoji-catalogue.mjs): [emoji, search words].
// Loaded only when the picker opens, so the game itself stays small.
let catalogue: [string, string][] = []

export async function loadEmojiCatalogue(): Promise<void> {
  if (catalogue.length === 0) catalogue = (await import('./emojiCatalogue.json')).default as [string, string][]
}

const MAX_RESULTS = 120

// The hand-picked choices first, then the rest of the emoji. Every word of the search must start
// one of an emoji's English or Italian names ("pes" finds 🐟 PESCE, "fire tr" finds 🚒).
export function searchPictures(query: string) {
  const q = baseText(query).split(/\s+/).filter(Boolean)
  if (q.length === 0) return PICTURE_CHOICES
  const matches = (names: string[]) => q.every((part) => names.some((name) => name.startsWith(part)))
  const results = PICTURE_CHOICES.filter((c) => matches(c.names.map(baseText)))
  const seen = new Set(results.map((c) => plain(c.emoji)))
  for (const [emoji, words] of catalogue) {
    if (results.length >= MAX_RESULTS) break
    const names = words.split(' ')
    if (!seen.has(plain(emoji)) && matches(names)) {
      results.push({ emoji, names })
      seen.add(plain(emoji))
    }
  }
  return results
}

// The same emoji is sometimes written with or without the "show as picture" marker (U+FE0F).
function plain(emoji: string): string {
  return emoji.replace(/\uFE0F/g, '')
}

// Uppercase without accents, so "papa" finds PAPÀ.
function baseText(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim()
}

// The first emoji in some text, e.g. what was pasted into the picker. Undefined if there's none.
export function firstEmoji(text: string): string | undefined {
  for (const { segment } of new Intl.Segmenter().segment(text)) {
    if (/\p{Extended_Pictographic}/u.test(segment)) return segment
  }
  return undefined
}
