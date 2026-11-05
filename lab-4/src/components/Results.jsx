import { ChevronRight, RotateCw } from "lucide-react"

function Results({ mode, modeValue, result, onRestart, onNext }) {
  const total = result.correct + result.incorrect + result.skipped
  const accuracy = total === 0 ? 0 : Math.round((result.correct / total) * 100)
  const cpm = Math.round((result.correct * 60) / Math.max(1, result.elapsed))

  const stats = [
    { label: "тип теста", value: `${mode.name.toLowerCase()} ${modeValue}` },
    { label: "cpm", value: cpm },
    { label: "точность", value: `${accuracy}%` },
    { label: "символы", value: result.correct },
    { label: "ошибки", value: result.incorrect + result.skipped },
  ]

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex gap-12">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-2">
            <span className="text-(--text-sub) text-base">{stat.label}</span>
            <span className="text-(--accent) text-2xl">{stat.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-2 bg-(--bg-sub) text-(--text-sub) px-6 py-[16px] rounded-[18px] cursor-pointer hover:brightness-125 transition-all ease-in-out"
          onClick={onRestart}
        >
          <RotateCw className="w-4 h-4" />
          заново
        </button>
        <button
          className="flex items-center gap-2 bg-(--accent) text-(--text-contrast) px-6 py-[16px] rounded-[18px] cursor-pointer hover:brightness-75 transition-all ease-in-out"
          onClick={onNext}
        >
          следующий тест
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}

export default Results
