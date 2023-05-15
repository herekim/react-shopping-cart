import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { CheckModal } from '@/components'
import { useModal } from '@/hooks'
import { addCartItem } from '@/stores/features/cart/cartSlice'
import { AppDispatch } from '@/stores/store'
import { Order } from '@/types'
interface OrderListItemProps {
  orderItem: Order
}

const useOrderListItem = ({ orderItem }: OrderListItemProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const navigate = useNavigate()
  const { openModal, closeModal } = useModal()

  const handleConfirmButtonClick = async () => {
    dispatch(
      addCartItem({
        cart: {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          imageUrl: orderItem.imageUrl,
        },
      }),
    )

    closeModal({ element: CheckModal })
    navigate('/cart')
  }

  const openCheckCartNavigationModal = () => {
    openModal({
      element: <CheckModal text="장바구니 목록을 확인하시겠어요?" onConfirmButtonClick={handleConfirmButtonClick} />,
    })
  }
  return { openCheckCartNavigationModal }
}

export default useOrderListItem
