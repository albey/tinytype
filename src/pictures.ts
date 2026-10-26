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

// What the emoji picker offers: every built-in picture, plus a few extras.
export const PICTURE_CHOICES = [
  ...new Set([...Object.values(PICTURES), '❤️', '🌈', '🎨', '🚀', '🦄', '🦖', '🐞', '🦋', '🍓', '🍪', '⚽', '🎵', '🚲', '🛁', '🧦', '🪥']),
]

// The first emoji in some text, e.g. what was pasted into the picker. Undefined if there's none.
export function firstEmoji(text: string): string | undefined {
  for (const { segment } of new Intl.Segmenter().segment(text)) {
    if (/\p{Extended_Pictographic}/u.test(segment)) return segment
  }
  return undefined
}
