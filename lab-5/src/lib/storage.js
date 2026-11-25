export const STORAGE_KEY = "😒:💸"

const isTransaction = (item) =>
  item !== null &&
  typeof item === "object" &&
  typeof item.id === "string" &&
  typeof item.coinId === "string" &&
  typeof item.name === "string" &&
  typeof item.symbol === "string" &&
  Number.isFinite(item.amount) &&
  Number.isFinite(item.price) &&
  Number.isFinite(item.createdAt) &&
  item.amount > 0 &&
  item.price > 0

export function parseTransactions(raw) {
  try {
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data.filter(isTransaction) : []
  } catch {
    return []
  }
}

export function loadTransactions() {
  try {
    return parseTransactions(localStorage.getItem(STORAGE_KEY))
  } catch {
    return []
  }
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    return true
  } catch {
    return false
  }
}
