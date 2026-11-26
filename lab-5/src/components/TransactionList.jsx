import { useDispatch, useSelector } from "react-redux"
import { formatAmount, formatDate, formatMoney } from "../lib/format.js"
import {
  selectTransactionRows,
  transactionRemoved,
} from "../store/portfolioSlice.js"

const headers = ["дата", "коин", "количество", "цена покупки", "сумма"]

export default function TransactionList() {
  const dispatch = useDispatch()
  const transactions = useSelector(selectTransactionRows)

  return (
    <section className="panel overflow-x-auto">
      <h2 className="label px-4 pt-4">покупочки</h2>
      <table className="mt-2 w-full min-w-[640px] text-sm">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={header}
                scope="col"
                className={`label px-4 py-2 ${index > 1 ? "text-right" : "text-left"}`}
              >
                {header}
              </th>
            ))}
            {/* столбец для крестика */}
            <th scope="col" className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-line">
              <td className="px-4 py-3 font-mono text-muted">
                {formatDate(transaction.createdAt)}
              </td>
              <td className="px-4 py-3">
                <span className="font-medium">{transaction.name}</span>
                <span className="ml-2 font-mono text-xs text-muted uppercase">
                  {transaction.symbol}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {formatAmount(transaction.amount)}
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {formatMoney(transaction.price)}
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {formatMoney(transaction.total)}
              </td>
              <td className="px-2 py-3 text-center">
                <button
                  type="button"
                  className="cursor-pointer px-2 text-lg leading-none text-muted hover:text-down"
                  onClick={() => dispatch(transactionRemoved(transaction.id))}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
