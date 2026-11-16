import { useEffect, useState } from 'react'
import type { Language } from '../words'
import { useText } from '../text'

// Real photos of the word, found on Wikimedia while playing. No photos are saved: the browser
// asks each time a new word comes up (remembering answers only until the page is reloaded).
//
// Two steps, so the word is understood in the language being played:
// 1. Wikidata finds what the word means in that language: Italian LATTE is milk, not the coffee.
// 2. Wikimedia Commons finds photos tagged as showing that thing ("depicts"), preferring the
//    reviewed "quality images". Searching file names instead gives a lot of off-topic photos.
const SHOWN = 3
const FETCHED = 8 // a few spares, to replace a photo that fails to load or is skipped

const cache = new Map<string, Promise<string[]>>() // `${language}:${word}` → photo URLs, this visit only

async function getJson(url: string, params: Record<string, string>, signal: AbortSignal) {
  const query = new URLSearchParams({ ...params, format: 'json', origin: '*' })
  const response = await fetch(`${url}?${query}`, { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

// The Wikidata item for the word in this language (Q8495 for Italian LATTE), preferring an exact
// match of its name or one of its other names.
async function findConcept(word: string, language: Language, signal: AbortSignal): Promise<string | undefined> {
  const data = await getJson('https://www.wikidata.org/w/api.php', {
    action: 'wbsearchentities',
    search: word.toLowerCase(),
    language,
    uselang: language,
    type: 'item',
    limit: '5',
  }, signal)
  const results: { id: string; match?: { text?: string } }[] = data?.search ?? []
  const exact = results.find((r) => r.match?.text?.toLowerCase() === word.toLowerCase())
  return (exact ?? results[0])?.id
}

async function photosOf(concept: string, qualityOnly: boolean, signal: AbortSignal): Promise<string[]> {
  const data = await getJson('https://commons.wikimedia.org/w/api.php', {
    action: 'query',
    generator: 'search',
    gsrsearch: `haswbstatement:P180=${concept} filetype:bitmap${qualityOnly ? ' incategory:Quality_images' : ''}`,
    gsrnamespace: '6',
    gsrlimit: String(FETCHED),
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '400',
  }, signal)
  const pages: { index: number; imageinfo?: { thumburl?: string }[] }[] = Object.values(data?.query?.pages ?? {})
  return pages
    .sort((a, b) => a.index - b.index) // search order: best matches first
    .map((page) => page.imageinfo?.[0]?.thumburl)
    .filter((url): url is string => !!url)
}

async function searchPhotos(word: string, language: Language, signal: AbortSignal): Promise<string[]> {
  const concept = await findConcept(word, language, signal)
  if (!concept) return [] // no idea what the word means: better no photos than wrong ones
  const quality = await photosOf(concept, true, signal)
  if (quality.length >= SHOWN) return quality
  const any = await photosOf(concept, false, signal)
  return [...quality, ...any.filter((url) => !quality.includes(url))]
}

function cachedSearch(word: string, language: Language, signal: AbortSignal): Promise<string[]> {
  const key = `${language}:${word}`
  let result = cache.get(key)
  if (!result) {
    result = searchPhotos(word, language, signal)
    cache.set(key, result)
    result.catch(() => cache.delete(key)) // failed or interrupted: try again next time
  }
  return result
}

type Props = { word: string; language: Language }

// A bigger copy of a Commons thumbnail for the zoomed view (thumbnail URLs end in /400px-Name.jpg).
function bigger(url: string) {
  return url.replace(/\/400px-/, '/1200px-')
}

// Three photos above the letters. Clicking a photo zooms it in; the little × on a photo removes it
// and another one takes its place (a photo that fails to load is swapped the same way).
export function Photos({ word, language }: Props) {
  const [found, setFound] = useState<{ word: string; urls: string[] }>({ word: '', urls: [] })
  const [removed, setRemoved] = useState<string[]>([])
  const [zoomed, setZoomed] = useState<string | null>(null)
  const t = useText()

  useEffect(() => {
    const controller = new AbortController()
    cachedSearch(word, language, controller.signal)
      .then((urls) => setFound({ word, urls }))
      .catch(() => setFound({ word, urls: [] })) // offline or blocked: just no photos
    return () => controller.abort()
  }, [word, language])

  // Escape closes the zoomed photo.
  useEffect(() => {
    if (!zoomed) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setZoomed(null)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [zoomed])

  const shown = found.word === word ? found.urls.filter((url) => !removed.includes(url)).slice(0, SHOWN) : []
  if (shown.length === 0) return null

  const remove = (url: string) => setRemoved((r) => [...r, url])
  return (
    <>
      <div className="photos">
        {shown.map((url) => (
          <div key={url} className="photo-frame">
            <img
              className="photo"
              src={url}
              alt=""
              draggable={false}
              referrerPolicy="no-referrer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setZoomed(url)}
              onError={() => remove(url)}
            />
            <button
              className="photo-remove"
              aria-label={t.removePhoto}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => remove(url)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {zoomed && (
        <div className="overlay centred photo-zoom" onMouseDown={(e) => e.preventDefault()} onClick={() => setZoomed(null)}>
          <img
            src={bigger(zoomed)}
            alt=""
            referrerPolicy="no-referrer"
            // Some originals are smaller than the bigger size; fall back to the thumbnail.
            onError={(e) => {
              if (e.currentTarget.src !== zoomed) e.currentTarget.src = zoomed
            }}
          />
        </div>
      )}
    </>
  )
}
