import { useDispatch, useSelector } from "react-redux"
import { formatMoney } from "../lib/format.js"
import { selectCoins, selectMarketLoading } from "../store/marketSlice.js"
import {
  draftChanged,
  selectDraftCoin,
  selectDraftTotal,
  selectDraftTransaction,
  submitDraft,
} from "../store/portfolioSlice.js"
import Skeleton from "./Skeleton.jsx"

export default function TransactionForm() {
  const dispatch = useDispatch()
  const coins = useSelector(selectCoins)
  const loading = useSelector(selectMarketLoading)
  const draft = useSelector((state) => state.portfolio.draft)
  const valid = useSelector((state) => selectDraftTransaction(state) !== null)
  const total = useSelector(selectDraftTotal)

  const submit = (event) => {
    event.preventDefault()
    dispatch(submitDraft())
  }

  return (
    <form className="panel space-y-4 p-5 lg:col-span-2" onSubmit={submit}>
      <h2 className="label">покупочка</h2>
      <label className="block">
        <span className="label">коин</span>
        {loading ? (
          <Skeleton className="mt-1 h-10" />
        ) : (
          <select
            className="field mt-1"
            required
            disabled={coins.length === 0}
            value={draft.coinId}
            onChange={(event) => dispatch(selectDraftCoin(event.target.value))}
          >
            <option value="" disabled>
              {coins.length ? "Выберите монету" : "Список монет недоступен"}
            </option>
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        )}
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="label">Количество</span>
          <input
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            required
            className="field mt-1"
            placeholder="0.5"
            value={draft.amount}
            onChange={(event) =>
              dispatch(draftChanged({ amount: event.target.value }))
            }
          />
        </label>
        <label className="block">
          <span className="label">Цена, $</span>
          <input
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            required
            className="field mt-1"
            placeholder="0.00"
            value={draft.price}
            onChange={(event) =>
              dispatch(draftChanged({ price: event.target.value }))
            }
          />
        </label>
      </div>
      <p className="flex justify-between text-sm text-muted">
        Тратим
        <span className="font-mono text-ink">{formatMoney(total) || "—"}</span>
      </p>
      <button type="submit" className="button w-full" disabled={!valid}>
        Покупаем
      </button>
    </form>
  )
}
