import { useState } from "react"
import { Plus } from "lucide-react"
import {
  getTasks,
  createTask,
  deleteItem,
  setDone,
  editText,
} from "./services/storage"
import TodoList from "./components/TodoList"
import CreateTaskModal from "./components/CreateTaskModal"

function App() {
  const [tasks, setTasks] = useState(getTasks())
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="max-w-107 max-h-160 m-auto flex-1 w-full flex flex-col py-6">
      <main className="flex-1 w-full flex flex-col justify-center">
        <TodoList
          tasks={tasks}
          onDelete={(id) => setTasks(deleteItem(id))}
          onToggle={(id) => setTasks(setDone(id))}
          onEdit={(id, newTitle) => setTasks(editText(id, newTitle))}
        />
      </main>

      <footer className="flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-1 bg-(--accent) text-(--text) rounded-full hover:brightness-110 shadow-lg transition flex items-center justify-center cursor-pointer"
        >
          <Plus size={40} strokeWidth={1.5} />
        </button>
      </footer>

      {isModalOpen && (
        <CreateTaskModal
          onClose={() => setIsModalOpen(false)}
          onSave={(title) => {
            setTasks(createTask(title))
            setIsModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default App
