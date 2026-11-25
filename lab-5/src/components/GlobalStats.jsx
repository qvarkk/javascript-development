import { useDispatch, useSelector } from "react-redux"
import { formatCompact, formatShare } from "../lib/format.js"
import { selectMovers, sortChanged } from "../store/marketSlice.js"
import Change from "./Change.jsx"
import StatCard, { StatCardSkeleton } from "./StatCard.jsx"

export default function GlobalStats() {
  const dispatch = useDispatch()
  const global = useSelector((state) => state.market.global)
  const globalFailed = useSelector(
    (state) => state.market.globalStatus === "failed",
  )
  const coinsFailed = useSelector((state) => state.market.status === "failed")
  const { gainer, loser } = useSelector(selectMovers)

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {global && (
        <>
          <StatCard
            label="Капитализация рынка"
            value={formatCompact(global.marketCap)}
            note={
              global.marketCapChange24h !== null && (
                <>
                  <Change value={global.marketCapChange24h} /> за 24ч
                </>
              )
            }
            hint="Сортировать ↓"
            onClick={() =>
              dispatch(sortChanged({ key: "marketCap", direction: "desc" }))
            }
          />
          <StatCard
            label="Доминирование BTC"
            value={formatShare(global.btcDominance)}
            note={
              global.ethDominance !== null &&
              `ETH ${formatShare(global.ethDominance)}`
            }
            hint="Открыть →"
            to="/coin/bitcoin"
          />
        </>
      )}
      {!global && !globalFailed && (
        <>
          <StatCardSkeleton />
          <StatCardSkeleton />
        </>
      )}
      {gainer && (
        <>
          <StatCard
            label="Легендочка · 24ч"
            value={gainer.name}
            note={<Change value={gainer.change24h} />}
            hint="Открыть →"
            to={`/coin/${encodeURIComponent(gainer.id)}`}
          />
          <StatCard
            label="Лузер · 24ч"
            value={loser.name}
            note={<Change value={loser.change24h} />}
            hint="Открыть →"
            to={`/coin/${encodeURIComponent(loser.id)}`}
          />
        </>
      )}
      {!gainer && !coinsFailed && (
        <>
          <StatCardSkeleton />
          <StatCardSkeleton />
        </>
      )}
    </section>
  )
}
