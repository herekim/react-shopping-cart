import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getPaymentList } from '@/stores/features/paymentList/paymentListSlice'
import { RootState, AppDispatch } from '@/stores/store'

const useOrderList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const paymentList = useSelector((state: RootState) => state.paymentList.paymentList)

  useEffect(() => {
    dispatch(getPaymentList())
  }, [dispatch])

  return { paymentList }
}

export default useOrderList
