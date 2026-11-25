import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getCoin, getHistory } from '../api/coingecko.js'
import { convert, periodChange } from '../lib/coins.js'
import { selectCoins, selectMarketSettled, selectRates } from './marketSlice.js'
import { createApiThunk, isFresh } from './thunks.js'

const HISTORY_TTL = 300_000

const initialState = {
  id: null,
  days: 1,
  amount: '1',
  detail: null,
  detailStatus: 'idle',
  history: {},
}

const isListed = (state, id) => selectCoins(state).some((coin) => coin.id === id)

export const fetchCoin = createApiThunk('coin/fetchDetail', getCoin, {
  condition: (id, { getState }) => {
    const state = getState()
    const { detailStatus } = state.coin
    return (
      state.coin.id === id &&
      selectMarketSettled(state) &&
      !isListed(state, id) &&
      detailStatus !== 'loading' &&
      detailStatus !== 'ready'
    )
  },
})

export const fetchHistory = createApiThunk(
  'coin/fetchHistory',
  async ({ id, days }) => ({ points: await getHistory(id, days), fetchedAt: Date.now() }),
  {
    condition: ({ id, days }, { getState }) => {
      const { coin } = getState()
      const entry = coin.history[days]
      return coin.id === id && entry?.status !== 'loading' && !isFresh(entry?.fetchedAt, HISTORY_TTL)
    },
  },
)

const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    coinOpened(state, { payload: id }) {
      if (state.id !== id) return { ...initialState, id, days: state.days }
    },
    daysChanged(state, { payload }) {
      state.days = payload
    },
    amountChanged(state, { payload }) {
      state.amount = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoin.pending, (state) => {
        state.detailStatus = 'loading'
      })
      .addCase(fetchCoin.fulfilled, (state, { payload, meta }) => {
        if (meta.arg !== state.id) return
        state.detail = payload
        state.detailStatus = 'ready'
      })
      .addCase(fetchCoin.rejected, (state, { payload, meta }) => {
        if (meta.arg !== state.id) return
        state.detailStatus = payload?.status === 404 ? 'missing' : 'failed'
      })
      .addCase(fetchHistory.pending, (state, { meta }) => {
        const { days } = meta.arg
        state.history[days] = { ...state.history[days], status: 'loading' }
      })
      .addCase(fetchHistory.fulfilled, (state, { payload, meta }) => {
        if (meta.arg.id !== state.id) return
        state.history[meta.arg.days] = { status: 'ready', ...payload }
      })
      .addCase(fetchHistory.rejected, (state, { meta }) => {
        const { id, days } = meta.arg
        if (id !== state.id) return
        state.history[days] = { ...state.history[days], status: 'failed' }
      })
  },
})

export const { coinOpened, daysChanged, amountChanged } = coinSlice.actions

export const selectCurrentCoin = createSelector(
  [selectCoins, (state) => state.coin.id, (state) => state.coin.detail],
  (coins, id, detail) => coins.find((coin) => coin.id === id) ?? detail,
)

export const selectCoinStatus = (state) =>
  selectCurrentCoin(state) ? 'ready' : state.coin.detailStatus

export const selectHistory = (state) => state.coin.history[state.coin.days]

export const selectPeriodChange = createSelector([selectHistory], (history) =>
  history?.points ? periodChange(history.points) : null,
)

export const selectConversion = createSelector(
  [selectCurrentCoin, (state) => state.coin.amount, selectRates],
  (coin, amount, rates) => convert(amount, coin?.price, rates),
)

export default coinSlice.reducer
