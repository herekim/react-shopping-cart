import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { z } from 'zod'

import { API } from '@/config'
import { asyncRequest } from '@/domains'
import { ProductSchema, ProductSchemaInfer } from '@/schemas'

export interface CartState {
  items: ProductSchemaInfer[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
}

export const getCartItems = createAsyncThunk('cart/getCartItems', async () => {
  try {
    const response = await asyncRequest(API.CARTS)
    const json = await response.json()
    z.array(ProductSchema).parse(json)
    return json
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Failed schema validation')
    }
    throw new Error('Failed to fetch data')
  }
})

export interface AddCartItemPayload {
  cart: ProductSchemaInfer
}

export const addCartItem = createAsyncThunk('cart/addCartItem', async (product: AddCartItemPayload) => {
  const response = await asyncRequest(`${API.CARTS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })

  const json = await response.json()

  try {
    ProductSchema.parse(json)
  } catch (error) {
    throw error
  }

  return json
})

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, product }: { id: number; product: ProductSchemaInfer }) => {
    const response = await asyncRequest(`${API.CARTS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })

    const json = await response.json()

    try {
      ProductSchema.parse(json)
    } catch (error) {
      throw error
    }

    return json
  },
)

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (id: number) => {
  const response = await asyncRequest(`${API.CARTS}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Response was not OK')
  }

  return id
})

export const deleteCartItems = createAsyncThunk('cart/deleteCartItems', async (ids: number[]) => {
  const response = await fetch(`${API.CARTS}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  })

  if (!response.ok) {
    throw new Error('Failed to delete cart items')
  }

  return ids
})

export const resetCart = createAsyncThunk('cart/resetCart', async () => {
  const response = await fetch(`${API.CARTS}/reset`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to reset cart')
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })

      .addCase(addCartItem.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items.push(action.payload)
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
      .addCase(deleteCartItems.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.filter((item) => !action.payload.includes(item.id))
      })
      .addCase(deleteCartItems.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
      .addCase(resetCart.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(resetCart.fulfilled, (state) => {
        state.status = 'succeeded'
        state.items = []
      })
      .addCase(resetCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
  },
})

export const { actions } = cartSlice
export default cartSlice.reducer
