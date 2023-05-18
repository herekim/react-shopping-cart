import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { z } from 'zod'

import { API } from '@/config'
import { asyncRequest } from '@/domains'
import { OrderSchema, OrderSchemaInfer } from '@/schemas'

export interface OrderState {
  order: OrderSchemaInfer[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: OrderState = {
  order: [],
  status: 'idle',
  error: null,
}

interface AddOrderPayload {
  order: OrderSchemaInfer[]
}

export const getOrder = createAsyncThunk('order/getOrder', async () => {
  const response = await asyncRequest(API.ORDERS)
  const json = await response.json()

  try {
    z.array(OrderSchema).parse(json)
  } catch (error) {
    throw error
  }

  return json
})

export const createOrder = createAsyncThunk('order/createOrder', async (orders: AddOrderPayload) => {
  const response = await fetch(`${API.ORDERS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orders),
  })
  const data = await response.json()
  return data
})

export const deleteOrder = createAsyncThunk('order/deleteOrder', async (id: number) => {
  await fetch(`${API.ORDERS}/${id}`, {
    method: 'DELETE',
  })
  return id
})

export const updateOrder = createAsyncThunk('order/updateOrder', async (order: OrderSchemaInfer) => {
  const response = await fetch(`${API.ORDERS}/${order.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  })
  const data = await response.json()
  return data
})

export const deleteAllOrder = createAsyncThunk('order/deleteAllOrder', async () => {
  await fetch(`${API.ORDERS}`, {
    method: 'DELETE',
  })
})

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.order = action.payload
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.order = [...state.order, action.payload]
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
      .addCase(deleteOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.order = state.order.filter((order) => order.id !== action.payload)
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
      .addCase(updateOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const index = state.order.findIndex((order) => order.id === action.payload.id)
        state.order[index] = action.payload
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
      .addCase(deleteAllOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteAllOrder.fulfilled, (state) => {
        state.status = 'succeeded'
        state.order = []
      })
      .addCase(deleteAllOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
  },
})

export const { actions } = orderSlice

export default orderSlice.reducer
