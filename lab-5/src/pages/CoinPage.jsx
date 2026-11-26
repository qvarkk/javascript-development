import { useDispatch } from "react-redux"
import { Link, useParams } from "react-router"
import Change from "../components/Change.jsx"
import Converter from "../components/Converter.jsx"
import EmptyState from "../components/EmptyState.jsx"
import PriceChart from "../components/PriceChart.jsx"
import Skeleton from "../components/Skeleton.jsx"
import { useCoin } from "../hooks/useCoin.js"
import { formatCompact, formatMoney } from "../lib/format.js"
import { daysChanged } from "../store/coinSlice.js"

const timeframes = [
  { days: 1, label: "24*60 минут" },
  { days: 7, label: "~0.25 месяца" },
  { days: 30, label: "1/12 года" },
  { days: 365, label: "653 наоборот дней" },
]

function CoinHeader({ coin }) {
  if (!coin) {
    return (
      <div className="panel flex items-center gap-4 p-5">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="ml-auto h-10 w-40" />
      </div>
    )
  }

  const stats = [
    ["прайс", coin.price !== null && formatMoney(coin.price)],
    ["за 24ч", coin.change24h !== null && <Change value={coin.change24h} />],
    ["маркет кэп", coin.marketCap !== null && formatCompact(coin.marketCap)],
  ].filter(([, value]) => value)

  return (
    <header className="panel flex flex-wrap items-center gap-x-10 gap-y-4 p-5">
      <div className="flex items-center gap-4">
        {coin.image && <img src={coin.image} alt="" width="48" height="48" />}
        <div>
          <h1 className="text-2xl font-bold">{coin.name}</h1>
          <p className="font-mono text-sm text-muted uppercase">
            {coin.symbol}
            {coin.rank !== null && ` · #${coin.rank}`}
          </p>
        </div>
      </div>
      <dl className="flex flex-wrap gap-x-10 gap-y-3 sm:ml-auto">
        {stats.map(([label, value]) => (
          <div key={label}>
            <dt className="label">{label}</dt>
            <dd className="font-mono text-xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}

function ChartPanel({ days, history, change, onRetry }) {
  const dispatch = useDispatch()
  const points = history?.points

  return (
    <section className="panel p-5 lg:col-span-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex" role="group">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.days}
              type="button"
              className={`-ml-px cursor-pointer border border-ink px-3 py-1.5 font-mono text-xs transition-colors first:ml-0 ${
                timeframe.days === days
                  ? "bg-ink text-paper"
                  : "bg-white hover:bg-paper"
              }`}
              onClick={() => dispatch(daysChanged(timeframe.days))}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
        {change !== null && (
          <p className="ml-auto text-xs text-muted">
            За период: <Change value={change} />
          </p>
        )}
      </div>
      <div className="mt-4 h-80">
        {points?.length > 1 ? (
          <PriceChart points={points} days={days} />
        ) : history?.status === "failed" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-muted">
            <p>Не грузит, опять белые списки((((</p>
            <button type="button" className="button" onClick={onRetry}>
              Повторим?
            </button>
          </div>
        ) : history?.status === "ready" ? (
          <p className="flex h-full items-center justify-center text-sm text-muted">
            CoinGecko черти, нет истории цены за этот период.
          </p>
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </div>
    </section>
  )
}

export default function CoinPage() {
  const { id } = useParams()
  const { coin, status, days, history, change, reload } = useCoin(id)

  if (status === "missing") {
    return (
      <EmptyState
        title="Нет денег"
        text={`CoinGecko черти, нет коина с айди «${id}».`}
      >
        <Link to="/" className="button">
          К рынку
        </Link>
      </EmptyState>
    )
  }

  if (status === "failed") {
    return (
      <EmptyState
        title="Нет денег, не грузят"
        text="CoinGecko черти, не ответили."
      >
        <button type="button" className="button" onClick={reload}>
          Повторить
        </button>
      </EmptyState>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-block font-mono text-sm text-muted hover:text-accent"
      >
        ← Рынок
      </Link>
      <CoinHeader coin={coin} />
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <ChartPanel
          days={days}
          history={history}
          change={change}
          onRetry={reload}
        />
        {coin ? (
          <Converter symbol={coin.symbol} />
        ) : (
          <Skeleton className="h-64" />
        )}
      </div>
    </div>
  )
}
