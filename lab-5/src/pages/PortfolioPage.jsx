import { useSelector } from "react-redux"
import Change from "../components/Change.jsx"
import EmptyState from "../components/EmptyState.jsx"
import PortfolioPie from "../components/PortfolioPie.jsx"
import PositionsTable from "../components/PositionsTable.jsx"
import Skeleton from "../components/Skeleton.jsx"
import StatCard, { StatCardSkeleton } from "../components/StatCard.jsx"
import TransactionForm from "../components/TransactionForm.jsx"
import TransactionList from "../components/TransactionList.jsx"
import { formatMoney, toneClass } from "../lib/format.js"
import { selectMarketLoading } from "../store/marketSlice.js"
import { selectPortfolioSummary } from "../store/portfolioSlice.js"

function Portfel({ positions, loading }) {
  const priced = positions.filter((position) => position.value > 0)

  return (
    <section className="panel p-5 lg:col-span-3">
      <h2 className="label">рюкзак (портфель) 🎒</h2>
      <div className="mt-4 h-80">
        {loading ? (
          <Skeleton className="mx-auto aspect-square h-64 rounded-full" />
        ) : priced.length ? (
          <PortfolioPie positions={priced} />
        ) : (
          <p className="flex h-full items-center justify-center text-sm text-muted">
            Не прицениться, рюкзак (портфель) пуст
          </p>
        )}
      </div>
    </section>
  )
}

export default function PortfolioPage() {
  const summary = useSelector(selectPortfolioSummary)
  const empty = summary.positions.length === 0
  const loading = useSelector(selectMarketLoading)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Портфель</h1>
      <section className="grid gap-4 sm:grid-cols-3">
        {loading && !empty ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="в кармане"
              value={formatMoney(empty ? 0 : summary.value)}
              note={
                summary.unpriced > 0 &&
                `Без цены ${summary.unpriced} коина, не входят в стоимость`
              }
            />
            <StatCard label="вложили" value={formatMoney(summary.invested)} />
            <StatCard
              label="Прибыло / убыло"
              value={formatMoney(empty ? 0 : summary.pnl, "USD", "exceptZero")}
              note={<Change value={summary.pnlPercent} />}
              tone={toneClass(summary.pnl)}
            />
          </>
        )}
      </section>
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <TransactionForm />
        {empty ? (
          <EmptyState
            className="lg:col-span-3"
            title="Портфель (рюкзак) 🎒 пуст"
            text="Закупись (!!!) - здесь появятся приколы"
          />
        ) : (
          <Portfel positions={summary.positions} loading={loading} />
        )}
      </div>
      {!empty && (
        <>
          <PositionsTable positions={summary.positions} loading={loading} />
          <TransactionList />
        </>
      )}
    </div>
  )
}
