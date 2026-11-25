import {
  createListenerMiddleware,
  createSelector,
  createSlice,
  isAnyOf,
  nanoid,
} from '@reduxjs/toolkit'
import { parseDraft, summarizePortfolio, tradeTotal } from '../lib/portfolio.js'
import { loadTransactions, saveTransactions } from '../lib/storage.js'
import { selectCoins } from './marketSlice.js'

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    transactions: loadTransactions(),
    draft: { coinId: '', amount: '', price: '' },
  },
  reducers: {
    draftChanged(state, { payload }) {
      Object.assign(state.draft, payload)
    },
    transactionAdded: {
      reducer(state, { payload }) {
        state.transactions.push(payload)
        state.draft.amount = ''
      },
      prepare: (transaction) => ({
        payload: { ...transaction, id: nanoid(), createdAt: Date.now() },
      }),
    },
    transactionRemoved(state, { payload: id }) {
      state.transactions = state.transactions.filter((transaction) => transaction.id !== id)
    },
    transactionsSynced(state, { payload }) {
      state.transactions = payload
    },
  },
})

const { transactionAdded } = portfolioSlice.actions

export const { draftChanged, transactionRemoved, transactionsSynced } = portfolioSlice.actions

export const selectDraftCoin = (coinId) => (dispatch, getState) => {
  const coin = selectCoins(getState()).find((item) => item.id === coinId)
  dispatch(draftChanged({ coinId, price: coin?.price != null ? String(coin.price) : '' }))
}

export const submitDraft = () => (dispatch, getState) => {
  const state = getState()
  const transaction = parseDraft(state.portfolio.draft)
  const coin = selectCoins(state).find((item) => item.id === transaction?.coinId)
  if (!coin) return
  dispatch(transactionAdded({ ...transaction, name: coin.name, symbol: coin.symbol }))
}

export const portfolioListener = createListenerMiddleware()

portfolioListener.startListening({
  matcher: isAnyOf(transactionAdded, transactionRemoved),
  effect: (_, { getState }) => {
    saveTransactions(getState().portfolio.transactions)
  },
})

const selectTransactions = (state) => state.portfolio.transactions

export const selectDraftTransaction = createSelector(
  [(state) => state.portfolio.draft],
  parseDraft,
)

export const selectDraftTotal = createSelector([selectDraftTransaction], (transaction) =>
  transaction ? tradeTotal(transaction) : null,
)

export const selectTransactionRows = createSelector([selectTransactions], (transactions) =>
  transactions.map((transaction) => ({ ...transaction, total: tradeTotal(transaction) })).reverse(),
)

export const selectPortfolioSummary = createSelector(
  [selectTransactions, selectCoins],
  summarizePortfolio,
)

export default portfolioSlice.reducer
