import { notification, notificationText, notificationTitle } from "./elements"

let timeoutId = null

export function notify(title, text, durationMs = 2000) {
  notificationTitle.textContent = title
  notificationText.textContent = text
  notification.classList.add("active")

  if (timeoutId !== null) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    notification.classList.remove("active")
    timeoutId = null
  }, durationMs)
}
