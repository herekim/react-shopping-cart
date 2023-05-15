import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getOrders } from '@/stores/features/order/orderSlice'
import { RootState, AppDispatch } from '@/stores/store'

const useOrderList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const orderList = useSelector((state: RootState) => state.order.orders)

  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])

  return { orderList }
}

export default useOrderList
