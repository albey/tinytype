import { COLOURS } from '../colours'

type Props = {
  colour: string
  onChange: (colour: string) => void
}

export function ColourPicker({ colour, onChange }: Props) {
  return (
    <div className="colour-picker">
      {COLOURS.map((c) => (
        <button
          key={c}
          className={c === colour ? 'swatch selected' : 'swatch'}
          style={{ background: c }}
          aria-label={`Colour ${c}`}
          // Keep keyboard focus off the button, so typed letters never "press" it.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  )
}
