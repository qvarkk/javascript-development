const LOCALE = 'ru-RU'
const formatters = new Map()

function number(options) {
  const key = JSON.stringify(options)
  if (!formatters.has(key)) formatters.set(key, new Intl.NumberFormat(LOCALE, options))
  return formatters.get(key)
}

export function toneClass(value) {
  if (value > 0) return 'text-up'
  if (value < 0) return 'text-down'
  return 'text-muted'
}

export function formatMoney(value, currency = 'USD', signDisplay = 'auto') {
  if (value == null) return ''
  const precision =
    value === 0 || Math.abs(value) >= 1
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { maximumSignificantDigits: 4 }
  return number({ style: 'currency', currency, signDisplay, ...precision }).format(value)
}

export function formatCompact(value) {
  if (value == null) return ''
  return number({
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatChartPrice(value) {
  const size = Math.abs(value)
  if (size < 1 || size >= 10) return formatMoney(value)
  return number({
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value)
}

export function formatChartAxis(value) {
  return Math.abs(value) >= 1000 ? formatCompact(value) : formatChartPrice(value)
}

export function formatPercent(value) {
  if (value == null) return ''
  return number({
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(value / 100)
}

export function formatShare(value) {
  if (value == null) return ''
  return number({ style: 'percent', maximumFractionDigits: 1 }).format(value / 100)
}

export function formatAmount(value) {
  if (value == null) return ''
  return number({
    maximumFractionDigits: 8,
    maximumSignificantDigits: 6,
    roundingPriority: 'morePrecision',
  }).format(value)
}

export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString(LOCALE)
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString(LOCALE, { dateStyle: 'short', timeStyle: 'short' })
}

export function formatChartTick(timestamp, days) {
  const date = new Date(timestamp)
  if (days === 1) return date.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' })
  if (days <= 30) return date.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' })
  return date.toLocaleDateString(LOCALE, { month: 'short', year: 'numeric' })
}
