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

// Choices with an English or Italian name starting with the search ("pes" finds 🐟 PESCE).
export function searchPictures(query: string) {
  const q = baseText(query)
  if (!q) return PICTURE_CHOICES
  return PICTURE_CHOICES.filter((c) => c.names.some((name) => baseText(name).startsWith(q)))
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
