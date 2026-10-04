import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { currencyList } from "./data/currencyData"
import { getCurrencySymbol } from "./data/currencySymbols"
import Keyboard from "./components/Keyboard"
import SearchScreen from "./components/SearchScreen"

function App() {
  const [sourceCurrency, setSourceCurrency] = useState(currencyList[1])
  const [targetCurrency, setTargetCurrency] = useState(currencyList[0])

  const [sourceAmount, setSourceAmount] = useState("1")
  const [focusedCard, setFocusedCard] = useState("source")
  const [searchTarget, setSearchTarget] = useState(null)

  const calculatedTargetAmount = (() => {
    const numSource = parseFloat(sourceAmount) || 0
    const sourceInBase =
      (numSource * sourceCurrency.Value) / sourceCurrency.Nominal
    const finalTarget =
      (sourceInBase / targetCurrency.Value) * targetCurrency.Nominal
    return Number(finalTarget.toFixed(4)).toString()
  })()

  const handleInputDigit = (key) => {
    if (focusedCard !== "source") return

    setSourceAmount((prev) => {
      if (key === "AC") return "0"
      if (key === "DEL") return prev.length <= 1 ? "0" : prev.slice(0, -1)
      if (key === ".") return prev.includes(".") ? prev : prev + "."
      if (prev === "0" && key !== ".") return key
      return prev + key
    })
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (searchTarget) return
      if (e.key >= "0" && e.key <= "9") handleInputDigit(e.key)
      if (e.key === "." || e.key === ",") handleInputDigit(".")
      if (e.key === "Backspace") handleInputDigit("DEL")
      if (e.key === "Escape") handleInputDigit("AC")
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchTarget, focusedCard])

  return (
    <div className="relative m-auto w-107 h-196 bg-(--bg) flex flex-col my-auto border border-gray-200 rounded-3xl overflow-hidden shadow-2xl">
      <header className="w-full text-center py-5">
        <h1 className="text-lg font-bold text-(--text)">Конвертер валют</h1>
      </header>

      <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        <div
          onClick={() => setFocusedCard("source")}
          className="p-4 bg-(--bg-lighter) rounded-2xl flex flex-col gap-3 cursor-pointer"
          style={{ boxShadow: "var(--shadow-hard)" }}
        >
          <div
            className="flex justify-between items-center"
            onClick={() => setSearchTarget("source")}
          >
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold tracking-wide text-(--text)">
                {sourceCurrency.CharCode}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {sourceCurrency.Name}
              </span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div className="w-full bg-(--bg-sub) px-4 py-3 rounded-xl flex items-center justify-center gap-1">
            <input
              type="text"
              readOnly
              inputMode="none"
              value={sourceAmount}
              className={`flex-1 bg-transparent border-none text-center outline-hidden text-base font-bold ${
                focusedCard === "source" ? "text-(--success)" : "text-(--text)"
              }`}
            />
            <span
              className={`text-base font-bold transition-colors ${
                focusedCard === "source" ? "text-(--success)" : "text-(--text)"
              }`}
            >
              {getCurrencySymbol(sourceCurrency.CharCode)}
            </span>
          </div>
        </div>

        <div
          onClick={() => setFocusedCard("target")}
          className="p-4 bg-(--bg-lighter) rounded-2xl flex flex-col gap-3 cursor-pointer"
          style={{ boxShadow: "var(--shadow-hard)" }}
        >
          <div
            className="flex justify-between items-center"
            onClick={() => setSearchTarget("target")}
          >
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold tracking-wide text-(--text)">
                {targetCurrency.CharCode}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {targetCurrency.Name}
              </span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div className="w-full bg-(--bg-sub) px-4 py-3 rounded-xl flex items-center justify-center gap-1">
            <input
              type="text"
              readOnly
              inputMode="none"
              value={calculatedTargetAmount}
              className={`flex-1 bg-transparent border-none text-center outline-hidden text-base font-bold ${
                focusedCard === "target" ? "text-(--success)" : "text-(--text)"
              }`}
            />
            <span
              className={`text-base font-bold transition-colors ${
                focusedCard === "target" ? "text-(--success)" : "text-(--text)"
              }`}
            >
              {getCurrencySymbol(targetCurrency.CharCode)}
            </span>
          </div>
        </div>

        <Keyboard onKeyPress={handleInputDigit} focusedCard={focusedCard} />
      </main>

      <SearchScreen
        isOpen={searchTarget === "source"}
        currentSelectedCode={sourceCurrency.CharCode}
        onClose={() => setSearchTarget(null)}
        onSelectCurrency={(currency) => {
          setSourceCurrency(currency)
          setSearchTarget(null)
        }}
      />
      <SearchScreen
        isOpen={searchTarget === "target"}
        currentSelectedCode={targetCurrency.CharCode}
        onClose={() => setSearchTarget(null)}
        onSelectCurrency={(currency) => {
          setTargetCurrency(currency)
          setSearchTarget(null)
        }}
      />
    </div>
  )
}

export default App
