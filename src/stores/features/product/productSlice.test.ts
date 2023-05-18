import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { setupServer } from 'msw/node'

import { resetProduct, products } from '@/mocks/data'
import { handlers } from '@/mocks/handlers'

import productReducer, { getProduct, getProducts, ProductState } from './productSlice'

describe('상품의 리듀서 테스트', () => {
  let store: EnhancedStore<ProductState>

  beforeEach(() => {
    store = configureStore({ reducer: productReducer })
  })

  const product1 = { id: 1, name: 'Test Product', price: 1000, imageUrl: 'test-url' }
  const product2 = { id: 2, name: 'Test Product2', price: 2000, imageUrl: 'test-url2' }
  const product3 = { id: 3, name: 'Test Product3', price: 3000, imageUrl: 'test-url3' }

  it('제품 가져오기가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'product/getProduct/fulfilled', payload: product1 })
    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().product).toEqual(product1)
  })

  it('제품 가져오기가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'product/getProduct/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('제품 가져오기가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'product/getProduct/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })

  it('제품 가져오기가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'product/getProducts/fulfilled', payload: [product1, product2, product3] })
    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().products).toEqual([product1, product2, product3])
  })

  it('', () => {
    store.dispatch({ type: 'product/getProducts/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('', () => {
    store.dispatch({ type: 'product/getProducts/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })
})

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterAll(() => server.close())
beforeEach(() => resetProduct())
afterEach(async () => server.resetHandlers())

describe('제품의 비동기 액션', () => {
  const store = configureStore({ reducer: productReducer })

  it('원하는 제품을 하나 가져올 수 있다', async () => {
    await store.dispatch(getProduct(products[0].id))

    const state = store.getState()

    expect(state.status).toEqual('succeeded')
    expect(state.product).toEqual(products[0])
  })

  it('page, perPage에 알맞은 제품들을 가져올 수 있다', async () => {
    await store.dispatch(getProducts({ page: '1', perPage: '10' }))

    const state = store.getState()

    expect(state.status).toEqual('succeeded')
    expect(state.products).toEqual({
      productList: products.slice(0, 10),
      totalPage: Math.ceil(products.length / 10),
    })
  })
})
