import { RotateCcw } from "lucide-react"

function TypingTest({ text, onRestart }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="max-w-5xl text-left" style={{ font: "var(--font-body)" }}>
        {text}
      </div>
      <button
        className="flex items-center gap-2 bg-(--bg-sub) text-(--text-sub) px-6 py-[16px] rounded-[18px] cursor-pointer hover:brightness-125 transition-all ease-in-out"
        onClick={onRestart}
      >
        <RotateCcw className="w-4 h-4" />
        заново
      </button>
    </div>
  )
}

export default TypingTest
