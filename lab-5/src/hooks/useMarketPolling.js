import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchCoins, fetchGlobal } from "../store/marketSlice.js"

const POLL_INTERVAL = 60_000

export function useMarketPolling() {
  const dispatch = useDispatch()

  useEffect(() => {
    const refresh = () => {
      if (document.hidden) return
      dispatch(fetchCoins())
      dispatch(fetchGlobal())
    }

    refresh()
    const timer = setInterval(refresh, POLL_INTERVAL)
    document.addEventListener("visibilitychange", refresh)

    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [dispatch])
}
