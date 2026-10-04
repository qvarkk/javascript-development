export const getTasks = () => JSON.parse(localStorage.getItem("tasks")) || []

export const createTask = (title) => {
  const tasks = getTasks()
  const newTask = { id: Date.now(), title, isDone: false }
  localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]))
  return getTasks()
}

export const deleteItem = (id) => {
  const filtered = getTasks().filter((task) => task.id !== id)
  localStorage.setItem("tasks", JSON.stringify(filtered))
  return filtered
}

export const setDone = (id) => {
  const updated = getTasks().map((task) =>
    task.id === id ? { ...task, isDone: !task.isDone } : task,
  )
  localStorage.setItem("tasks", JSON.stringify(updated))
  return updated
}

export const editText = (id, newTitle) => {
  const updated = getTasks().map((task) =>
    task.id === id ? { ...task, title: newTitle } : task,
  )
  localStorage.setItem("tasks", JSON.stringify(updated))
  return updated
}
