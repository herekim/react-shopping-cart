import { Order } from '@/types'

interface OrderItemProps {
  item: Order
}

const OrderItem = ({ item }: OrderItemProps) => {
  return (
    <div className="order-container">
      <div className="flex gap-15 mt-10">
        <img className="w-144 h-144" src={`${item.imageUrl}`} alt={`${item.name}`} />
        <div className="flex-col gap-15">
          <span className="order-name">{item.name}</span>
          <span>수량: {item.quantity}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderItem