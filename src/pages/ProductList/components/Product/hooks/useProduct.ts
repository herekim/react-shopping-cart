import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { addCartItem } from '@/stores/features/cart/cartSlice'
import { AppDispatch } from '@/stores/store'
import { Product } from '@/types'

const useProduct = () => {
  const dispatch = useDispatch<AppDispatch>()

  const navigate = useNavigate()
  const handleCartButtonClick = async (cart: Product) => {
    await dispatch(addCartItem({ cart: { ...cart } }))
    alert('장바구니에 추가되었습니다!')
  }
  const goToProductDetail = (id: number) => {
    sessionStorage.setItem('productId', id.toString())
    navigate(`/detail/${id}`)
  }
  return { handleCartButtonClick, goToProductDetail }
}

export default useProduct
