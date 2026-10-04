import { useState } from "react"
import { Check, X, SquarePen } from "lucide-react"

function TaskCard({ task, onDelete, onToggle, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.title)

  const handleSaveEdit = () => {
    if (!editText.trim()) return
    onEdit(task.id, editText)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="flex items-center gap-3 p-3 rounded-lg bg-(--bg-sub)">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 bg-(--bg) text-(--text) border border-(--text-sub)/40 rounded px-2 py-1 text-sm focus:outline-hidden focus:border-(--accent)"
          autoFocus
        />

        <button
          onClick={handleSaveEdit}
          className="p-1 rounded-full transition bg-(--success)"
        >
          <Check size={12} strokeWidth={3} />
        </button>

        <button
          onClick={() => setIsEditing(false)}
          className="p-1 bg-(--danger) hover:brightness-75 rounded-full transition"
        >
          <X size={12} strokeWidth={3} />
        </button>
      </li>
    )
  }

  return (
    <li className="flex items-center justify-between gap-3 p-3 rounded-lg bg-(--bg-sub) transition">
      <button
        onClick={() => onToggle(task.id)}
        className={`p-1 rounded-full transition ${
          task.isDone
            ? "bg-(--success)"
            : "text-(--bg-lighter) bg-(--bg-lighter)"
        }`}
      >
        <Check size={12} strokeWidth={3} />
      </button>

      <span
        className={`text-left text-sm font-medium flex-1 wrap-break-word pr-2 ${
          task.isDone
            ? "line-through text-(--text-sub) opacity-50"
            : "text-(--text)"
        }`}
      >
        {task.title}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-(--text) hover:brightness-75 rounded-full transition"
        >
          <SquarePen size={16} />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1 bg-(--danger) hover:brightness-75 rounded-full transition"
        >
          <X size={12} strokeWidth={3} />
        </button>
      </div>
    </li>
  )
}

export default TaskCard
