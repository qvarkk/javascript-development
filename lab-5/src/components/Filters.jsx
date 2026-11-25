import { useDispatch, useSelector } from "react-redux"
import {
  changeFilter,
  resetFilters,
  selectFiltersActive,
  selectVisibleCoins,
} from "../store/marketSlice.js"

export default function Filters() {
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.market.filters)
  const active = useSelector(selectFiltersActive)
  const shown = useSelector((state) => selectVisibleCoins(state).length)
  const total = useSelector((state) => state.market.coins.length)

  const change = (field) => (event) =>
    dispatch(changeFilter(field, event.target.value))

  return (
    <section className="panel flex flex-wrap items-end gap-4 p-4">
      <label className="grow basis-64">
        <span className="label">Поиск</span>
        <input
          type="search"
          className="field mt-1"
          placeholder="Название или тикер"
          value={filters.query}
          onChange={change("query")}
        />
      </label>
      <label className="grow basis-32 sm:grow-0">
        <span className="label">Цена от, $</span>
        <input
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          className="field mt-1"
          placeholder="0"
          value={filters.minPrice}
          onChange={change("minPrice")}
        />
      </label>
      <label className="grow basis-32 sm:grow-0">
        <span className="label">Цена до, $</span>
        <input
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          className="field mt-1"
          placeholder="∞"
          value={filters.maxPrice}
          onChange={change("maxPrice")}
        />
      </label>
      <button
        type="button"
        className="button"
        disabled={!active}
        onClick={() => dispatch(resetFilters())}
      >
        Сбросить
      </button>
      {total > 0 && (
        <p className="basis-full font-mono text-xs text-muted" role="status">
          Показано {shown} из {total}
        </p>
      )}
    </section>
  )
}
