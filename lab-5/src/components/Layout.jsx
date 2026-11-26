import { useSelector } from "react-redux"
import { Link, NavLink, Outlet, ScrollRestoration } from "react-router"
import { formatTime } from "../lib/format.js"
import Notice from "./Notice.jsx"

const navClass = ({ isActive }) =>
  `border px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? "border-ink bg-ink text-paper"
      : "border-transparent hover:border-ink"
  }`

export default function Layout() {
  const refreshing = useSelector((state) => state.market.status === "loading")
  const updatedAt = useSelector((state) => state.market.updatedAt)

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ink bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-lg font-bold tracking-[0.3em]"
          >
            <span className="h-3 w-3 bg-accent" />
            КРЕКЕР
          </Link>
          <nav className="flex gap-1">
            <NavLink to="/" end className={navClass}>
              Рынок
            </NavLink>
            <NavLink to="/portfolio" className={navClass}>
              Портфель
            </NavLink>
          </nav>
          <p
            className="ml-auto flex items-center gap-2 font-mono text-xs text-muted"
            role="status"
          >
            {refreshing && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            )}
            {refreshing
              ? "Обновление данных…"
              : updatedAt && `Обновлено в ${formatTime(updatedAt)}`}
          </p>
        </div>
        <div className="h-0.5 overflow-hidden bg-line">
          {refreshing && (
            <div className="h-full w-1/5 animate-progress bg-accent" />
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <Notice />
      <ScrollRestoration />
    </div>
  )
}
