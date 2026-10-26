import { COLOURS, PALETTE, RAINBOW, stepColour } from '../colours'

type Props = {
  colour: string
  onChange: (colour: string) => void
}

const RAINBOW_SWATCH = `conic-gradient(${[...COLOURS, COLOURS[0]].join(', ')})`

export function ColourPicker({ colour, onChange }: Props) {
  const atTop = colour === PALETTE[0]
  const atBottom = colour === PALETTE[PALETTE.length - 1]

  return (
    <div className="colour-picker">
      {/* Look like the arrow keys, to show that ↑ and ↓ pick the colour. Clicking them works too. */}
      <ArrowKey label="Up" symbol="▲" disabled={atTop} onClick={() => onChange(stepColour(colour, -1))} />
      {PALETTE.map((c) => (
        <button
          key={c}
          className={c === colour ? 'swatch selected' : 'swatch'}
          style={{ background: c === RAINBOW ? RAINBOW_SWATCH : c }}
          aria-label={c === RAINBOW ? 'Rainbow' : `Colour ${c}`}
          // Keep keyboard focus off the button, so typed letters never "press" it.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onChange(c)}
        />
      ))}
      <ArrowKey label="Down" symbol="▼" disabled={atBottom} onClick={() => onChange(stepColour(colour, 1))} />
    </div>
  )
}

function ArrowKey({ label, symbol, disabled, onClick }: { label: string; symbol: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      className="arrow-key"
      aria-label={`${label} arrow: previous or next colour`}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {symbol}
    </button>
  )
}
