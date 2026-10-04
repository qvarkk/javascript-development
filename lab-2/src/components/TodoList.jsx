import blankImage from "../assets/blank.png"
import TaskCard from "./TaskCard"

function TodoList({ tasks, onDelete, onToggle, onEdit }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <img
          src={blankImage}
          alt="No tasks remaining"
          className="w-56 h-auto mb-4 object-contain"
        />
        <p className="text-(--text) text-sm tracking-wide">
          Add a task to get started.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3 px-4 w-full list-none m-0 p-0">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}

export default TodoList
