import { Delete } from "lucide-react"

function Keyboard({ onKeyPress, focusedCard }) {
  if (!focusedCard) return null

  const rows = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
  ]

  return (
    <div className="w-full p-4 rounded-t-3xl border-t border-(--bg-sub) mt-auto z-10">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={() => onKeyPress("AC")}
          className="py-3.5 bg-(--bg-lighter) rounded-xl font-bold text-(--success) text-center cursor-pointer transition active:scale-95"
          style={{ boxShadow: "var(--shadow-light)" }}
        >
          AC
        </button>
        <button
          onClick={() => onKeyPress("DEL")}
          className="py-3.5 bg-(--bg-lighter) rounded-xl font-bold text-(--success) flex items-center justify-center cursor-pointer transition active:scale-95"
          style={{ boxShadow: "var(--shadow-light)" }}
        >
          <Delete size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-3 gap-3">
            {row.map((num) => (
              <button
                key={num}
                onClick={() => onKeyPress(num)}
                className="py-3.5 bg-(--bg-lighter) text-(--text) font-semibold rounded-xl text-center cursor-pointer transition active:scale-95"
                style={{ boxShadow: "var(--shadow-light)" }}
              >
                {num}
              </button>
            ))}
          </div>
        ))}

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onKeyPress("0")}
            className="col-span-2 py-3.5 bg-(--bg-lighter) text-(--text) font-semibold rounded-xl text-center cursor-pointer transition active:scale-95"
            style={{ boxShadow: "var(--shadow-light)" }}
          >
            0
          </button>
          <button
            onClick={() => onKeyPress(".")}
            className="py-3.5 bg-(--bg-lighter) text-(--text) font-semibold rounded-xl text-center cursor-pointer transition active:scale-95"
            style={{ boxShadow: "var(--shadow-light)" }}
          >
            ,
          </button>
        </div>
      </div>
    </div>
  )
}

export default Keyboard
