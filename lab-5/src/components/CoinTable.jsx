import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router"
import { formatCompact, formatMoney } from "../lib/format.js"
import {
  fetchCoins,
  resetFilters,
  selectVisibleCoins,
  sortChanged,
} from "../store/marketSlice.js"
import Change from "./Change.jsx"
import EmptyState from "./EmptyState.jsx"
import Skeleton from "./Skeleton.jsx"

const columns = [
  { key: "rank", label: "#", align: "text-left", width: "w-16" },
  { key: "name", label: "Монета", align: "text-left", width: "" },
  { key: "price", label: "Цена", align: "text-right", width: "w-40" },
  { key: "change24h", label: "24ч", align: "text-right", width: "w-28" },
  {
    key: "marketCap",
    label: "Капитализация",
    align: "text-right",
    width: "w-44",
  },
]

const flashClass = { up: "animate-flash-up", down: "animate-flash-down" }
const skeletonRows = Array.from({ length: 12 }, (_, index) => index)

function HeaderCell({ column, sort, onSort }) {
  const sorted = sort.key === column.key

  return (
    <th scope="col" className={`${column.width} ${column.align} p-0`}>
      <button
        type="button"
        className={`label w-full cursor-pointer px-4 py-3 whitespace-nowrap hover:text-ink ${column.align} ${sorted ? "text-ink" : ""}`}
        onClick={() => onSort(column.key)}
      >
        {column.label}
        <span className="ml-1 inline-block w-3 text-accent">
          {sorted && (sort.direction === "asc" ? "↑" : "↓")}
        </span>
      </button>
    </th>
  )
}

function CoinRow({ coin, trend, updatedAt }) {
  return (
    <tr className="border-t border-line transition-colors hover:bg-paper">
      <td className="px-4 py-3 font-mono text-muted">{coin.rank}</td>
      <td className="px-4 py-3">
        <Link
          to={`/coin/${encodeURIComponent(coin.id)}`}
          className="flex items-center gap-3 hover:text-accent"
        >
          {coin.image && (
            <img
              src={coin.image}
              alt=""
              width="24"
              height="24"
              loading="lazy"
            />
          )}
          <span className="font-medium">{coin.name}</span>
          <span className="font-mono text-xs text-muted uppercase">
            {coin.symbol}
          </span>
        </Link>
      </td>
      <td className="px-4 py-3 text-right font-mono">
        <span key={updatedAt} className={`px-1 ${flashClass[trend] ?? ""}`}>
          {formatMoney(coin.price)}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <Change value={coin.change24h} />
      </td>
      <td className="px-4 py-3 text-right font-mono">
        {formatCompact(coin.marketCap)}
      </td>
    </tr>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-t border-line">
      {columns.map((column) => (
        <td key={column.key} className="px-4 py-3">
          <Skeleton
            className={`h-5 ${column.align === "text-right" ? "ml-auto w-20" : "w-3/5"}`}
          />
        </td>
      ))}
    </tr>
  )
}

export default function CoinTable() {
  const dispatch = useDispatch()
  const coins = useSelector(selectVisibleCoins)
  const total = useSelector((state) => state.market.coins.length)
  const failed = useSelector((state) => state.market.status === "failed")
  const sort = useSelector((state) => state.market.sort)
  const trends = useSelector((state) => state.market.trends)
  const updatedAt = useSelector((state) => state.market.updatedAt)

  if (total === 0 && failed) {
    return (
      <EmptyState
        title="Не удалось загрузить рынок"
        text="CoinGecko не ответил. Мы повторим запрос автоматически, или попробуйте сами чуть позже."
      >
        <button
          type="button"
          className="button"
          onClick={() => dispatch(fetchCoins())}
        >
          Повторить
        </button>
      </EmptyState>
    )
  }

  if (total > 0 && coins.length === 0) {
    return (
      <EmptyState
        title="Ничего не найдено"
        text="Ни одна монета из топ-100 не подходит под поиск и диапазон цен."
      >
        <button
          type="button"
          className="button"
          onClick={() => dispatch(resetFilters())}
        >
          Сбросить фильтры
        </button>
      </EmptyState>
    )
  }

  return (
    <section className="panel overflow-x-auto">
      <table className="w-full min-w-[640px] table-fixed text-sm">
        <thead className="bg-paper">
          <tr>
            {columns.map((column) => (
              <HeaderCell
                key={column.key}
                column={column}
                sort={sort}
                onSort={(key) => dispatch(sortChanged({ key }))}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {total === 0
            ? skeletonRows.map((index) => <SkeletonRow key={index} />)
            : coins.map((coin) => (
                <CoinRow
                  key={coin.id}
                  coin={coin}
                  trend={trends[coin.id]}
                  updatedAt={updatedAt}
                />
              ))}
        </tbody>
      </table>
    </section>
  )
}
