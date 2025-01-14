import { rest, RestRequest } from 'msw'
import z from 'zod'

import { API } from '@/config'
import { products, carts, orders, paymentList } from '@/mocks/data'
import {
  ProductSchema,
  ProductSchemaInfer,
  OrderSchema,
  OrderSchemaInfer,
  PaymentListSchema,
  PaymentListSchemaInfer,
} from '@/schemas'

export const getProduct = (products: ProductSchemaInfer[], schema: z.ZodTypeAny) =>
  rest.get(`${API.PRODUCTS}/:id`, (req, res, ctx) => {
    const { id } = req.params
    const product = products.find((p) => p.id === Number(id))

    if (product) {
      try {
        const validatedProduct = schema.parse(product)
        return res(ctx.status(200), ctx.json(validatedProduct))
      } catch (error) {
        if (error instanceof Error) {
          return res(ctx.status(400), ctx.json({ message: error.message }))
        } else {
          return res(ctx.status(400), ctx.json({ message: String(error) }))
        }
      }
    } else {
      return res(ctx.status(404))
    }
  })

export const getProducts = (products: ProductSchemaInfer[], schema: z.ZodTypeAny) =>
  rest.get(`${API.PRODUCTS}`, (req, res, ctx) => {
    const searchParams = new URLSearchParams(req.url.search)
    const page = searchParams.get('page') as string
    const perPage = searchParams.get('perPage') as string
    const startIndex = (parseInt(page) - 1) * parseInt(perPage)
    const endIndex = startIndex + parseInt(perPage)

    try {
      const validatedProducts = products.map((product) => schema.parse(product))
      const productList = validatedProducts.slice(startIndex, endIndex)
      const totalPage = Math.ceil(products.length / parseInt(perPage))
      return res(ctx.status(200), ctx.json({ productList, totalPage }))
    } catch (error) {
      if (error instanceof Error) {
        return res(ctx.status(400), ctx.json({ message: error.message }))
      } else {
        return res(ctx.status(400), ctx.json({ message: String(error) }))
      }
    }
  })

export const createProduct = (schema: z.ZodTypeAny) =>
  rest.post(`${API.PRODUCTS}`, async (req: RestRequest<{ product: ProductSchemaInfer }>, res, ctx) => {
    const { product } = await req.json()
    try {
      const validatedProduct = schema.parse(product)
      products.push(validatedProduct)
      return res(ctx.status(201))
    } catch (error) {
      if (error instanceof Error) {
        return res(ctx.status(400), ctx.json({ message: error.message }))
      } else {
        return res(ctx.status(400), ctx.json({ message: String(error) }))
      }
    }
  })

export const createCart = (schema: z.ZodTypeAny) =>
  rest.post(`${API.CARTS}`, async (req: RestRequest<{ cart: ProductSchemaInfer }>, res, ctx) => {
    const { cart } = await req.json()
    try {
      const validatedCart = schema.parse(cart)
      carts.push(validatedCart)
      return res(ctx.status(201))
    } catch (error) {
      if (error instanceof Error) {
        return res(ctx.status(400), ctx.json({ message: error.message }))
      } else {
        return res(ctx.status(400), ctx.json({ message: String(error) }))
      }
    }
  })

export const getCarts = (carts: ProductSchemaInfer[]) =>
  rest.get(`${API.CARTS}`, (_: RestRequest, res, ctx) => {
    try {
      return res(ctx.status(200), ctx.json(carts))
    } catch (error) {
      return res(ctx.status(400), ctx.json({ message: String(error) }))
    }
  })

export const getCart = (carts: ProductSchemaInfer[], schema: z.ZodTypeAny) =>
  rest.get(`${API.CARTS}/:id`, async (req: RestRequest<{ product: ProductSchemaInfer }>, res, ctx) => {
    const { id } = req.params
    const cart = carts.find((p) => p.id === Number(id))

    if (cart) {
      try {
        const validatedCart = schema.parse(cart)
        return res(ctx.status(200), ctx.json(validatedCart))
      } catch (error) {
        if (error instanceof Error) {
          return res(ctx.status(400), ctx.json({ message: error.message }))
        } else {
          return res(ctx.status(400), ctx.json({ message: String(error) }))
        }
      }
    } else {
      return res(ctx.status(404))
    }
  })

export const deleteCartItem = (schema: z.ZodTypeAny) =>
  rest.delete(`${API.CARTS}/:id`, (req, res, ctx) => {
    const { id } = req.params
    const cartIndex = carts.findIndex((cart) => cart.id === Number(id))

    if (cartIndex !== -1) {
      const cartItem = carts[cartIndex]

      try {
        const validatedCartItem = schema.parse(cartItem)
        carts.splice(cartIndex, 1)
        return res(ctx.status(200), ctx.json(validatedCartItem))
      } catch (error) {
        if (error instanceof Error) {
          return res(ctx.status(400), ctx.json({ message: error.message }))
        } else {
          return res(ctx.status(400), ctx.json({ message: String(error) }))
        }
      }
    } else {
      return res(ctx.status(404))
    }
  })

