import type { CSSProperties } from 'react'

export type TypedLetter = { char: string; colour: string; correct: boolean }
export type WrongLetter = { char: string; id: number }

type Props = {
  word: string
  typed: TypedLetter[]
  wrong: WrongLetter | null
  colour: string
  done: boolean
}

// The two rows: the word to copy on top, and one slot per letter underneath.
export function WordRows({ word, typed, wrong, colour, done }: Props) {
  const letters = [...word]
  const style = { '--letters': letters.length, '--colour': colour } as CSSProperties

  return (
    <div className={done ? 'rows done' : 'rows'} style={style}>
      {letters.map((letter, i) => (
        <div key={`prompt-${i}`} className="slot prompt">
          {letter}
        </div>
      ))}

      {letters.map((_, i) => {
        const letter = typed[i]
        const isCurrent = i === typed.length
        return (
          <div key={`answer-${i}`} className={isCurrent ? 'slot answer current' : 'slot answer'}>
            {letter && (
              <span
                className={letter.correct ? 'typed' : 'typed mistake'}
                style={{ color: letter.colour, animationDelay: done ? `${i * 0.08}s` : undefined }}
              >
                {letter.char}
              </span>
            )}
            {isCurrent && wrong && (
              // A new key each time restarts the wobble animation.
              <span key={wrong.id} className="wrong">
                {wrong.char}
              </span>
            )}
            {isCurrent && !wrong && <span className="cursor" />}
          </div>
        )
      })}
    </div>
  )
}
