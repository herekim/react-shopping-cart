import { usePayssion } from 'payssion'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import uuid from 'react-uuid'

import { CheckModal } from '@/components'
// import { API } from '@/config'
import { useModal } from '@/hooks'
import { getOrder, createOrderList, deleteAllOrder } from '@/stores/features/order/orderSlice'
import { RootState, AppDispatch } from '@/stores/store'

const useOrder = () => {
  const navigate = useNavigate()
  const { openModal, closeModal } = useModal()
  const { initiatePayment } = usePayssion()
  const dispatch = useDispatch<AppDispatch>()
  const orders = useSelector((state: RootState) => state.order.order)

  useEffect(() => {
    dispatch(getOrder())
  }, [dispatch])

  const onSuccessAction = async () => {
    await dispatch(
      createOrderList({
        orderListItem: {
          orderListId: uuid(),
          orders,
        },
      }),
    )
    await dispatch(deleteAllOrder())
    navigate('/order-list')
  }

  const handleConfirmButtonClick = (amount: number) => {
    closeModal({ element: CheckModal })
    initiatePayment({ amount, onSuccessAction })
  }

  const openPaymentCheckModal = (price: number) => {
    openModal({
      element: (
        <CheckModal text="주문 목록을 결제하시겠어요?" onConfirmButtonClick={() => handleConfirmButtonClick(price)} />
      ),
    })
  }

  const totalOrderPrice = orders?.reduce((acc, cur) => {
    return acc + cur.price * cur.quantity
  }, 0)

  const totalOrderQuantity = orders?.reduce((acc, cur) => {
    return acc + cur.quantity
  }, 0)

  return {
    orders,
    // isLoading, error,
    totalOrderPrice,
    totalOrderQuantity,
    openPaymentCheckModal,
  }
}

export default useOrder