export const deleteCartItems = (schema: z.ZodTypeAny) =>
  rest.delete(`${API.CARTS}`, async (req: RestRequest<{ ids: number[] }>, res, ctx) => {
    const { ids } = await req.json()

    try {
      const validatedCartItems = ids.map((id: number) => {
        const cartItem = carts.find((cart) => cart.id === id)
        if (!cartItem) throw new Error(`Cart item with id ${id} not found`)
        return schema.parse(cartItem)
      })

      validatedCartItems.forEach((cartItem: ProductSchemaInfer) => {
        const cartIndex = carts.findIndex((cart) => cart.id === cartItem.id)
        carts.splice(cartIndex, 1)
      })

      return res(ctx.status(200), ctx.json(validatedCartItems))
    } catch (error) {
      if (error instanceof Error) {
        return res(ctx.status(400), ctx.json({ message: error.message }))
      } else {
        return res(ctx.status(400), ctx.json({ message: String(error) }))
      }
    }
  })

export const resetAllCart = () =>
  rest.delete(`${API.CARTS}/reset`, (_, res, ctx) => {
    carts.splice(0, carts.length)
    return res(ctx.status(200))
  })

export const createOrders = (schema: z.ZodTypeAny) =>
  rest.post(`${API.ORDERS}`, async (req: RestRequest<{ order: OrderSchemaInfer[] }>, res, ctx) => {
    const { order } = await req.json()
    try {
      const validatedOrders = order.map((order: OrderSchemaInfer) => schema.parse(order))
      validatedOrders.forEach((order: OrderSchemaInfer) => orders.push(order))

      return res(ctx.status(201))
    } catch (error) {
      if (error instanceof Error) {
        return res(ctx.status(400), ctx.json({ message: error.message }))
      } else {
        return res(ctx.status(400), ctx.json({ message: String(error) }))
      }
    }
  })

const getOrders = (orders: OrderSchemaInfer[], schema: z.ZodTypeAny) =>
  rest.get(`${API.ORDERS}`, (_: RestRequest, res, ctx) => {
    try {
      const validatedOrders = orders.map((order) => schema.parse(order))
      return res(ctx.status(200), ctx.json(validatedOrders))
    } catch (error) {
      if (error instanceof Error) {
        return res(ctx.status(400), ctx.json({ message: error.message }))
      } else {
        return res(ctx.status(400), ctx.json({ message: String(error) }))
      }
    }
  })

export const deleteOrders = () =>
  rest.delete(`${API.ORDERS}`, async (_, res, ctx) => {
    try {
      orders.splice(0, orders.length)
      return res(ctx.status(200), ctx.json(orders))
    } catch (error) {
      if (error instanceof Error) {
        return res(ctx.status(400), ctx.json({ message: error.message }))
      } else {
        return res(ctx.status(400), ctx.json({ message: String(error) }))
      }
    }
  })

const createPaymentList = (schema: z.ZodTypeAny) =>
  rest.post(`${API.ORDER_LIST}`, async (req: RestRequest<{ paymentListItem: PaymentListSchemaInfer }>, res, ctx) => {
    const { paymentListItem } = await req.json()

    try {
      const validatedPaymentListItem = schema.parse(paymentListItem)
      paymentList.push(validatedPaymentListItem)
      return res(ctx.status(201))
    } catch (error) {
      if (error instanceof Error) {
        return res(ctx.status(400), ctx.json({ message: error.message }))
      } else {
        return res(ctx.status(400), ctx.json({ message: String(error) }))
      }
    }
  })

export const getPaymentList = (paymentList: PaymentListSchemaInfer[], schema: z.ZodTypeAny) =>
  rest.get(`${API.ORDER_LIST}`, (_: RestRequest, res, ctx) => {
    try {
      const validatedPaymentLists = paymentList.map((paymentList) => schema.parse(paymentList))
      return res(ctx.status(200), ctx.json(validatedPaymentLists))
    } catch (error) {
      if (error instanceof Error) {
        return res(ctx.status(400), ctx.json({ message: error.message }))
      } else {
        return res(ctx.status(400), ctx.json({ message: String(error) }))
      }
    }
  })

export const handlers = [
  getProduct(products, ProductSchema),
  getProducts(products, ProductSchema),
  createProduct(ProductSchema),
  createCart(ProductSchema),
  getCarts(carts),
  getCart(carts, ProductSchema),
  deleteCartItem(ProductSchema),
  deleteCartItems(ProductSchema),
  getOrders(orders, OrderSchema),
  createOrders(OrderSchema),
  createPaymentList(PaymentListSchema),
  getPaymentList(paymentList, PaymentListSchema),
  deleteOrders(),
  resetAllCart(),
]
