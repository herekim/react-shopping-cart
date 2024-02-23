import { Pagination } from '@/components/layouts'
import { Product } from '@/pages/ProductList/components'
import { useProductList } from '@/pages/ProductList/hooks'
const ProductList = () => {
  const { products, pageArray, changePage } = useProductList()

  return (
    <>
      <a href="https://connecting.onelink.me/wLqS?af_js_web=true&af_ss_ver=2_7_3&pid=report&af_ss_ui=true&af_channel=https://hq1.appsflyer.com/">
        링크
      </a>
      <section className="product-container">
        {products?.productList?.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </section>
      <section className="pagination-container">
        <Pagination pages={pageArray} changePage={changePage} />
      </section>
    </>
  )
}

export default ProductList
