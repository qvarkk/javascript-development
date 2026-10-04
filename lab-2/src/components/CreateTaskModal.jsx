import { useState } from "react"
import { Check, ArrowLeft } from "lucide-react"

function CreateTaskModal({ onClose, onSave }) {
  const [taskTitle, setTaskTitle] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskTitle.trim()) return
    onSave(taskTitle)
    setTaskTitle("")
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-(--bg) h-[50%] w-full max-w-96 rounded-xl p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-(--accent) hover:brightness-75 transition"
            >
              <ArrowLeft size={24} strokeWidth={2} />
            </button>

            <button
              type="submit"
              className="text-(--accent) hover:brightness-75 transition"
            >
              <Check size={20} strokeWidth={3} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Add New Task..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full bg-(--bg) text-(--text) text-sm px-3 py-2 rounded-lg focus:outline-hidden transition"
            autoFocus
          />
        </form>
      </div>
    </div>
  )
}

export default CreateTaskModal
