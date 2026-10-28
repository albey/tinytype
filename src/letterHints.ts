import type { Language } from './words'

// What to say for each letter when recording: the sound, and a word that starts with it.
export const LETTER_HINTS: Record<Language, Record<string, string>> = {
  en: {
    A: 'a, as in apple or ant', B: 'b, as in ball', C: 'k, as in cat', D: 'd, as in dog', E: 'e, as in egg',
    F: 'fff, as in fish', G: 'g, as in goat', H: 'h, as in hat', I: 'i, as in igloo', J: 'j, as in jam',
    K: 'k, as in kite', L: 'lll, as in lion', M: 'mmm, as in mum', N: 'nnn, as in nose', O: 'o, as in octopus',
    P: 'p, as in pig', Q: 'kw, as in queen', R: 'rrr, as in rabbit', S: 'sss, as in sun', T: 't, as in tap',
    U: 'u, as in umbrella', V: 'vvv, as in van', W: 'w, as in web', X: 'ks, as in fox', Y: 'y, as in yo-yo',
    Z: 'zzz, as in zebra',
  },
  it: {
    A: 'a, come ape', B: 'b, come barca', C: 'k, come cane', D: 'd, come dado', E: 'e, come elefante',
    F: 'fff, come fiore', G: 'g, come gatto', H: 'muta: "acca", oppure salta', I: 'i, come isola',
    J: 'i, come jogurt', K: 'k, come koala', L: 'lll, come luna', M: 'mmm, come mamma', N: 'nnn, come nonna',
    O: 'o, come orso', P: 'p, come palla', Q: 'ku, come quadro', R: 'rrr, come rana', S: 'sss, come sole',
    T: 't, come topo', U: 'u, come uva', V: 'vvv, come vaso', W: 'u, come web', X: 'ks, come xilofono',
    Y: 'i, come yogurt', Z: 'zzz, come zebra',
  },
}
