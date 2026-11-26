import { useDispatch, useSelector } from "react-redux"
import { formatAmount, formatMoney } from "../lib/format.js"
import { amountChanged, selectConversion } from "../store/coinSlice.js"

export default function Converter({ symbol }) {
  const dispatch = useDispatch()
  const amount = useSelector((state) => state.coin.amount)
  const { usd, eur, btc } = useSelector(selectConversion)

  const rows = [
    ["USD", formatMoney(usd)],
    ["EUR", formatMoney(eur, "EUR")],
    ["BTC", btc === null ? "" : `${formatAmount(btc)} BTC`],
  ]

  return (
    <section className="panel p-5">
      <h2 className="label">Конвертер</h2>
      <label className="mt-3 flex items-center border border-ink bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
        <input
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          className="w-full min-w-0 bg-transparent px-3 py-2 font-mono text-lg outline-none"
          value={amount}
          onChange={(event) => dispatch(amountChanged(event.target.value))}
        />
        <span className="px-3 font-mono text-sm text-muted uppercase">
          {symbol}
        </span>
      </label>
      <dl className="mt-3 divide-y divide-line">
        {rows.map(([code, text]) => (
          <div
            key={code}
            className="flex items-baseline justify-between gap-4 py-3"
          >
            <dt className="label">{code}</dt>
            <dd className="truncate font-mono text-lg">{text || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
