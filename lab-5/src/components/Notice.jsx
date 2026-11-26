import { useDispatch, useSelector } from "react-redux"
import { noticeDismissed } from "../store/noticeSlice.js"

export default function Notice() {
  const dispatch = useDispatch()
  const message = useSelector((state) => state.notice.message)

  if (!message) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 ml-auto flex max-w-md items-start gap-3 border border-ink bg-ink p-4 text-sm text-paper shadow-[4px_4px_0_var(--color-accent)]">
      <span className="mt-1 h-2.5 w-2.5 shrink-0 bg-accent" />
      <p className="grow">{message}</p>
      <button
        type="button"
        className="-mt-1 cursor-pointer px-1 text-xl leading-none hover:text-accent"
        onClick={() => dispatch(noticeDismissed())}
      >
        ×
      </button>
    </div>
  )
}
