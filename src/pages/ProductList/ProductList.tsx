import { Pagination } from '@/components/layouts'
import { Product } from '@/pages/ProductList/components'
import { useProductList } from '@/pages/ProductList/hooks'
const ProductList = () => {
  const { products, pageArray, changePage } = useProductList()

  return (
    <>
      <div className="flex-col-center gap-10">
        <a href="https://connecting.onelink.me/wLqS?af_js_web=true&af_ss_ver=2_7_3&pid=report&deep_link_value=reportAnalysis&af_dp=connectingapp%3A%2F%2F&af_force_deeplink=true&af_ss_ui=true&af_channel=https://hq1.appsflyer.com/">
          링크 wLqS (URI Scheme)
        </a>
        <a href="https://connecting.onelink.me/wLqS?af_js_web=true&af_ss_ver=2_7_3&pid=report&deep_link_value=reportAnalysis&af_ss_ui=true&af_channel=https://hq1.appsflyer.com/">
          링크 wLqS
        </a>
        <a href="https://connecting.onelink.me/Jd5O?af_js_web=true&af_ss_ver=2_7_3&pid=report&af_ss_ui=true&af_channel=https://hq1.appsflyer.com/">
          링크 Jd50
        </a>
        <a href="https://connecting.onelink.me/Og0z?af_js_web=true&af_ss_ver=2_7_3&pid=report&af_ss_ui=true&af_channel=https://hq1.appsflyer.com/">
          링크 Og0z
        </a>
      </div>

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
