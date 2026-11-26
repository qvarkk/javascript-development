export default function EmptyState({ title, text, children, className = "" }) {
  return (
    <div
      className={`panel flex flex-col items-center justify-center gap-3 px-6 py-14 text-center ${className}`}
    >
      <span className="font-mono text-4xl text-line">∅🥸∅</span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {text && <p className="max-w-md text-sm text-muted">{text}</p>}
      {children}
    </div>
  )
}
