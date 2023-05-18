import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { setupServer } from 'msw/node'

import { resetPaymentList } from '@/mocks/data'
import { handlers } from '@/mocks/handlers'

import paymentListReducer, { getPaymentList, createPaymentList, PaymentListState } from './paymentListSlice'

describe('결제 리스트의 리듀서 테스트', () => {
  let store: EnhancedStore<PaymentListState>

  beforeEach(() => {
    store = configureStore({ reducer: paymentListReducer })
  })

  const paymentList1 = { id: 1, name: 'Test PaymentList', price: 1000, imageUrl: 'test-url', quantity: 1 }
  const paymentList2 = { id: 2, name: 'Test PaymentList2', price: 2000, imageUrl: 'test-url2', quantity: 2 }
  const paymentList3 = { id: 3, name: 'Test PaymentList3', price: 3000, imageUrl: 'test-url3', quantity: 3 }

  const paymentLists = [
    { id: '1', paymentList: [paymentList1, paymentList2, paymentList3] },
    { id: '2', paymentList: [paymentList1, paymentList2, paymentList3] },
    { id: '3', paymentList: [paymentList1, paymentList2, paymentList3] },
  ]

  it('결제 리스트 가져오기가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({
      type: 'paymentList/getPaymentList/fulfilled',
      payload: paymentLists,
    })
    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().paymentList).toEqual(paymentLists)
  })

  it('결제 리스트 가져오기가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'paymentList/getPaymentList/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('결제 리스트 가져오기가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'paymentList/getPaymentList/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })

  it('결제 리스트 생성하기가 fulfilled 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({
      type: 'paymentList/createPaymentList/fulfilled',
      payload: { paymentListItem: { id: '1', paymentLists: [paymentList1, paymentList2] } },
    })
    expect(store.getState().status).toEqual('succeeded')
    expect(store.getState().paymentList).toContainEqual({
      paymentListItem: { id: '1', paymentLists: [paymentList1, paymentList2] },
    })
  })

  it('결제 리스트 생성하기가 pending 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'paymentList/createPaymentList/pending' })
    expect(store.getState().status).toEqual('loading')
  })

  it('결제 리스트 생성하기가 rejected 상태일 때 정상 동작 해야 한다', () => {
    store.dispatch({ type: 'paymentList/createPaymentList/rejected', error: { message: 'Test error' } })
    expect(store.getState().status).toEqual('failed')
    expect(store.getState().error).toEqual('Test error')
  })
})

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
beforeEach(() => {
  resetPaymentList()
})
afterAll(() => server.close())

describe('결제 리스트의 비동기 테스트', () => {
  const store = configureStore({ reducer: paymentListReducer })

  const paymentItem1 = { id: 1, name: 'Test PaymentList', price: 1000, imageUrl: 'test-url', quantity: 1 }
  const paymentItem2 = { id: 2, name: 'Test PaymentList2', price: 2000, imageUrl: 'test-url2', quantity: 2 }
  const paymentItem3 = { id: 3, name: 'Test PaymentList3', price: 3000, imageUrl: 'test-url3', quantity: 3 }

  const paymentList1 = {
    id: '1',
    paymentList: [paymentItem1, paymentItem2, paymentItem3],
  }
  const paymentList2 = {
    id: '2',
    paymentList: [paymentItem1, paymentItem2, paymentItem3],
  }
  const paymentList3 = {
    id: '3',
    paymentList: [paymentItem1, paymentItem2, paymentItem3],
  }

  it('결제 리스트 가져오기가 정상 동작 해야 한다', async () => {
    await store.dispatch(createPaymentList({ paymentListItem: paymentList1 }))
    await store.dispatch(createPaymentList({ paymentListItem: paymentList2 }))
    await store.dispatch(getPaymentList())

    const state = store.getState()

    expect(state.status).toEqual('succeeded')
    expect(state.paymentList).toContainEqual(paymentList1)
    expect(state.paymentList).toContainEqual(paymentList2)
    expect(state.paymentList).not.toContainEqual(paymentList3)
  })

  it('결제 리스트 생성하기가 정상 동작 해야 한다', async () => {
    await store.dispatch(createPaymentList({ paymentListItem: paymentList1 }))
    await store.dispatch(getPaymentList())

    const state = store.getState()

    expect(state.status).toEqual('succeeded')
    expect(state.paymentList).toContainEqual(paymentList1)
  })
})
