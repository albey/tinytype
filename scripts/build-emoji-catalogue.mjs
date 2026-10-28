// Builds src/emojiCatalogue.json, the full emoji list for the picture picker, from the
// emojibase-data package (MIT; names from Unicode CLDR). Run when updating the emoji:
//   npm pack emojibase-data && tar xzf emojibase-data-*.tgz
//   node scripts/build-emoji-catalogue.mjs package
// Keeps smileys, people, animals, nature, food, travel, activities and objects, without skin-tone
// variants or emoji that don't belong in a toddler's app. Each entry: [emoji, search words].
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = process.argv[2]
if (!dir) throw new Error('usage: node scripts/build-emoji-catalogue.mjs <unpacked emojibase-data folder>')
const read = (lang) => JSON.parse(readFileSync(join(dir, lang, 'compact.json'), 'utf8'))

// 0 smileys, 1 people, 3 animals & nature, 4 food, 5 travel & places, 6 activities, 7 objects
// (2 = skin-tone pieces, 8 = symbols, 9 = flags are left out)
const GROUPS = new Set([0, 1, 3, 4, 5, 6, 7])
const LEFT_OUT = new Set([
  '🍺', '🍻', '🍷', '🍸', '🍹', '🥃', '🍾', '🥂', '🍶', '🧉', '🚬', '🔫', '🔪', '🗡️', '⚔️', '💣', '🧨',
  '💊', '💉', '🩸', '⚰️', '🪦', '⚱️', '🖕', '💩', '🍆', '🍑', '💋', '👙', '🩲', '💀', '☠️', '🤬', '🪓',
])

const base = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()
const words = (entry) => [entry.label, ...(entry.tags ?? [])].flatMap((t) => base(t).split(/[^A-Z0-9]+/)).filter((w) => w.length > 1)

const italian = new Map(read('it').map((e) => [e.hexcode, e]))
const out = []
for (const e of read('en')) {
  if (!GROUPS.has(e.group) || LEFT_OUT.has(e.unicode)) continue
  const it = italian.get(e.hexcode)
  const names = [...new Set([...words(e), ...(it ? words(it) : [])])]
  out.push([e.unicode, names.join(' ')])
}
writeFileSync(new URL('../src/emojiCatalogue.json', import.meta.url), JSON.stringify(out))
console.log(`${out.length} emoji written`)
