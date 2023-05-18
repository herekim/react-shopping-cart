import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { setupServer } from 'msw/node'

import { resetOrder } from '@/mocks/data'
import { handlers } from '@/mocks/handlers'

import OrderReducer, { getOrder, createOrder, deleteAllOrder, OrderState } from './orderSlice'

describe('주문의 리듀서 테스트', () => {
  let store: EnhancedStore<OrderState>

  beforeEach(() => {
    store = configureStore({ reducer: OrderReducer })
  })

  const order1 = {
    id: 1,
    name: 'test1',
    price: 1000,
    imageUrl: 'test-url1',
    checked: true,
    quantity: 1,
  }

  const order2 = {
    id: 2,
    name: 'test2',
    price: 2000,
    imageUrl: 'test-url2',
    checked: true,
    quantity: 2,
  }

  const order3 = {
    id: 3,
    name: 'test3',
    price: 3000,
    imageUrl: 'test-url3',
    checked: true,
    quantity: 3,
  }

  const orders = [order1, order2, order3]

  it('주문 제품들을 가져오기가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/getOrder/fulfilled', payload: orders })

    const state = store.getState()
    expect(state.status).toEqual('succeeded')
    expect(state.order).toEqual(orders)
  })

  it('주문 제품들 가져오기가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/getOrder/pending' })

    const state = store.getState()
    expect(state.status).toEqual('loading')
  })

  it('주문 제품들 가져오기가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/getOrder/rejected', error: { message: 'Test error' } })

    const state = store.getState()
    expect(state.status).toEqual('failed')
    expect(state.error).toEqual('Test error')
  })

  it('주문 제품 추가가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/createOrder/fulfilled', payload: { order: orders } })
    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().order).toContainEqual({ order: orders })
  })

  it('주문 제품 추가가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/createOrder/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('주문 제품 추가가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/createOrder/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })

  it('주문 제품 삭제가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/deleteOrder/fulfilled', payload: 1 })
    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().order).toEqual([])
  })

  it('주문 제품 삭제가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/deleteOrder/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('주문 제품 삭제가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/deleteOrder/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })

  it('주문 제품 전체 삭제가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/deleteAllOrder/fulfilled' })
    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().order).toEqual([])
  })

  it('주문 제품 전체 삭제가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/deleteAllOrder/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('주문 제품 전체 삭제가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'order/deleteAllOrder/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })
})

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
beforeEach(() => resetOrder())
afterAll(() => server.close())

describe('주문의 비동기 테스트', () => {
  const store = configureStore({ reducer: OrderReducer })

  const order1 = {
    id: 1,
    name: 'test1',
    price: 1000,
    imageUrl: 'test-url1',
    quantity: 1,
  }

  const order2 = {
    id: 2,
    name: 'test2',
    price: 2000,
    imageUrl: 'test-url2',
    quantity: 2,
  }

  const order3 = {
    id: 3,
    name: 'test3',
    price: 3000,
    imageUrl: 'test-url3',
    quantity: 3,
  }

  it('주문 제품들을 가져오기가 정상 동작 해야 한다', async () => {
    await store.dispatch(createOrder({ order: [order1, order2] }))
    await store.dispatch(getOrder())

    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().order).toContainEqual(order1)
    expect(store.getState().order).toContainEqual(order2)
    expect(store.getState().order).not.toContainEqual(order3)
  })

  it('주문 제품 추가가 정상 동작 해야 한다', async () => {
    await store.dispatch(createOrder({ order: [order3] }))
    await store.dispatch(getOrder())

    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().order).not.toContainEqual(order1)
    expect(store.getState().order).toContainEqual(order3)
  })

  it('주문 제품 전체 삭제가 정상 동작 해야 한다', async () => {
    await store.dispatch(createOrder({ order: [order1, order2, order3] }))
    await store.dispatch(deleteAllOrder())
    await store.dispatch(getOrder())

    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().order).toEqual([])
  })
})
