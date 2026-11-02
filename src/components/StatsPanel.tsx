import { useState, type CSSProperties } from 'react'
import { MAX_COUNT } from '../counting'
import { MIN_TIMED, getStats, median, resetStats, type Entry, type Group, type Stats } from '../stats'

// Laid out like the keyboard, so slow letters can be spotted by where they are.
const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row) => [...row])
const NUMBERS = Array.from({ length: MAX_COUNT }, (_, i) => String(i + 1))

// Typical time, light (faster) to dark (slower): one hue, so darker always means slower.
const RAMP = ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b']
const DARK_FROM = 3 // steps from here on need white text

type Selected = { group: Group; item: string } | null

// The stats so far: how often each letter, number and counting picture came up, and how long it took.
export function StatsPanel({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState<Stats>(getStats)
  const [selected, setSelected] = useState<Selected>(null)
  const things = Object.keys(stats.things)

  function reset() {
    if (!confirm('Delete all the stats on this device?')) return
    resetStats()
    setStats(getStats())
    setSelected(null)
  }

  const tile = (group: Group, item: string) => (
    <Tile
      key={item}
      item={item}
      entry={stats[group][item]}
      shade={shadeFor(stats[group], item)}
      current={selected?.group === group && selected.item === item}
      onClick={() => setSelected({ group, item })}
    />
  )

  const detail = (group: Group) =>
    selected?.group === group && <Detail item={selected.item} entry={stats[group][selected.item]} />

  return (
    <div className="overlay centred" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="word-picker stats" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>📊 Stats</h2>
          <button className="tool" onClick={onClose} autoFocus>
            Done
          </button>
        </header>
        <div className="word-picker-lists">
          <Legend />

          <h3>Letters</h3>
          <div className="stat-keyboard">
            {KEY_ROWS.map((row, i) => (
              <div key={i} className="stat-row" style={{ paddingLeft: `${i * 0.5 * 56}px` }}>
                {row.map((letter) => tile('letters', letter))}
              </div>
            ))}
          </div>
          {detail('letters')}

          <h3>Counting: numbers</h3>
          <div className="stat-row">{NUMBERS.map((n) => tile('numbers', n))}</div>
          {detail('numbers')}

          <h3>Counting: pictures</h3>
          {things.length > 0 ? <div className="stat-row wrap">{things.map((t) => tile('things', t))}</div> : <p className="hint">None counted yet.</p>}
          {detail('things')}

          <p className="hint stats-note">
            Kept in this browser only, for both languages. Not timed: the first letter of a word (it includes reading the word), answers
            after a spoken hint (Space), and anything over 30 s (letters) or 60 s (counting).
          </p>
          <button className="link" onClick={reset}>
            Reset stats
          </button>
        </div>
      </div>
    </div>
  )
}

// Where an item's typical time sits between the fastest and slowest in its group, as a ramp step.
// Only items with enough timed answers are shaded; null means no shade.
function shadeFor(group: Record<string, Entry>, item: string): number | null {
  const typical = (e: Entry | undefined) => (e && e.times.length >= MIN_TIMED ? median(e.times) : null)
  const mine = typical(group[item])
  if (mine === null) return null
  const all = Object.values(group).map(typical).filter((t): t is number => t !== null)
  const min = Math.min(...all)
  const max = Math.max(...all)
  if (max === min) return Math.floor(RAMP.length / 2)
  return Math.round(((mine - min) / (max - min)) * (RAMP.length - 1))
}

function seconds(ms: number | null): string {
  return ms === null ? '–' : `${(ms / 1000).toFixed(1)} s`
}

function Tile({ item, entry, shade, current, onClick }: { item: string; entry?: Entry; shade: number | null; current: boolean; onClick: () => void }) {
  const className = ['stat-tile', !entry && 'unseen', entry && shade === null && 'few', current && 'current'].filter(Boolean).join(' ')
  const style = shade === null ? undefined : ({ background: RAMP[shade], color: shade >= DARK_FROM ? '#fff' : undefined } as CSSProperties)
  return (
    <button className={className} style={style} onClick={onClick} title={entry ? `${item}: typical ${seconds(median(entry.times))}` : `${item}: not seen yet`}>
      <span className="stat-item">{item}</span>
      <span className="stat-time">{entry ? seconds(median(entry.times)) : ''}</span>
      <span className="stat-counts">{entry ? `${entry.correct}✓ ${entry.wrong}✗` : ''}</span>
    </button>
  )
}

// Everything recorded for one item, so the numbers can be checked.
function Detail({ item, entry }: { item: string; entry?: Entry }) {
  if (!entry) return <div className="stat-detail">{item}: not seen yet.</div>
  const mixups = Object.entries(entry.mixups).sort((a, b) => b[1] - a[1])
  return (
    <div className="stat-detail">
      <strong>{item}</strong>
      <table>
        <tbody>
          <tr>
            <th>Right</th>
            <td>
              {entry.correct}
              {entry.helped > 0 && ` (${entry.helped} after a spoken hint)`}
            </td>
          </tr>
          <tr>
            <th>Wrong</th>
            <td>{entry.wrong}</td>
          </tr>
          <tr>
            <th>Pressed instead</th>
            <td>{mixups.length ? mixups.map(([key, n]) => `${key} ×${n}`).join(', ') : '–'}</td>
          </tr>
          <tr>
            <th>Typical time</th>
            <td>
              {seconds(median(entry.times))}
              {entry.times.length < MIN_TIMED && ` (only ${entry.times.length} timed, needs ${MIN_TIMED})`}
            </td>
          </tr>
          <tr>
            <th>Recent times</th>
            <td>{entry.times.length ? entry.times.map((t) => (t / 1000).toFixed(1)).join(', ') + ' s' : '–'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function Legend() {
  return (
    <div className="stat-legend">
      <span>Faster</span>
      <span className="stat-ramp">
        {RAMP.map((c) => (
          <span key={c} style={{ background: c }} />
        ))}
      </span>
      <span>Slower</span>
      <span className="stat-tile few legend-swatch" /> fewer than {MIN_TIMED} timed
      <span className="stat-tile unseen legend-swatch" /> not seen
      <span className="hint">Tap one for the details.</span>
    </div>
  )
}
