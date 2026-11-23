import { NETWORK_ERROR } from "../api/coingecko.js"

export function describeError(status) {
  if (status === 429) {
    return "CoinGecko черти, запросы на кд (429)."
  }
  if (status === 404) {
    return "CoinGecko черти, не добавили такой коин (404)."
  }
  if (status === NETWORK_ERROR) {
    return navigator.onLine
      ? "CoinGecko черти, даже статус не прочитать."
      : "CoinGecko черти, обрубили инет."
  }
  return `CoinGecko черти, статус ${status}.`
}
