import { notificationEvent, notificationsBus } from "./notificationService"

const API_URL = "https://fish-text.ru/get"
const DEFAULT_SENTENCE_LENGTH = 10

async function fetchText() {
  try {
    const response = await fetch(`${API_URL}?number=${DEFAULT_SENTENCE_LENGTH}`)

    if (!response.ok) {
      throw new Error(`HTTP запрос вернул статус ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== "success") {
      throw new Error(`FishText API вернул статус ${data.status}`)
    }

    return data.text
  } catch (error) {
    notificationsBus.publish(
      notificationEvent,
      `Произошла ошибка: ${error.message}.`,
    )
  }
}

export default fetchText
