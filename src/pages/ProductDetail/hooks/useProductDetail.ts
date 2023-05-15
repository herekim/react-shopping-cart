import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useProductInfo } from '@/hooks'
import { addCartItem } from '@/stores/features/cart/cartSlice'
import { getProduct } from '@/stores/features/product/productSlice'
import { RootState, AppDispatch } from '@/stores/store'
import { Product } from '@/types'

const useProductDetail = () => {
  const dispatch = useDispatch<AppDispatch>()
  const product = useSelector((state: RootState) => state.product.product)

  const navigate = useNavigate()
  const { getProductId } = useProductInfo()

  useEffect(() => {
    if (typeof getProductId() === 'number') {
      dispatch(getProduct(getProductId()))
    }
  }, [dispatch, getProductId])

  const goToCartPage = () => {
    navigate('/cart')
  }

  const handleCartButtonClick = async (cart: Product) => {
    await dispatch(addCartItem({ cart: { ...cart } }))
    goToCartPage()
  }

  return {
    product,
    handleCartButtonClick,
    // isLoading, error
  }
}

export default useProductDetail
