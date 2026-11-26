import { Link } from "react-router"
import {
  formatAmount,
  formatMoney,
  formatShare,
  toneClass,
} from "../lib/format.js"
import Change from "./Change.jsx"
import Skeleton from "./Skeleton.jsx"

const headers = [
  "Монета",
  "Количество",
  "Средняя цена",
  "Текущая цена",
  "Стоимость",
  "PnL",
  "Доля",
]

const pending = <Skeleton className="ml-auto h-5 w-20" />

export default function PositionsTable({ positions, loading }) {
  return (
    <section className="panel overflow-x-auto">
      <h2 className="label px-4 pt-4">че в карманах</h2>
      <table className="mt-2 w-full min-w-[760px] text-sm">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={header}
                scope="col"
                className={`label px-4 py-2 ${index ? "text-right" : "text-left"}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.coinId} className="border-t border-line">
              <td className="px-4 py-3">
                <Link
                  to={`/coin/${encodeURIComponent(position.coinId)}`}
                  className="font-medium hover:text-accent"
                >
                  {position.name}
                </Link>
                <span className="ml-2 font-mono text-xs text-muted uppercase">
                  {position.symbol}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {formatAmount(position.amount)}
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {formatMoney(position.averagePrice)}
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {loading ? pending : formatMoney(position.price) || "—"}
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {loading ? pending : formatMoney(position.value) || "—"}
              </td>
              <td
                className={`px-4 py-3 text-right font-mono ${toneClass(position.pnl)}`}
              >
                {loading
                  ? pending
                  : formatMoney(position.pnl, "USD", "exceptZero") || "—"}
                <span className="block text-xs">
                  <Change value={position.pnlPercent} />
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {loading ? pending : formatShare(position.share) || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
