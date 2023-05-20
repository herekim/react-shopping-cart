import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { rest, RestRequest } from 'msw'
import { setupServer } from 'msw/node'

import { API } from '@/config'
import { products, resetCart } from '@/mocks/data'
import { handlers } from '@/mocks/handlers'

import cartReducer, { getCartItems, addCartItem, deleteCartItem, deleteCartItems, CartState } from './cartSlice'

describe('카트의 리듀서 테스트', () => {
  let store: EnhancedStore<CartState>

  beforeEach(() => {
    store = configureStore({ reducer: cartReducer })
  })

  it('장바구니 제품들을 가져오기가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/getCartItems/fulfilled', payload: products })
    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().items).toEqual(products)
  })

  it('장바구니 제품들 가져오기가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/getCartItems/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('장바구니 제품들 가져오기가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/getCartItems/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })

  it('장바구니에 제품 추가가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/addCartItem/fulfilled', payload: { cart: products[0] } })
    expect(store.getState().items).toContainEqual({ cart: products[0] })
  })

  it('장바구니에 제품 추가가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/addCartItem/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('장바구니에 제품 추가가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/addCartItem/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })

  it('장바구니에 제품 삭제가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/addCartItem/fulfilled', payload: [products[1]] })
    store.dispatch({ type: 'cart/deleteCartItem/fulfilled', payload: products[1].id })
    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().items).not.toContainEqual(products[1])
  })

  it('장바구니에 제품 삭제가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/deleteCartItem/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('장바구니에 제품 삭제가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/deleteCartItem/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })

  it('장바구니에 제품 여러개 삭제가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/addCartItem/fulfilled', payload: products[3] })
    store.dispatch({ type: 'cart/addCartItem/fulfilled', payload: products[4] })
    store.dispatch({ type: 'cart/deleteCartItems/fulfilled', payload: [products[3].id, products[4].id] })
    expect(store.getState().items).toEqual([])
  })

  it('장바구니에 제품 여러개 삭제가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/deleteCartItems/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('장바구니에 제품 여러개 삭제가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'cart/deleteCartItems/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })
})

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterAll(() => server.close())
beforeEach(() => resetCart())
afterEach(async () => server.resetHandlers())

describe('카트의 비동기 액션', () => {
  const store = configureStore({ reducer: cartReducer })

  it('카트에 제품을 추가할 수 있다', async () => {
    await store.dispatch(addCartItem({ cart: products[0] }))
    await store.dispatch(getCartItems())

    const state = store.getState()

    expect(state.status).toEqual('succeeded')
    expect(state.items).toContainEqual(products[0])
  })

  it('카트의 제품 가져오기가 실패하면 에러를 보여준다', async () => {
    server.use(
      rest.get(`${API.CARTS}`, (_: RestRequest, res, ctx) => {
        return res(ctx.status(400))
      }),
    )
    await store.dispatch(getCartItems())

    const state = store.getState()

    expect(state.status).toEqual('failed')
    expect(state.error).toEqual('Failed to fetch data')
  })

  it('카트의 제품에서 스키마 유효성 검증을 실패하면 에러를 보여준다', async () => {
    server.use(
      rest.get(`${API.CARTS}`, (_: RestRequest, res, ctx) => {
        return res(ctx.status(200), ctx.json({ id: 0 }))
      }),
    )
    await store.dispatch(getCartItems())

    const state = store.getState()

    expect(state.status).toEqual('failed')
    expect(state.error).toEqual('Failed schema validation')
  })

  it('카트에서 특정 제품만 삭제할 수 있다', async () => {
    await store.dispatch(addCartItem({ cart: products[1] }))
    await store.dispatch(addCartItem({ cart: products[2] }))
    await store.dispatch(deleteCartItem(products[1].id))
    await store.dispatch(getCartItems())

    const state = store.getState()

    expect(state.status).toEqual('succeeded')
    expect(state.items).not.toContainEqual(products[1])
    expect(state.items).toContainEqual(products[2])
  })

  it('카트에서 여러 제품을 삭제할 수 있다', async () => {
    await store.dispatch(addCartItem({ cart: products[3] }))
    await store.dispatch(addCartItem({ cart: products[4] }))
    await store.dispatch(addCartItem({ cart: products[5] }))
    await store.dispatch(deleteCartItems([products[3].id, products[5].id]))
    await store.dispatch(getCartItems())

    const state = store.getState()

    expect(state.status).toEqual('succeeded')
    expect(state.items).not.toContainEqual(products[3])
    expect(state.items).not.toContainEqual(products[5])
    expect(state.items).toContainEqual(products[4])
  })
})
