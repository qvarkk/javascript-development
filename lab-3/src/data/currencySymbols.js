const symbolDictionary = {
  USD: "$",
  RUB: "₽",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
}

export const getCurrencySymbol = (charCode) => {
  return symbolDictionary[charCode] || charCode
}
