import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getGlobal, getMarkets } from '../api/coingecko.js'
import { filterCoins, findMovers, priceTrends, sortCoins } from '../lib/coins.js'
import { debounce } from '../lib/debounce.js'
import { createApiThunk, isFresh } from './thunks.js'

const COINS_TTL = 30_000
const GLOBAL_TTL = 300_000
const FILTER_DELAY = 300
const ASCENDING_KEYS = ['rank', 'name']

const emptyFilters = { query: '', minPrice: '', maxPrice: '' }

const initialState = {
  coins: [],
  status: 'idle',
  updatedAt: null,
  trends: {},
  global: null,
  globalStatus: 'idle',
  globalUpdatedAt: null,
  filters: emptyFilters,
  appliedFilters: emptyFilters,
  sort: { key: 'rank', direction: 'asc' },
}

export const fetchCoins = createApiThunk(
  'market/fetchCoins',
  async () => ({ coins: await getMarkets(), updatedAt: Date.now() }),
  {
    condition: (_, { getState }) => {
      const { status, updatedAt } = getState().market
      return status !== 'loading' && !isFresh(updatedAt, COINS_TTL)
    },
  },
)

export const fetchGlobal = createApiThunk(
  'market/fetchGlobal',
  async () => ({ global: await getGlobal(), updatedAt: Date.now() }),
  {
    condition: (_, { getState }) => {
      const { globalStatus, globalUpdatedAt } = getState().market
      return globalStatus !== 'loading' && !isFresh(globalUpdatedAt, GLOBAL_TTL)
    },
  },
)

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    filterChanged(state, { payload: { field, value } }) {
      state.filters[field] = value
    },
    filtersApplied(state) {
      state.appliedFilters = { ...state.filters }
    },
    filtersReset(state) {
      state.filters = emptyFilters
      state.appliedFilters = emptyFilters
    },
    sortChanged(state, { payload: { key, direction } }) {
      const flipped = state.sort.direction === 'asc' ? 'desc' : 'asc'
      const initial = ASCENDING_KEYS.includes(key) ? 'asc' : 'desc'
      state.sort = { key, direction: direction ?? (state.sort.key === key ? flipped : initial) }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCoins.fulfilled, (state, { payload }) => {
        state.trends = priceTrends(state.coins, payload.coins)
        state.coins = payload.coins
        state.updatedAt = payload.updatedAt
        state.status = 'ready'
      })
      .addCase(fetchCoins.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(fetchGlobal.pending, (state) => {
        state.globalStatus = 'loading'
      })
      .addCase(fetchGlobal.fulfilled, (state, { payload }) => {
        state.global = payload.global
        state.globalUpdatedAt = payload.updatedAt
        state.globalStatus = 'ready'
      })
      .addCase(fetchGlobal.rejected, (state) => {
        state.globalStatus = 'failed'
      })
  },
})

const { filterChanged, filtersApplied, filtersReset } = marketSlice.actions

export const { sortChanged } = marketSlice.actions

const applyFilters = debounce((dispatch) => dispatch(filtersApplied()), FILTER_DELAY)

export const changeFilter = (field, value) => (dispatch) => {
  dispatch(filterChanged({ field, value }))
  applyFilters(dispatch)
}

export const resetFilters = () => (dispatch) => {
  applyFilters.cancel()
  dispatch(filtersReset())
}

export const selectCoins = (state) => state.market.coins

export const selectVisibleCoins = createSelector(
  [selectCoins, (state) => state.market.appliedFilters, (state) => state.market.sort],
  (coins, filters, sort) => sortCoins(filterCoins(coins, filters), sort),
)

export const selectMovers = createSelector([selectCoins], findMovers)

export const selectRates = createSelector(
  [selectCoins, (state) => state.market.global],
  (coins, global) => {
    const bitcoin = coins.find((coin) => coin.id === 'bitcoin')
    return { eur: global?.eurRate ?? null, btc: bitcoin?.price ? 1 / bitcoin.price : null }
  },
)

export const selectFiltersActive = (state) =>
  Object.values(state.market.filters).some((value) => value !== '')

export const selectMarketSettled = (state) =>
  state.market.coins.length > 0 || state.market.status === 'failed'

export const selectMarketLoading = (state) => !selectMarketSettled(state)

export default marketSlice.reducer
