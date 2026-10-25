let audio: AudioContext | null = null

// A short, low "bonk" for a wrong letter. Generated on the fly, so no sound files needed.
export function playOops() {
  audio ??= new AudioContext()
  const now = audio.currentTime
  const tone = audio.createOscillator()
  const volume = audio.createGain()

  tone.type = 'triangle'
  tone.frequency.setValueAtTime(300, now)
  tone.frequency.exponentialRampToValueAtTime(120, now + 0.3)
  volume.gain.setValueAtTime(0.3, now)
  volume.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

  tone.connect(volume).connect(audio.destination)
  tone.start(now)
  tone.stop(now + 0.35)
}
