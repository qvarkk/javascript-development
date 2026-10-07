import { useState } from "react"

function ModeSelector({ modes, onModeSelected, onValueSelected }) {
  const [selectedMode, setSelectedMode] = useState(modes[0])
  const [selectedValue, setSelectedValue] = useState(modes[0]?.values[0])

  const handleModeChange = (mode) => {
    setSelectedMode(mode)
    setSelectedValue(mode.values[0])

    if (onModeSelected) onModeSelected(mode)
    if (onValueSelected) onValueSelected(mode.values[0])
  }

  const handleValueChange = (value) => {
    setSelectedValue(value)
    if (onValueSelected) onValueSelected(value)
  }

  return (
    <div className="bg-(--bg-sub) flex items-center gap-6 py-[14px] px-[32px] rounded-[18px]">
      <div className="flex items-center gap-5">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isSelected = selectedMode?.name === mode.name

          return (
            <div
              key={mode.name}
              className={`flex items-center gap-2 cursor-pointer ${isSelected ? "text-(--text-action)" : ""} transition-colors`}
              onClick={() => handleModeChange(mode)}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <button className="cursor-pointer">{mode.name}</button>
            </div>
          )
        })}
      </div>

      <div className="w-1 h-6 bg-(--bg) rounded-[16px]"></div>

      <div className="flex items-center gap-5">
        {selectedMode?.values.map((value) => {
          const isValueSelected = selectedValue === value

          return (
            <button
              key={value}
              onClick={() => handleValueChange(value)}
              className={`cursor-pointer ${isValueSelected ? "text-(--text-action)" : ""} transition-colors`}
            >
              {value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ModeSelector
