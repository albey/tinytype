export const COLOURS = ['#e53935', '#fb8c00', '#f9a825', '#43a047', '#1e88e5', '#8e24aa', '#ec407a']

// A choice in the picker alongside the colours: each letter gets all of them.
export const RAINBOW = 'rainbow'

// Everything in the picker, top to bottom.
export const PALETTE = [...COLOURS, RAINBOW]

// The colour one step up (-1) or down (+1) the picker; stays put at the top and bottom.
export function stepColour(colour: string, step: number): string {
  const i = Math.max(0, PALETTE.indexOf(colour))
  return PALETTE[Math.min(PALETTE.length - 1, Math.max(0, i + step))]
}

// What to paint the cursor and underline with: a colour, or a rainbow running at `angle`
// (180deg = top to bottom, 90deg = left to right).
export function paint(colour: string, angle = 180): string {
  return colour === RAINBOW ? `linear-gradient(${angle}deg, ${COLOURS.join(', ')})` : colour
}
