let audio: AudioContext | null = null

// Plays one tone that slides from `from` to `to` Hz. Generated on the fly, so no sound files needed.
function tone(type: OscillatorType, from: number, to: number, start: number, length: number, loudness: number) {
  audio ??= new AudioContext()
  const at = audio.currentTime + start
  const osc = audio.createOscillator()
  const volume = audio.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(from, at)
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + length * 0.85)
  volume.gain.setValueAtTime(loudness, at)
  volume.gain.exponentialRampToValueAtTime(0.001, at + length)

  osc.connect(volume).connect(audio.destination)
  osc.start(at)
  osc.stop(at + length)
}

// A short, low "bonk" for a wrong letter.
export function playOops() {
  tone('triangle', 300, 120, 0, 0.35, 0.3)
}

const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, C6 = 1046.5, E6 = 1318.5, G6 = 1568

// A little fanfare for a finished word, about 2 seconds: a bouncy run up,
// a big held chord, and twinkles falling over the top of it.
export function playWin() {
  const run: [number, number][] = [
    [C5, 0], [E5, 0.12], [G5, 0.24], [C6, 0.36], // up
    [A5, 0.56], [C6, 0.68], // da-DA
  ]
  run.forEach(([note, at]) => tone('triangle', note, note, at, 0.22, 0.22))

  // The held chord, C major, with a soft second layer for warmth.
  for (const note of [C5, E5, G5, C6]) {
    tone('triangle', note, note, 0.84, 1.2, 0.12)
    tone('sine', note * 2, note * 2, 0.84, 1.0, 0.03)
  }

  // Twinkles: high notes stepping down over the chord.
  const twinkles = [G6, E6, C6 * 2, G6, E6, D5 * 2]
  twinkles.forEach((note, i) => tone('sine', note, note, 0.95 + i * 0.14, 0.18, 0.06))
}
