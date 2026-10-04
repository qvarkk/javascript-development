import { useState } from "react"
import { ArrowLeft, Search, X, Check } from "lucide-react"
import { currencyList } from "../data/currencyData"

function SearchScreen({
  isOpen,
  onClose,
  onSelectCurrency,
  currentSelectedCode,
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCurrencies = currencyList.filter(
    (item) =>
      item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.CharCode.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div
      className={`absolute inset-y-0 left-0 right-0 bg-(--bg) z-50 flex flex-col transition-transform duration-300 ease-in-out px-4 py-6 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={onClose}
          className="text-(--text) cursor-pointer transition active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-(--text) text-left">
          Change Currency
        </h1>
      </header>

      <div className="relative flex items-center border-b border-gray-300 pb-2 mb-6 focus-within:border-(--success) transition-colors">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search currency..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none outline-hidden text-sm text-(--text) placeholder-gray-400 text-left"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition hover:bg-gray-300"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-6 pr-1">
        {filteredCurrencies.map((currency) => {
          const isSelected = currency.CharCode === currentSelectedCode
          return (
            <div
              key={currency.ID}
              onClick={() => onSelectCurrency(currency)}
              className="flex items-center justify-between p-4 bg-(--bg-lighter) rounded-2xl cursor-pointer hover:scale-[1.01] transition duration-200"
              style={{ boxShadow: "var(--shadow-light)" }}
            >
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-lg font-bold text-(--text) tracking-wide">
                  {currency.CharCode}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {currency.Name}
                </span>
              </div>
              {isSelected && (
                <Check size={20} className="text-(--success)" strokeWidth={3} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SearchScreen
