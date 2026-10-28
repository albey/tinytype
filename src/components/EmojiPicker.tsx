import { useState, type KeyboardEvent } from 'react'
import { firstEmoji, searchPictures } from '../pictures'

type Props = {
  value: string | undefined // the picture shown on the button
  onPick: (emoji: string) => void // "" means no picture
}

// A button showing the word's picture; opens a searchable grid to choose another, or to paste any emoji.
export function EmojiPicker({ value, onPick }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const results = searchPictures(query)

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
              title={names.join(', ').toLowerCase()}
              onClick={() => pick(emoji)}
            >
              {emoji}
            </button>
          ))}
          {results.length === 0 && <p className="emoji-empty">No match. Paste any emoji above.</p>}
        </div>
      )}
    </div>
  )
}
