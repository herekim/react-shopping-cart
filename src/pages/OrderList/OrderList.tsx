import { SubHeader } from '@/components'
import { OrderListItemContainer } from '@/pages/OrderList/components'

import { useOrderList } from './hooks'

const OrderList = () => {
  const { paymentList } = useOrderList()

  return (
    <section className="order-section">
      <SubHeader title="주문 목록" type="order" />
      <div className="order-list">
        {paymentList && paymentList.length > 0 ? (
          paymentList.map((payment) => (
            <OrderListItemContainer key={payment.id} title={`주문번호: ${payment.id}`} orders={payment.paymentList} />
          ))
        ) : (
          <div className="mt-40">주문 목록이 비어있습니다.</div>
        )}
      </div>
    </section>
  )
}

export default OrderList
