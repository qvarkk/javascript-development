import { notify } from "./notification"

const MemoryLocalStorageKey = "memory"

export function readMemory() {
  let value = localStorage.getItem(MemoryLocalStorageKey)

  if (value === null) {
    notify(
      "Memory is empty",
      "No value was saved to the memory. Use MS button to do it.",
    )
    return ""
  }

  return value
}

export function saveMemory(value) {
  localStorage.setItem(MemoryLocalStorageKey, value)
  notify("Memory saved", `${value} was saved to memory successfully.`)
}

export function clearMemory() {
  localStorage.removeItem(MemoryLocalStorageKey)
  notify("Memory cleared", "Memory cleared successfully.")
}
