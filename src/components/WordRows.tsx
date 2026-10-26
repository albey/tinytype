import type { CSSProperties } from 'react'
import { RAINBOW, paint } from '../colours'

export type TypedLetter = { char: string; colour: string; correct: boolean }
export type WrongLetter = { char: string; id: number }

type Props = {
  word: string
  typed: TypedLetter[]
  wrong: WrongLetter | null
  colour: string
  done: boolean
  hints: boolean // show the letter to type, in light grey, in each empty slot
  boxes: boolean // draw a box round each letter and its slot
}

// One column per letter: the letter to copy on top, its slot underneath.
export function WordRows({ word, typed, wrong, colour, done, hints, boxes }: Props) {
  const letters = [...word]
  const style = {
    '--letters': letters.length,
    '--paint': paint(colour),
    '--paint-across': paint(colour, 90),
  } as CSSProperties
  const className = ['rows', done && 'done', boxes && 'boxes'].filter(Boolean).join(' ')

  return (
    <div className={className} style={style}>
      {letters.map((target, i) => {
        const letter = typed[i]
        const isCurrent = i === typed.length
        return (
          <div key={i} className="column">
            <div className="slot prompt">{target}</div>
            <div className={isCurrent ? 'slot answer current' : 'slot answer'}>
              {letter && (
                <span
                  className={['typed', !letter.correct && 'mistake', letter.colour === RAINBOW && 'rainbow']
                    .filter(Boolean)
                    .join(' ')}
                  style={{
                    color: letter.colour === RAINBOW ? undefined : letter.colour,
                    animationDelay: done ? `${i * 0.08}s` : undefined,
                  }}
                >
                  {letter.char}
                </span>
              )}
              {!letter && hints && !isCurrent && <span className="hint-letter">{target}</span>}
              {isCurrent && wrong && (
                // A new key each time restarts the wobble animation.
                <span key={wrong.id} className="wrong">
                  {wrong.char}
                </span>
              )}
              {/* The cursor: the letter to type, faint and gently blinking. */}
              {isCurrent && !wrong && <span className="cursor-letter">{target}</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
