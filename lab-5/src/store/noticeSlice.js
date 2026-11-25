import { createSlice, isFulfilled, isRejectedWithValue } from '@reduxjs/toolkit'
import { describeError } from '../lib/errors.js'

const sourceOf = (action) => action.type.slice(0, action.type.lastIndexOf('/'))

const initialState = { message: null, source: null }

const noticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    noticeDismissed: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isRejectedWithValue, (state, action) => {
        state.message = describeError(action.payload.status)
        state.source = sourceOf(action)
      })
      .addMatcher(isFulfilled, (state, action) => (sourceOf(action) === state.source ? initialState : state))
  },
})

export const { noticeDismissed } = noticeSlice.actions

export default noticeSlice.reducer
