import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  coinOpened,
  fetchCoin,
  fetchHistory,
  selectCoinStatus,
  selectCurrentCoin,
  selectHistory,
  selectPeriodChange,
} from "../store/coinSlice.js"
import { fetchCoins, selectMarketSettled } from "../store/marketSlice.js"

export function useCoin(id) {
  const dispatch = useDispatch()
  const isCurrent = useSelector((state) => state.coin.id === id)
  const coin = useSelector(selectCurrentCoin)
  const status = useSelector(selectCoinStatus)
  const days = useSelector((state) => state.coin.days)
  const history = useSelector(selectHistory)
  const change = useSelector(selectPeriodChange)
  const marketSettled = useSelector(selectMarketSettled)

  useEffect(() => {
    dispatch(coinOpened(id))
  }, [dispatch, id])

  useEffect(() => {
    dispatch(fetchCoin(id))
  }, [dispatch, id, marketSettled])

  useEffect(() => {
    dispatch(fetchHistory({ id, days }))
  }, [dispatch, id, days])

  const reload = useCallback(() => {
    dispatch(fetchCoins())
    dispatch(fetchCoin(id))
    dispatch(fetchHistory({ id, days }))
  }, [dispatch, id, days])

  return isCurrent
    ? { coin, status, days, history, change, reload }
    : {
        coin: null,
        status: "loading",
        days,
        history: undefined,
        change: null,
        reload,
      }
}
