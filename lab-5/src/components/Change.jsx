import { formatPercent, toneClass } from '../lib/format.js'

export default function Change({ value }) {
  if (value == null) return null
  return <span className={`font-mono ${toneClass(Math.round(value * 100))}`}>{formatPercent(value)}</span>
}
