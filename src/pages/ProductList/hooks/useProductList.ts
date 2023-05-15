import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { getProducts } from '@/stores/features/product/productSlice'
import { RootState, AppDispatch } from '@/stores/store'

type NumericString = keyof Record<string, number>

const useProductList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector((state: RootState) => state.product.products)

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const pageParam = searchParams.get('page')
  const perPageParam = searchParams.get('perPage')
  const navigate = useNavigate()

  const [page, setPage] = useState(pageParam || '1')
  const [perPage, setPerPage] = useState(perPageParam || '12')

  useEffect(() => {
    dispatch(getProducts({ page, perPage }))
  }, [dispatch, page, perPage])

  useEffect(() => {
    if (pageParam) {
      setPage(pageParam)
    }

    if (perPageParam) {
      setPerPage(perPageParam)
    }
  }, [pageParam, perPageParam])

  const changePage = (newPage: NumericString) => {
    navigate(`?page=${newPage}&perPage=${perPage}`)
  }

  const changePerPage = (newPerPage: NumericString) => {
    navigate(`?page=${page}&perPage=${newPerPage}`)
  }

  const pageArray = new Array(products?.totalPage)
    .fill(null)
    .map((_, index) => ({ page: index + 1, isSelectedPage: Number(page) === index + 1 }))

  return {
    products,
    // isLoading, error,
    changePage,
    changePerPage,
    pageArray,
  }
}

export default useProductList
