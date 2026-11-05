import { useState } from "react"
import { ChevronRight, Clock, TextCursorInput, Type } from "lucide-react"
import ModeSelector from "./components/ModeSelector"
import NotificationManager from "./components/NotificationManager"
import TypingTest from "./components/TypingTest"
import fetchText, { trimToWords } from "./services/textService"

const AVAILABLE_MODES = [
  {
    id: "time",
    icon: Clock,
    name: "Время",
    values: [10, 25, 50, 100],
  },
  {
    id: "free",
    icon: Type,
    name: "Слова",
    values: [15, 30, 60, 120],
  },
]

function App() {
  const [currentMode, setCurrentMode] = useState(AVAILABLE_MODES[0])
  const [currentValue, setCurrentValue] = useState(AVAILABLE_MODES[0].values[0])
  const [isInstantionted, setIsInstantiated] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [rawText, setRawText] = useState("")
  const [testId, setTestId] = useState(0)

  const displayText =
    currentMode.id === "free" ? trimToWords(rawText, currentValue) : rawText

  const startTest = async () => {
    const text = await fetchText()
    if (!text) return
    setRawText(text)
    setIsInstantiated(true)
    setIsStarted(false)
  }

  const restart = () => {
    setIsStarted(false)
    setTestId((id) => id + 1)
  }

  return (
    <>
      <header className="flex items-center justify-center p-5 gap-3.5">
        <TextCursorInput size={42} className="text-(--accent)" />
        <h1 className="text-(--text-heading)">TypinqTest</h1>
      </header>
      <main className="flex-1 max-w-378 flex flex-col items-center justify-center gap-10">
        <div className={isStarted ? "hidden" : ""}>
          <ModeSelector
            modes={AVAILABLE_MODES}
            onModeSelected={(mode) => setCurrentMode(mode)}
            onValueSelected={(value) => setCurrentValue(value)}
          />
        </div>

        {isInstantionted ? (
          <TypingTest
            key={testId}
            text={displayText}
            mode={currentMode}
            value={currentValue}
            onStart={() => setIsStarted(true)}
            onRestart={restart}
          />
        ) : (
          <button
            className="flex items-center gap-2 bg-(--accent) text-(--text-contrast) px-6 py-[16px] rounded-[18px] cursor-pointer hover:brightness-75 transition-all ease-in-out"
            onClick={startTest}
          >
            Начать тест
            <ChevronRight />
          </button>
        )}
      </main>

      <NotificationManager />
    </>
  )
}

export default App
