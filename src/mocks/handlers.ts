import { rest, RestRequest } from 'msw'

import { ProductType } from '@/types'

const products: ProductType[] = [
  {
    id: 0,
    src: '/assets/images/product.png',
    name: 'PET보틀-정사각(420ml)',
    price: 43000,
  },
  {
    id: 1,
    src: '/assets/images/product.png',
    name: 'PET보틀-정사각(420ml)',
    price: 43000,
  },
  {
    id: 2,
    src: '/assets/images/product.png',
    name: 'PET보틀-정사각(420ml)',
    price: 43000,
  },
  {
    id: 3,
    src: '/assets/images/product.png',
    name: 'PET보틀-정사각(420ml)',
    price: 43000,
  },
  {
    id: 4,
    src: '/assets/images/product.png',
    name: 'PET보틀-정사각(420ml)',
    price: 43000,
  },
  {
    id: 5,
    src: '/assets/images/product.png',
    name: 'PET보틀-정사각(420ml)',
    price: 43000,
  },
  {
    id: 6,
    src: '/assets/images/product.png',
    name: 'PET보틀-정사각(420ml)',
    price: 43000,
  },
  {
    id: 7,
    src: '/assets/images/product.png',
    name: 'PET보틀-정사각(420ml)',
    price: 43000,
  },
  {
    id: 8,
    src: '/assets/images/product.png',
    name: 'PET보틀-정사각(420ml)',
    price: 43000,
  },
]

export const handlers = [
  // 상품목록
  rest.get(`${process.env.REACT_APP_API_URL}/products`, (_: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(products))
  }),

  // 상품목록 추가
  rest.post(`${process.env.REACT_APP_API_URL}/products`, (req: RestRequest<{ product: ProductType }>, res, ctx) => {
    const product = req.body.product
    products.push(product)
    return res(ctx.status(201))
  }),

  // 상품 하나 가져오기
  rest.get(`${process.env.REACT_APP_API_URL}/products/:id`, (req, res, ctx) => {
    const { id } = req.params
    const product = products.find((p) => p.id === Number(id))

    if (product) {
      return res(ctx.status(200), ctx.json(product))
    } else {
      return res(ctx.status(404))
    }
  }),
]