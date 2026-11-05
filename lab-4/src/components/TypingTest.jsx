import { useEffect, useRef, useState } from "react"
import { RotateCw } from "lucide-react"

function TypingTest({ text, onStart, onRestart }) {
  const [inputs, setInputs] = useState([])
  const areaRef = useRef(null)

  useEffect(() => {
    areaRef.current?.focus()
  }, [])

  const targetChars = Array.from(text)

  const words = []
  let wordStart = null
  for (let index = 0; index < targetChars.length; index++) {
    const isSpace = targetChars[index] === " "
    if (!isSpace && wordStart === null) wordStart = index
    if (isSpace && wordStart !== null) {
      words.push({ start: wordStart, end: index })
      wordStart = null
    }
  }
  if (wordStart !== null)
    words.push({ start: wordStart, end: targetChars.length })

  const getPosition = (list) => {
    if (list.length === 0) return 0
    const last = list[list.length - 1]
    return last.type === "skip" ? last.to : last.targetIndex + 1
  }

  const position = getPosition(inputs)

  const handleKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return

    if (event.key === "Backspace") {
      event.preventDefault()
      setInputs((prev) => prev.slice(0, -1))
      return
    }

    if (event.key.length !== 1) return

    event.preventDefault()

    if (inputs.length === 0) onStart()

    setInputs((prev) => {
      const pos = getPosition(prev)
      if (pos >= targetChars.length) return prev

      if (event.key === " ") {
        if (targetChars[pos] === " ") {
          return [
            ...prev,
            { type: "char", targetIndex: pos, char: " ", correct: true },
          ]
        }

        const word = words.find((w) => pos >= w.start && pos < w.end)
        return [
          ...prev,
          { type: "skip", from: pos, to: word ? word.end : pos + 1 },
        ]
      }

      return [
        ...prev,
        {
          type: "char",
          targetIndex: pos,
          char: event.key,
          correct: event.key === targetChars[pos],
        },
      ]
    })
  }

  const statuses = new Array(targetChars.length).fill("untyped")

  for (const input of inputs) {
    if (input.type === "skip") {
      for (let index = input.from; index < input.to; index++) {
        statuses[index] = "skipped"
      }
    } else if (input.targetIndex < targetChars.length) {
      statuses[input.targetIndex] = input.correct ? "correct" : "incorrect"
    }
  }

  const clampedPosition = Math.min(position, targetChars.length)
  const activeWord =
    words.find(
      (word) => clampedPosition >= word.start && clampedPosition <= word.end,
    ) ?? null

  const activeWordHasError =
    activeWord !== null &&
    statuses.slice(activeWord.start, activeWord.end).includes("incorrect")

  const glyphs = targetChars.map((char, index) => {
    let className = ""

    if (statuses[index] === "correct") className = "char-correct"
    else if (statuses[index] === "incorrect") className = "char-incorrect"
    else if (statuses[index] === "skipped") className = "char-skipped"

    if (
      activeWordHasError &&
      index >= activeWord.start &&
      index < activeWord.end
    ) {
      className = className ? `${className} word-error` : "word-error"
    }

    return { char, key: `t${index}`, className }
  })

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        ref={areaRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="max-w-5xl text-left outline-none cursor-text"
        style={{ font: "var(--font-body)" }}
      >
        {glyphs.slice(0, position).map((glyph) => (
          <span key={glyph.key} className={glyph.className || ""}>
            {glyph.char}
          </span>
        ))}
        <span className="caret" />
        {glyphs.slice(position).map((glyph) => (
          <span key={glyph.key} className={glyph.className || ""}>
            {glyph.char}
          </span>
        ))}
      </div>
      <button
        className="flex items-center gap-2 bg-(--bg-sub) text-(--text-sub) px-6 py-[16px] rounded-[18px] cursor-pointer hover:brightness-125 transition-all ease-in-out"
        onClick={onRestart}
      >
        <RotateCw className="w-4 h-4" />
        заново
      </button>
    </div>
  )
}

export default TypingTest
