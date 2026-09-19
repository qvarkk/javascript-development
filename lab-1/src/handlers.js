import { DisplayMainMaxTotalLength } from "./consts"
import { notify } from "./notification"

export function handleNumberButtonClick(operandStr, digit, isDecimal) {
  let operand = parseFloat(operandStr)

  if (!Number.isFinite(operand)) {
    throw new TypeError(
      `operand should be a finite number, got ${typeof operand}`,
    )
  }

  if (digit < 0 || digit > 9 || !Number.isInteger(digit)) {
    throw new RangeError(
      `digit expected to be an integer between 0 and 9, got ${digit}`,
    )
  }

  if (isDecimal) {
    if (!operandStr.includes(".")) {
      operandStr += "."
    }
  } else {
    if (digit == 0 && operand == 0) {
      return operandStr
    } else if (operand == 0) {
      operandStr = ""
    }
  }

  let resultStr = operandStr + digit.toString()

  if (resultStr.length > DisplayMainMaxTotalLength) {
    notify(
      "Calculator error",
      `Please input ${DisplayMainMaxTotalLength} or less numbers.`,
    )
    return operandStr
  }

  return resultStr
}
