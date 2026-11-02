// Stats: what the player presses and how long each letter or number takes. Kept in this browser
// only. Nothing shows them yet; a stats screen and a practice mode will read them later.
// One set for both languages: the child is learning letter shapes and keys, not sounds.

const KEY = 'tinytype.stats'
const KEEP_TIMES = 20 // recent times kept per item, for a typical (median) time

// Longer than this, the player probably walked off: the answer counts, but isn't timed.
// Counting gets longer, since it includes counting up to 9 things.
const MAX_TIME_MS: Record<Group, number> = { letters: 30_000, numbers: 60_000, things: 60_000 }

export type Entry = {
  correct: number
  wrong: number
  helped: number // correct answers that came after a spoken hint (Space, or counting aloud)
  times: number[] // ms, most recent last; only answers without help and not too slow
  mixups: Record<string, number> // the key pressed instead → how often
}

export type Stats = {
  letters: Record<string, Entry> // A–Z, accents folded in (À counts as A)
  numbers: Record<string, Entry> // 1–9, from counting
  things: Record<string, Entry> // the counting pictures
}

export type Group = keyof Stats

function load(): Stats {
  const empty: Stats = { letters: {}, numbers: {}, things: {} }
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? { ...empty, ...JSON.parse(saved) } : empty
  } catch {
    return empty
  }
}

let stats = load()

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats))
  } catch {
    // Storage can be blocked (private window); the stats just aren't kept.
  }
}

function entry(group: Group, item: string): Entry {
  return (stats[group][item] ??= { correct: 0, wrong: 0, helped: 0, times: [], mixups: {} })
}

// `ms` is null when the answer shouldn't be timed (the first letter of a word includes reading it).
export function recordCorrect(group: Group, item: string, ms: number | null, helped: boolean) {
  const e = entry(group, item)
  e.correct++
  if (helped) e.helped++
  else if (ms !== null && ms <= MAX_TIME_MS[group]) e.times = [...e.times, Math.round(ms)].slice(-KEEP_TIMES)
  save()
}

export function recordWrong(group: Group, item: string, pressed: string) {
  const e = entry(group, item)
  e.wrong++
  e.mixups[pressed] = (e.mixups[pressed] ?? 0) + 1
  save()
}

export function getStats(): Stats {
  return stats
}

export function resetStats() {
  stats = { letters: {}, numbers: {}, things: {} }
  save()
}

// Below this many timed answers, a typical time doesn't mean much yet.
export const MIN_TIMED = 5

// The typical time: the middle one, so a single long pause doesn't skew it.
export function median(times: number[]): number | null {
  if (times.length === 0) return null
  const sorted = [...times].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

// Time on the current letter or number, leaving out time with the tab hidden or the app in the background.
let startedAt = Date.now()
let hiddenAt: number | null = null

document.addEventListener('visibilitychange', () => {
  if (document.hidden) hiddenAt = Date.now()
  else if (hiddenAt !== null) {
    startedAt += Date.now() - hiddenAt
    hiddenAt = null
  }
})

export function startTimer() {
  startedAt = Date.now()
  hiddenAt = document.hidden ? startedAt : null
}

export function elapsed(): number {
  return (hiddenAt ?? Date.now()) - startedAt
}
