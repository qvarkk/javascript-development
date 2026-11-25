import { Link } from 'react-router'
import Skeleton from './Skeleton.jsx'

const interactive =
  'cursor-pointer text-left transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-accent)]'

export default function StatCard({ label, value, note, hint, to, onClick, tone = '' }) {
  const Tag = to ? Link : onClick ? 'button' : 'div'
  const action = to ? { to } : onClick ? { type: 'button', onClick } : {}

  return (
    <Tag {...action} className={`panel flex min-w-0 flex-col gap-1 p-4 ${to || onClick ? interactive : ''}`}>
      <span className="label">{label}</span>
      <span className={`truncate font-mono text-xl font-bold sm:text-2xl ${tone}`}>{value || '—'}</span>
      <span className="flex min-h-5 items-center justify-between gap-2 text-xs text-muted">
        <span>{note}</span>
        {hint && <span className="hidden font-mono text-accent sm:inline">{hint}</span>}
      </span>
    </Tag>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="panel flex flex-col gap-2 p-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-40 max-w-full" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}
