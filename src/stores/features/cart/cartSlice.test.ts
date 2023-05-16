import { configureStore, EnhancedStore } from '@reduxjs/toolkit'

import cartReducer, { getCartItems, addCartItem, deleteCartItem, deleteCartItems, CartState } from './cartSlice'

describe('cart reducer', () => {
  let store: EnhancedStore<CartState>
  beforeEach(() => {
    store = configureStore({ reducer: cartReducer })
  })

  const product1 = { id: 1, name: 'Test Product', price: 1000, imageUrl: 'test-url' }
  const product2 = { id: 2, name: 'Test Product2', price: 2000, imageUrl: 'test-url2' }
  const product3 = { id: 3, name: 'Test Product3', price: 3000, imageUrl: 'test-url3' }

  it('should handle initial state', () => {
    expect(store.getState()).toEqual({
      items: [],
      status: 'idle',
      error: null,
    })
  })

  it('should handle getCartItems', () => {
    store.dispatch(getCartItems.fulfilled(product1, '', undefined))
    expect(store.getState()).toEqual({
      items: product1,
      status: 'succeeded',
      error: null,
    })
  })

  it('should handle addCartItem', () => {
    store.dispatch({ type: addCartItem.fulfilled, payload: { cart: product2 } })
    expect(store.getState().items).toContainEqual({ cart: product2 })
  })

  it('should handle deleteCartItem', () => {
    store.dispatch({ type: addCartItem.fulfilled, payload: [product2] })
    store.dispatch({ type: deleteCartItem.fulfilled, payload: product2.id })
    expect(store.getState().items).not.toContainEqual(product2)
  })

  it('should handle deleteCartItems', () => {
    store.dispatch({ type: addCartItem.fulfilled, payload: product2 })
    store.dispatch({ type: addCartItem.fulfilled, payload: product3 })
    store.dispatch({ type: deleteCartItems.fulfilled, payload: [product2.id, product3.id] })
    expect(store.getState().items).toEqual([])
  })
})
