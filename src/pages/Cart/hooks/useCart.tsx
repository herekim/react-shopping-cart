import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { DeleteModal, CheckModal } from '@/components/modals'
import { useModal } from '@/hooks'
import { ProductSchemaWithCheckedAndQuantityInfer } from '@/schemas'
import { getCartItems, deleteCartItems } from '@/stores/features/cart/cartSlice'
import { createOrder } from '@/stores/features/order/orderSlice'
import { RootState, AppDispatch } from '@/stores/store'

const useCart = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const cartItems = useSelector((state: RootState) => state.cart.items)

  useEffect(() => {
    dispatch(getCartItems())
  }, [dispatch])

  const [cartList, setCartList] = useState<ProductSchemaWithCheckedAndQuantityInfer[]>([])

  const { openModal, closeModal } = useModal()

  const deleteSelectedCartItems = async () => {
    const selectedCartItemIds = cartList.filter((item) => item.checked).map((item) => item.id)

    if (selectedCartItemIds.length === 0) {
      alert('삭제할 상품을 선택해주세요.')
      return
    }

    await dispatch(deleteCartItems(selectedCartItemIds))

    const unCheckedCartList = cartList.filter((item) => !item.checked)
    setCartList(unCheckedCartList)

    closeModal({ element: DeleteModal })
  }

  const updateCartListAfterDeletion = async (id: number) => {
    const unCheckedCartList = cartList.filter((item) => item.id !== id)
    setCartList(unCheckedCartList)
  }

  const openDeleteModal = () => {
    openModal({
      element: <DeleteModal onDelete={deleteSelectedCartItems} text="선택된 제품을 장바구니에서 삭제하시겠어요?" />,
    })
  }

  useEffect(() => {
    if (cartItems) {
      const newPayload = cartItems.map((cartItems) => ({ ...cartItems, checked: true, quantity: 1 }))

      setCartList(newPayload)
    }
  }, [cartItems])

  const handleQuantityChange = (id: number, quantity: number) => {
    setCartList((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          if (quantity === 0) return { ...product, quantity: 1 }
          if (quantity === 21) return { ...product, quantity: 20 }
          return { ...product, quantity }
        } else {
          return product
        }
      }),
    )
  }

  const handleCheckedChange = (id: number, checked: boolean) => {
    setCartList((prev) =>
      prev.map((cart) => {
        if (cart.id === id) {
          return { ...cart, checked: !checked }
        } else {
          return cart
        }
      }),
    )
  }

  const handleAllCheckedChange = (checked: boolean) => {
    setCartList((prev) =>
      prev.map((cart) => {
        if (checked === true) return { ...cart, checked: true }
        return { ...cart, checked: false }
      }),
    )
  }

  const totalCartPrice = cartList.reduce((acc, cur) => {
    return acc + cur.price * cur.quantity
  }, 0)

  const expectedPaymentAmount = cartList.reduce((acc, cur) => {
    if (cur.checked) {
      return acc + cur.price * cur.quantity
    } else {
      return acc
    }
  }, 0)

  const checkedCartList = cartList.filter((item) => item.checked)
  const checkedCartIds = checkedCartList.map((item) => item.id)
  const unCheckedCartList = cartList.filter((item) => !item.checked)

  const updateCartListAfterOrder = async () => {
    await dispatch(deleteCartItems(checkedCartIds))
    await dispatch(createOrder({ order: checkedCartList }))

    setCartList(unCheckedCartList)
    closeModal({ element: DeleteModal })
    navigate('/order')
  }

  const openOrderCheckModal = () => {
    openModal({
      element: <CheckModal text="선택한 상품을 주문하시겠어요?" onConfirmButtonClick={updateCartListAfterOrder} />,
    })
  }

  const checkedCartListCount = cartList.reduce((acc, cur) => {
    if (cur.checked) {
      return acc + cur.quantity
    } else {
      return acc
    }
  }, 0)

  return {
    cartList,
    // isLoading,
    // error,
    handleQuantityChange,
    handleCheckedChange,
    handleAllCheckedChange,
    totalCartPrice,
    expectedPaymentAmount,
    openDeleteModal,
    updateCartListAfterDeletion,
    checkedCartListCount,
    openOrderCheckModal,
  }
}

export default useCart
