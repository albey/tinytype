import { useState, type CSSProperties } from 'react'
import { COLOURS } from '../colours'

const PIECES = 320

function makePieces() {
  return Array.from({ length: PIECES }, () => {
    const size = 8 + Math.random() * 12
    const round = Math.random() < 0.3
    return {
      left: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${round ? size : size * 0.45}px`,
      borderRadius: round ? '50%' : '2px',
      background: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      animationDelay: `${Math.random() * 0.7}s`,
      animationDuration: `${1.6 + Math.random() * 0.8}s`,
      '--drift': `${(Math.random() - 0.5) * 30}vw`,
      '--spin': `${360 + Math.random() * 720}deg`,
    } as CSSProperties
  })
}

// Pieces of paper falling over the whole screen. Shown while a finished word is celebrated.
export function Confetti() {
  // Picked once, so the pieces don't jump around if the page re-draws.
  const [pieces] = useState(makePieces)
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((style, i) => (
        <span key={i} style={style} />
      ))}
    </div>
  )
}
