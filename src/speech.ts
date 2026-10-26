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

// The browser loads its voices in the background: the first getVoices() call often returns
// none, and an utterance without a voice falls back to the default (English) one.
// So keep the list fresh and pick the voice ourselves.
let voices: SpeechSynthesisVoice[] = []
if ('speechSynthesis' in window) {
  const load = () => (voices = speechSynthesis.getVoices())
  load()
  speechSynthesis.addEventListener('voiceschanged', load)
}

function voiceFor(language: Language): SpeechSynthesisVoice | undefined {
  // Some browsers write "it_IT", others "it-IT". Prefer voices on this computer over online ones.
  const matching = voices.filter((v) => v.lang.replace('_', '-').startsWith(language))
  return (
    matching.find((v) => v.lang.replace('_', '-') === VOICE_LANG[language] && v.localService) ??
    matching.find((v) => v.localService) ??
    matching[0]
  )
}

// Reads text aloud with the browser's built-in voice for the language.
// `interrupt` stops whatever is being said; otherwise the text waits its turn.
function say(text: string, language: Language, interrupt: boolean) {
  if (!('speechSynthesis' in window)) return

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = VOICE_LANG[language]
  utterance.rate = 0.8
  const voice = voiceFor(language)
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
