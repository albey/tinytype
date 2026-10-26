import { useState } from 'react'
import { PICTURE_CHOICES, firstEmoji } from '../pictures'

type Props = {
  value: string | undefined // the picture shown on the button
  onPick: (emoji: string) => void // "" means no picture
}

// A button showing the word's picture; opens a grid to choose another, or to paste any emoji.
export function EmojiPicker({ value, onPick }: Props) {
  const [open, setOpen] = useState(false)

  function pick(emoji: string) {
    onPick(emoji)
    setOpen(false)
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
          <button type="button" className="emoji-none" onClick={() => pick('')}>
            No picture
          </button>
          {PICTURE_CHOICES.map((emoji) => (
            <button type="button" key={emoji} className={emoji === value ? 'selected' : ''} onClick={() => pick(emoji)}>
              {emoji}
            </button>
          ))}
          <input
            className="emoji-paste"
            placeholder="…or paste any emoji"
            onChange={(e) => {
              const emoji = firstEmoji(e.target.value)
              if (emoji) pick(emoji)
            }}
          />
        </div>
      )}
    </div>
  )
}
