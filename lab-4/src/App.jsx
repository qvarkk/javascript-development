import { useState } from "react"
import { ChevronRight, Clock, TextCursorInput, Type } from "lucide-react"
import ModeSelector from "./components/ModeSelector"
import Notification from "./components/Notification"
import NotificationManager from "./components/NotificationManager"
import fetchText from "./services/textService"

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

  return (
    <>
      <header className="flex items-center justify-center p-5 gap-3.5">
        <TextCursorInput size={42} className="text-(--accent)" />
        <h1 className="text-(--text-heading)">TypinqTest</h1>
      </header>
      <main className="flex-1 max-w-378 flex flex-col items-center justify-center gap-10">
        <ModeSelector
          modes={AVAILABLE_MODES}
          onModeSelected={(mode) => setCurrentMode(mode)}
          onValueSelected={(value) => setCurrentValue(value)}
        />

        {isInstantionted ? (
          <></>
        ) : (
          <button
            className="flex items-center gap-2 bg-(--accent) text-(--text-contrast) px-6 py-[16px] rounded-[18px] cursor-pointer hover:brightness-75 transition-all ease-in-out"
            onClick={async () => console.log(await fetchText())}
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
