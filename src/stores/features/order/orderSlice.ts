import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { z } from 'zod'

import { API } from '@/config'
import { asyncRequest } from '@/domains'
import { OrderSchema, OrderListSchema, OrderSchemaInfer, OrderListSchemaInfer } from '@/schemas'

interface OrderState {
  order: OrderSchemaInfer[]
  orders: OrderListSchemaInfer[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: OrderState = {
  order: [],
  orders: [],
  status: 'idle',
  error: null,
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

export const getOrders = createAsyncThunk('order/getOrders', async () => {
  const response = await asyncRequest(API.ORDER_LIST)
  const json = await response.json()

  try {
    z.array(OrderListSchema).parse(json)
  } catch (error) {
    throw error
  }

  return json
})

interface AddOrderPayload {
  orderList: OrderSchemaInfer[]
}

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

interface AddOrderListPayload {
  orderListItem: OrderListSchemaInfer
}

export const createOrderList = createAsyncThunk('order/createOrderList', async (orderList: AddOrderListPayload) => {
  const response = await fetch(`${API.ORDER_LIST}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderList),
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
      .addCase(getOrders.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.orders = action.payload
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order = [...state.order, action.payload]
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.order = state.order.filter((order) => order.id !== action.payload)
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.order.findIndex((order) => order.id === action.payload.id)
        state.order[index] = action.payload
      })
      .addCase(createOrderList.fulfilled, (state, action) => {
        state.orders = [...state.orders, action.payload]
      })
      .addCase(deleteAllOrder.fulfilled, (state) => {
        state.orders = []
      })
  },
})

export const { actions } = orderSlice

export default orderSlice.reducer
