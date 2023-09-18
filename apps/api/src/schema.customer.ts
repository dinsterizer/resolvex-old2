import { z } from 'zod'

export const customerStatusColumnAllowValues = ['waiting', 'helping', 'helped', 'spam'] as const
export const customerStatusColumnBaseSchema = z.enum(customerStatusColumnAllowValues)

export type CustomerStatusBaseColumn = z.infer<typeof customerStatusColumnBaseSchema>
