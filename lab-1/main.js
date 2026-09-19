import "./src/style.css"

import * as Elements from "./src/elements"
import * as Handlers from "./src/handlers"
import * as Consts from "/src/consts"
import * as Memory from "/src/memory"
import { notify } from "./src/notification"

let operand = "0"
let prevOperand = ""
let operator = ""
let prevOperator = ""

let isDecimalPartActive = false

const numberButtons = [
  Elements.btnZero,
  Elements.btnOne,
  Elements.btnTwo,
  Elements.btnThree,
  Elements.btnFour,
  Elements.btnFive,
  Elements.btnSix,
  Elements.btnSeven,
  Elements.btnEight,
  Elements.btnNine,
]

const numberButtonEvent = (number) => {
  if (operator !== "") {
    prevOperand = operand
    prevOperator = operator
    operand = "0"
    operator = ""
  }

  operand = Handlers.handleNumberButtonClick(
    operand,
    number,
    isDecimalPartActive,
  )
  updateDisplay()
}

numberButtons.forEach((btnElement, numericValue) => {
  btnElement.addEventListener("click", () => {
    numberButtonEvent(numericValue)
  })
})

Elements.btnComma.addEventListener("click", () => {
  if (operand.indexOf(".") >= 0) {
    return
  }

  operand += "."
  isDecimalPartActive = true
  updateDisplay()
})

const operationButtonEvent = (action) => {
  if (prevOperand !== "" && prevOperator !== "" && operand !== "") {
    let result = execOperation(prevOperand, prevOperator, operand)

    prevOperand = ""
    prevOperator = ""
    operand = result
  }
  operator = action
  isDecimalPartActive = false
  updateDisplay()
}

Elements.btnPlus.addEventListener("click", () => {
  operationButtonEvent("+")
})

Elements.btnMinus.addEventListener("click", () => {
  operationButtonEvent("-")
})

Elements.btnTimes.addEventListener("click", () => {
  operationButtonEvent("×")
})

Elements.btnDivide.addEventListener("click", () => {
  operationButtonEvent("÷")
})

Elements.btnPercent.addEventListener("click", () => {
  operationButtonEvent("%")
})

Elements.btnEquals.addEventListener("click", () => {
  operationButtonEvent("")
})

Elements.btnAllClean.addEventListener("click", () => {
  operator = ""
  operand = "0"
  prevOperand = ""
  prevOperator = ""
  isDecimalPartActive = false

  updateDisplay()
})

Elements.btnMemSave.addEventListener("click", () => {
  Memory.saveMemory(operand)
})

Elements.btnMemClear.addEventListener("click", () => {
  Memory.clearMemory()
})

Elements.btnMemRead.addEventListener("click", () => {
  let savedValue = Memory.readMemory()

  if (savedValue === "") return

  operand = savedValue
  updateDisplay()
})

Elements.btnMemPlus.addEventListener("click", () => {
  let savedValue = Memory.readMemory()

  if (savedValue === "") return

  operand = execOperation(operand, "+", savedValue)
  updateDisplay()
})

Elements.btnMemMinus.addEventListener("click", () => {
  let savedValue = Memory.readMemory()

  if (savedValue === "") return

  operand = execOperation(operand, "-", savedValue)
  updateDisplay()
})

function execOperation(leftOperand, operation, rightOperand) {
  if (leftOperand === "" || operation === "" || rightOperand === "") {
    throw new Error("All operation components must be not empty")
  }

  let leftNumber = parseFloat(leftOperand)
  let rightNumber = parseFloat(rightOperand)
  let result = 0

  switch (operation) {
    case "+":
      result = leftNumber + rightNumber
      break
    case "-":
      result = leftNumber - rightNumber
      break
    case "×":
      result = leftNumber * rightNumber
      break
    case "÷":
      result = leftNumber / rightNumber
      break
    case "%":
      result = leftNumber % rightNumber
      break
    default:
      throw new Error(`No operation ${operation}`)
  }

  let resultStr = result.toString()
  if (resultStr.length >= Consts.DisplayMainMaxTotalLength) {
    resultStr = result.toExponential(Consts.DisplayMainMaxSmLength)
  }

  return resultStr
}

function updateDisplay() {
  if (operand.length > Consts.DisplayMainMaxSmLength) {
    Elements.displayMain.classList.add("display-sm")
  } else {
    Elements.displayMain.classList.remove("display-sm")
  }

  Elements.displayMain.textContent = operand + operator
  Elements.displaySub.textContent = prevOperand + prevOperator
}

updateDisplay()
