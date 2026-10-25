import { baseLetter, type Language } from './words'

const VOICE_LANG: Record<Language, string> = { en: 'en-GB', it: 'it-IT' }

// Phonics: the sound each letter makes ("mmm", "buh"), not its name ("em", "emme").
// Written so the built-in voice pronounces them; voices can't take a sound directly.
const LETTER_SOUNDS: Record<Language, Record<string, string>> = {
  en: {
    A: 'ah', B: 'buh', C: 'kuh', D: 'duh', E: 'eh', F: 'fff', G: 'guh', H: 'huh', I: 'ih',
    J: 'juh', K: 'kuh', L: 'lll', M: 'mmm', N: 'nnn', O: 'oh', P: 'puh', Q: 'kwuh', R: 'rrr',
    S: 'sss', T: 'tuh', U: 'uh', V: 'vvv', W: 'wuh', X: 'ks', Y: 'yuh', Z: 'zzz',
  },
  it: {
    A: 'a', B: 'bh', C: 'ch', D: 'dh', E: 'e', F: 'fff', G: 'gh', H: 'a', I: 'i',
    J: 'i', K: 'ch', L: 'lll', M: 'mmm', N: 'nnn', O: 'o', P: 'ph', Q: 'cu', R: 'rrr',
    S: 'sss', T: 'th', U: 'u', V: 'vvv', W: 'u', X: 'cs', Y: 'i', Z: 'zzz',
  },
}

// Reads text aloud with the browser's built-in voice for the language.
// `interrupt` stops whatever is being said; otherwise the text waits its turn.
function say(text: string, language: Language, interrupt: boolean) {
  if (!('speechSynthesis' in window)) return

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = VOICE_LANG[language]
  utterance.rate = 0.8
  const voice = speechSynthesis.getVoices().find((v) => v.lang === utterance.lang)
  if (voice) utterance.voice = voice

  if (interrupt) speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
}

export function speakWord(word: string, language: Language, { interrupt = true } = {}) {
  // Lowercase so "MOM" is read as a word, not spelled out as an acronym.
  say(word.toLowerCase(), language, interrupt)
}

export function speakLetter(letter: string, language: Language) {
  const base = baseLetter(letter)
  say(LETTER_SOUNDS[language][base] ?? base.toLowerCase(), language, true)
}
