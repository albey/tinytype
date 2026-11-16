import { useEffect, useState, type KeyboardEvent } from 'react'
import { firstEmoji, loadEmojiCatalogue, searchPictures } from '../pictures'
import { useText, type Text } from '../text'

type Props = {
  value: string | undefined // the picture shown on the button
  onPick: (emoji: string) => void // "" means no picture
  allowNone?: boolean // offer "No picture" (default yes)
  label?: string // shown on the button instead of the picture, e.g. "＋"
  title?: string
}

// Web pages can't open the device's emoji picker, so say how to.
function deviceEmojiTip(t: Text): string {
  if (matchMedia('(pointer: coarse)').matches) return t.emojiTipTouch
  if (/Mac/.test(navigator.userAgent)) return t.emojiTipMac
  if (/Windows/.test(navigator.userAgent)) return t.emojiTipWindows
  return t.emojiTipOther
}

// A button showing the word's picture; opens a searchable grid to choose another, or to paste any emoji.
export function EmojiPicker({ value, onPick, allowNone = true, label, title }: Props) {
  const t = useText()
  const buttonTitle = title ?? t.choosePicture
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
        className={value || label ? 'emoji-button' : 'emoji-button empty'}
        aria-label={buttonTitle}
        title={buttonTitle}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {label ?? value ?? '🖼️'}
      </button>

      {open && (
        <div className="emoji-grid">
          <input
            className="emoji-search"
            placeholder={t.searchPictures}
            value={query}
            autoFocus
            onKeyDown={onSearchKey}
            onChange={(e) => {
              const pasted = firstEmoji(e.target.value)
              if (pasted) pick(pasted)
              else setQuery(e.target.value)
            }}
          />
          {!query && allowNone && (
            <button type="button" className="emoji-none" onClick={() => pick('')}>
              {t.noPicture}
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
          {results.length === 0 && <p className="emoji-empty">{t.noMatch}</p>}
          <p className="emoji-device">
            {t.anyEmoji} {deviceEmojiTip(t)}
          </p>
        </div>
      )}
    </div>
  )
}
