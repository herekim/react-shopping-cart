import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as Trash } from '@/assets/trash.svg'
import { DeleteModal } from '@/components/modals'
import { useModal } from '@/hooks'
import { ProductSchemaWithCheckedAndQuantityInfer } from '@/schemas'
import { deleteCartItem as deleteCart } from '@/stores/features/cart/cartSlice'
import { RootState, AppDispatch } from '@/stores/store'

interface ItemProps {
  item: ProductSchemaWithCheckedAndQuantityInfer
  handleQuantityChange: (id: number, quantity: number) => void
  handleCheckedChange: (id: number, checked: boolean) => void
  updateCartList: (id: number) => void
}

const CartItem = ({ item, handleQuantityChange, handleCheckedChange, updateCartList }: ItemProps) => {
  const { openModal, closeModal } = useModal()

  const dispatch = useDispatch<AppDispatch>()

  useSelector((state: RootState) => state.cart)

  const deleteCartItem = async () => {
    try {
      await dispatch(deleteCart(item.id))

      updateCartList(item.id)

      closeModal({ element: DeleteModal })
    } catch (error) {
      console.error('Failed to delete cart item:', error)
    }
  }

  const openDeleteModal = (product: ProductSchemaWithCheckedAndQuantityInfer) => {
    openModal({
      element: (
        <DeleteModal onDelete={deleteCartItem} text={`장바구니에서 해당 제품을 삭제하시겠어요?`}>
          <div>{product.name}</div>
        </DeleteModal>
      ),
    })
  }

  return (
    <div className="cart-container my-20">
      <div className="flex gap-15">
        <input
          className="checkbox"
          name="checkbox"
          type="checkbox"
          checked={item.checked}
          onChange={() => handleCheckedChange(item.id, item.checked)}
        />
        <img className="card-image" src={item.imageUrl} alt={item.name} />
        <span className="cart-name">{item.name}</span>
      </div>
      <div className="flex-col justify-between items-end gap-15">
        <Trash width={25} height={25} onClick={() => openDeleteModal(item)} />
        <div className="number-input-container">
          <div className="number-input-quantity">{item.quantity}</div>
          <div>
            <button className="number-input-button" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
              ▲
            </button>
            <button className="number-input-button" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
              ▼
            </button>
          </div>
        </div>
        <span className="cart-price">{`${(item.price * item.quantity).toLocaleString()}원`}</span>
      </div>
    </div>
  )
}

export default CartItem
