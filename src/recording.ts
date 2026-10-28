// Turns a raw microphone recording into a tidy clip: trimmed, evened out, small, and saved as WAV
// (plays everywhere, including Safari on the iPad).

const RATE = 22050 // plenty for a voice, and keeps the files small
const PEAK = 0.85 // loudest point of every clip, out of 1.0
const MARGIN_SECONDS = 0.06 // breathing room kept before and after the sound

export async function tidyRecording(recording: Blob): Promise<Blob> {
  // Decode and resample to mono at RATE in one go.
  const decoded = await new AudioContext().decodeAudioData(await recording.arrayBuffer())
  const offline = new OfflineAudioContext(1, Math.ceil(decoded.duration * RATE), RATE)
  const source = offline.createBufferSource()
  source.buffer = decoded
  source.connect(offline.destination)
  source.start()
  const samples = (await offline.startRendering()).getChannelData(0)

  // Trim the silence: keep from the first to the last moment louder than 6% of the peak.
  const peak = samples.reduce((max, s) => Math.max(max, Math.abs(s)), 0)
  if (peak < 0.01) throw new Error('That was silent. Is the microphone on?')
  const loud = (s: number) => Math.abs(s) > peak * 0.06
  const margin = Math.round(MARGIN_SECONDS * RATE)
  const start = Math.max(0, samples.findIndex(loud) - margin)
  const end = Math.min(samples.length, samples.findLastIndex(loud) + margin)

  // Even out the volume, and fade the edges so there's no click.
  const clip = samples.slice(start, end).map((s) => (s / peak) * PEAK)
  const fade = Math.min(margin, Math.floor(clip.length / 4))
  for (let i = 0; i < fade; i++) {
    clip[i] *= i / fade
    clip[clip.length - 1 - i] *= i / fade
  }
  return toWav(clip)
}

// 16-bit mono WAV: a 44-byte header followed by the samples.
function toWav(samples: Float32Array): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)
  const text = (at: number, s: string) => [...s].forEach((c, i) => view.setUint8(at + i, c.charCodeAt(0)))
  text(0, 'RIFF')
  view.setUint32(4, 36 + samples.length * 2, true)
  text(8, 'WAVE')
  text(12, 'fmt ')
  view.setUint32(16, 16, true) // format chunk size
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, RATE, true)
  view.setUint32(28, RATE * 2, true) // bytes per second
  view.setUint16(32, 2, true) // bytes per sample
  view.setUint16(34, 16, true) // bits per sample
  text(36, 'data')
  view.setUint32(40, samples.length * 2, true)
  samples.forEach((s, i) => view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, s)) * 0x7fff, true))
  return new Blob([buffer], { type: 'audio/wav' })
}
