export function filterCoins(coins, { query, minPrice, maxPrice }) {
  const text = query.trim().toLowerCase()
  const min = minPrice === "" ? -Infinity : Number(minPrice)
  const max = maxPrice === "" ? Infinity : Number(maxPrice)
  const hasRange = minPrice !== "" || maxPrice !== ""

  return coins.filter((coin) => {
    const matchesText =
      !text ||
      coin.name.toLowerCase().includes(text) ||
      coin.symbol.toLowerCase().includes(text)
    const matchesPrice =
      coin.price === null ? !hasRange : coin.price >= min && coin.price <= max
    return matchesText && matchesPrice
  })
}

export function sortCoins(coins, { key, direction }) {
  const factor = direction === "asc" ? 1 : -1

  return [...coins].sort((a, b) => {
    const left = a[key]
    const right = b[key]
    if (left === null || right === null)
      return (left === null) - (right === null)
    return (
      (typeof left === "string" ? left.localeCompare(right) : left - right) *
      factor
    )
  })
}

export function priceTrends(previous, next) {
  const oldPrices = new Map(previous.map((coin) => [coin.id, coin.price]))
  const trends = {}

  for (const { id, price } of next) {
    const oldPrice = oldPrices.get(id)
    if (oldPrice == null || price === null || oldPrice === price) continue
    trends[id] = price > oldPrice ? "up" : "down"
  }

  return trends
}

export function findMovers(coins) {
  const ranked = coins
    .filter((coin) => coin.change24h !== null)
    .sort((a, b) => b.change24h - a.change24h)
  return { gainer: ranked[0] ?? null, loser: ranked.at(-1) ?? null }
}

export function convert(amount, price, rates) {
  const quantity = Number(amount)
  const usd =
    amount !== "" && quantity >= 0 && price != null ? quantity * price : null
  const to = (rate) => (usd !== null && rate != null ? usd * rate : null)

  return { usd, eur: to(rates.eur), btc: to(rates.btc) }
}

export function periodChange(points) {
  if (points.length < 2 || !points[0][1]) return null
  return ((points.at(-1)[1] - points[0][1]) / points[0][1]) * 100
}
