import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { API } from '@/config'
import { asyncRequest } from '@/domains'
import { ProductSchema, ProductListSchema, ProductSchemaInfer, ProductListSchemaInfer } from '@/schemas'

export interface ProductState {
  product: ProductSchemaInfer | null
  products: ProductListSchemaInfer | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductState = {
  product: null,
  products: null,
  status: 'idle',
  error: null,
}

export const getProduct = createAsyncThunk('product/getProduct', async (productId: number | null) => {
  const response = await asyncRequest(`${API.PRODUCTS}/${productId}`)
  const json = await response.json()

  try {
    ProductSchema.parse(json)
  } catch (error) {
    throw error
  }

  return json
})

interface GetProductsParams {
  page?: string
  perPage?: string
}

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async ({ page = '1', perPage = '10' }: GetProductsParams) => {
    const response = await asyncRequest(`${API.PRODUCTS}?page=${page}&perPage=${perPage}`)
    const json = await response.json()

    try {
      ProductListSchema.parse(json)
    } catch (error) {
      throw error
    }

    return json
  },
)

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.product = action.payload
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
      .addCase(getProducts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products = action.payload
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || null
      })
  },
})

export const { actions } = productSlice

export default productSlice.reducer
