import { useEffect, useRef, useState } from "react"
import { RotateCcw } from "lucide-react"

function TypingTest({ text, onStart, onRestart }) {
  const [typed, setTyped] = useState("")
  const areaRef = useRef(null)

  useEffect(() => {
    areaRef.current?.focus()
  }, [])

  const handleKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return

    if (event.key.length === 1) {
      event.preventDefault()
      if (typed.length === 0) onStart()
      setTyped((prev) => prev + event.key)
    } else if (event.key === "Backspace") {
      event.preventDefault()
      setTyped((prev) => prev.slice(0, -1))
    }
  }

  const targetChars = Array.from(text)
  const typedChars = Array.from(typed)
  const caretIndex = typedChars.length

  const glyphs = [
    ...targetChars.map((char, index) => ({ char, key: `t${index}` })),
    ...typedChars
      .slice(targetChars.length)
      .map((char, index) => ({ char, key: `e${index}` })),
  ]

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        ref={areaRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="max-w-5xl text-left outline-none cursor-text"
        style={{ font: "var(--font-body)" }}
      >
        {glyphs.slice(0, caretIndex).map((glyph) => (
          <span key={glyph.key}>{glyph.char}</span>
        ))}
        <span className="caret" />
        {glyphs.slice(caretIndex).map((glyph) => (
          <span key={glyph.key}>{glyph.char}</span>
        ))}
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
