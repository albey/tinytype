import { useEffect, useState, type KeyboardEvent } from 'react'
import { firstEmoji, loadEmojiCatalogue, searchPictures } from '../pictures'

type Props = {
  value: string | undefined // the picture shown on the button
  onPick: (emoji: string) => void // "" means no picture
}

// Web pages can't open the device's emoji picker, so say how to.
const DEVICE_EMOJI_TIP = matchMedia('(pointer: coarse)').matches
  ? 'tap the search box, then the 😀 key on the keyboard.'
  : /Mac/.test(navigator.userAgent)
    ? 'click the search box, then press Ctrl + ⌘ + Space.'
    : /Windows/.test(navigator.userAgent)
      ? 'click the search box, then press Windows key + full stop.'
      : "paste one into the search box."

// A button showing the word's picture; opens a searchable grid to choose another, or to paste any emoji.
export function EmojiPicker({ value, onPick }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [, setLoaded] = useState(false) // redraws once the full emoji list has arrived
  const results = searchPictures(query)

  useEffect(() => {
    if (open) loadEmojiCatalogue().then(() => setLoaded(true))
  }, [open])

  function pick(emoji: string) {
    onPick(emoji)
    setOpen(false)
    setQuery('')
  }

  function onSearchKey(e: KeyboardEvent<HTMLInputElement>) {
    // Enter picks the first match instead of adding the word; Escape just closes the grid.
    if (e.key === 'Enter') {
      e.preventDefault()
      if (results.length > 0) pick(results[0].emoji)
    } else if (e.key === 'Escape') {
      e.stopPropagation()
      setOpen(false)
    }
  }

  return (
    <div className="emoji-picker">
      <button
        type="button"
        className={value ? 'emoji-button' : 'emoji-button empty'}
        aria-label="Choose a picture"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {value ?? '🖼️'}
      </button>

      {open && (
        <div className="emoji-grid">
          <input
            className="emoji-search"
            placeholder="Search (fish, pesce…) or paste an emoji"
            value={query}
            autoFocus
            onKeyDown={onSearchKey}
            onChange={(e) => {
              const pasted = firstEmoji(e.target.value)
              if (pasted) pick(pasted)
              else setQuery(e.target.value)
            }}
          />
          {!query && (
            <button type="button" className="emoji-none" onClick={() => pick('')}>
              No picture
            </button>
          )}
          {results.map(({ emoji, names }) => (
            <button
              type="button"
              key={emoji}
              className={emoji === value ? 'selected' : ''}
              title={names.slice(0, 6).join(', ').toLowerCase()}
              onClick={() => pick(emoji)}
            >
              {emoji}
            </button>
          ))}
          {results.length === 0 && <p className="emoji-empty">No match. Try another word, or use your device's emoji (below).</p>}
          <p className="emoji-device">Any emoji works: {DEVICE_EMOJI_TIP}</p>
        </div>
      )}
    </div>
  )
}
