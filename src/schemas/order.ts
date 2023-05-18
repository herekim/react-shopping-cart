import { z } from 'zod'

export const OrderSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  quantity: z.number(),
})

export const PaymentListSchema = z.object({
  id: z.string(),
  paymentList: z.array(OrderSchema),
})

export const PaymentListsSchema = z.array(PaymentListSchema)

export type OrderSchemaInfer = z.infer<typeof OrderSchema>
export type PaymentListSchemaInfer = z.infer<typeof PaymentListSchema>
export type PaymentListsSchemaInfer = z.infer<typeof PaymentListsSchema>
