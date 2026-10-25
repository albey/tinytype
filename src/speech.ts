import type { Language } from './words'

const VOICE_LANG: Record<Language, string> = { en: 'en-GB', it: 'it-IT' }

// Reads text aloud with the browser's built-in voice for the language.
export function speak(text: string, language: Language) {
  if (!('speechSynthesis' in window)) return

  // Lowercase so "MOM" is read as a word, not spelled out as an acronym.
  const utterance = new SpeechSynthesisUtterance(text.toLowerCase())
  utterance.lang = VOICE_LANG[language]
  utterance.rate = 0.8
  const voice = speechSynthesis.getVoices().find((v) => v.lang === utterance.lang)
  if (voice) utterance.voice = voice

  speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
}
