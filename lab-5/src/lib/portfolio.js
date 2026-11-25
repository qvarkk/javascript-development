const sum = (items, pick) =>
  items.reduce((total, item) => total + pick(item), 0)

const percent = (part, whole) => (whole > 0 ? (part / whole) * 100 : null)

const withoutNoise = (value) => (Math.abs(value) < 1e-8 ? 0 : value)

export const tradeTotal = ({ amount, price }) => amount * price

export function parseDraft({ coinId, amount, price }) {
  const transaction = { coinId, amount: Number(amount), price: Number(price) }
  const filled = coinId !== "" && amount !== "" && price !== ""
  const valid =
    filled &&
    Number.isFinite(transaction.amount) &&
    Number.isFinite(transaction.price) &&
    transaction.amount > 0 &&
    transaction.price > 0

  return valid ? transaction : null
}

export function summarizePortfolio(transactions, coins) {
  const prices = new Map(coins.map((coin) => [coin.id, coin.price]))
  const grouped = new Map()

  for (const { coinId, name, symbol, amount, price } of transactions) {
    const position = grouped.get(coinId) ?? {
      coinId,
      name,
      symbol,
      amount: 0,
      invested: 0,
    }
    position.amount += amount
    position.invested += tradeTotal({ amount, price })
    grouped.set(coinId, position)
  }

  const positions = [...grouped.values()].map((position) => {
    const price = prices.get(position.coinId) ?? null
    const value = price === null ? null : position.amount * price
    const pnl = value === null ? null : withoutNoise(value - position.invested)
    return {
      ...position,
      price,
      value,
      pnl,
      averagePrice: position.invested / position.amount,
      pnlPercent: pnl === null ? null : percent(pnl, position.invested),
    }
  })

  const priced = positions.filter((position) => position.value !== null)
  const value = priced.length ? sum(priced, (position) => position.value) : null
  const invested = sum(positions, (position) => position.invested)
  const pricedInvested = sum(priced, (position) => position.invested)
  const pnl = value === null ? null : withoutNoise(value - pricedInvested)

  return {
    positions: positions
      .map((position) => ({
        ...position,
        share: position.value === null ? null : percent(position.value, value),
      }))
      .sort((a, b) => (b.value ?? -1) - (a.value ?? -1)),
    value,
    invested,
    pnl,
    pnlPercent: pnl === null ? null : percent(pnl, pricedInvested),
    unpriced: positions.length - priced.length,
  }
}
