import { configureStore } from '@reduxjs/toolkit'
import coin from './coinSlice.js'
import market from './marketSlice.js'
import notice from './noticeSlice.js'
import portfolio, { portfolioListener } from './portfolioSlice.js'

export const store = configureStore({
  reducer: { market, coin, portfolio, notice },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(portfolioListener.middleware),
})
