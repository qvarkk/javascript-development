const BASE_URL = "https://api.coingecko.com/api/v3"
const TIMEOUT = 15_000

export const NETWORK_ERROR = 0

export class ApiError extends Error {
  constructor(status) {
    super(`Запрос coingecko тайно дернул статус ${status}`)
    this.status = status
  }
}

async function request(path, params) {
  let response
  try {
    response = await fetch(
      `${BASE_URL}${path}?${new URLSearchParams(params)}`,
      {
        signal: AbortSignal.timeout(TIMEOUT),
      },
    )
  } catch {
    throw new ApiError(NETWORK_ERROR)
  }
  if (!response.ok) throw new ApiError(response.status)
  return response.json()
}

const safeImage = (url) =>
  typeof url === "string" && url.startsWith("https://") ? url : null

const toCoin = (item) => ({
  id: item.id,
  symbol: item.symbol,
  name: item.name,
  image: safeImage(item.image),
  rank: item.market_cap_rank ?? null,
  price: item.current_price ?? null,
  change24h: item.price_change_percentage_24h ?? null,
  marketCap: item.market_cap ?? null,
})

export async function getMarkets() {
  const items = await request("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 100,
    page: 1,
  })
  return items.map(toCoin)
}

export async function getGlobal() {
  const { data } = await request("/global")
  const usd = data.total_market_cap?.usd
  const eur = data.total_market_cap?.eur
  return {
    marketCap: usd ?? null,
    marketCapChange24h: data.market_cap_change_percentage_24h_usd ?? null,
    btcDominance: data.market_cap_percentage?.btc ?? null,
    ethDominance: data.market_cap_percentage?.eth ?? null,
    eurRate: usd && eur ? eur / usd : null,
  }
}

export async function getCoin(id) {
  const data = await request(`/coins/${encodeURIComponent(id)}`, {
    localization: false,
    tickers: false,
    community_data: false,
    developer_data: false,
  })
  const market = data.market_data ?? {}
  return toCoin({
    id: data.id,
    symbol: data.symbol,
    name: data.name,
    image: data.image?.large,
    market_cap_rank: data.market_cap_rank,
    current_price: market.current_price?.usd,
    price_change_percentage_24h: market.price_change_percentage_24h,
    market_cap: market.market_cap?.usd,
  })
}

export async function getHistory(id, days) {
  const data = await request(`/coins/${encodeURIComponent(id)}/market_chart`, {
    vs_currency: "usd",
    days,
  })
  return data.prices ?? []
}
