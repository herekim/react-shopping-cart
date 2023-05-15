import { configureStore } from '@reduxjs/toolkit'

import cartReducer from '@/stores/features/cart/cartSlice'
import orderReducer from '@/stores/features/order/orderSlice'
import productReducer from '@/stores/features/product/productSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
    product: productReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
