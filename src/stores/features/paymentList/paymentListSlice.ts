import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { z } from 'zod'

import { API } from '@/config'
import { asyncRequest } from '@/domains'
import { PaymentListSchema, PaymentListSchemaInfer } from '@/schemas'

export interface PaymentListState {
  paymentList: PaymentListSchemaInfer[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: PaymentListState = {
  paymentList: [],
  status: 'idle',
  error: null,
}

interface AddPaymentListPayload {
  paymentListItem: PaymentListSchemaInfer
}

export const getPaymentList = createAsyncThunk('paymentList/getPaymentList', async () => {
  const response = await asyncRequest(API.ORDER_LIST)
  const json = await response.json()

  try {
    z.array(PaymentListSchema).parse(json)
  } catch (error) {
    throw error
  }

  return json
})

export const createPaymentList = createAsyncThunk(
  'paymentList/createPaymentList',
  async (payment: AddPaymentListPayload) => {
    const response = await fetch(`${API.ORDER_LIST}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    })
    const data = await response.json()
    return data
  },
)

const paymentList = createSlice({
  name: 'paymentList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentList.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getPaymentList.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.paymentList = action.payload
      })
      .addCase(getPaymentList.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
      .addCase(createPaymentList.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.paymentList = [...state.paymentList, action.payload]
      })
      .addCase(createPaymentList.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
      .addCase(createPaymentList.pending, (state) => {
        state.status = 'loading'
      })
  },
})

export const { actions } = paymentList

export default paymentList.reducer
