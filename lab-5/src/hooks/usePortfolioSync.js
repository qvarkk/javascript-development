import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { STORAGE_KEY, parseTransactions } from "../lib/storage.js"
import { transactionsSynced } from "../store/portfolioSlice.js"

export function usePortfolioSync() {
  const dispatch = useDispatch()

  useEffect(() => {
    const sync = (event) => {
      if (event.storageArea !== localStorage) return
      if (event.key !== STORAGE_KEY && event.key !== null) return
      dispatch(transactionsSynced(parseTransactions(event.newValue)))
    }

    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [dispatch])
}
