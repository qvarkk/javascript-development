export function debounce(callback, delay = 300) {
  let timer

  const debounced = (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => callback(...args), delay)
  }

  debounced.cancel = () => clearTimeout(timer)

  return debounced
}
