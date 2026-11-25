import { createAsyncThunk } from '@reduxjs/toolkit'
import { NETWORK_ERROR } from '../api/coingecko.js'

export const createApiThunk = (type, call, options) =>
  createAsyncThunk(
    type,
    async (arg, { rejectWithValue }) => {
      try {
        return await call(arg)
      } catch (error) {
        return rejectWithValue({ status: error.status ?? NETWORK_ERROR })
      }
    },
    options,
  )

export const isFresh = (timestamp, ttl) => timestamp != null && Date.now() - timestamp < ttl
