import { z } from 'zod'

export const userOtpColumnBaseSchema = z.object({
  code: z.string(),
  expiresAt: z.number().int(),
})

export type UserOtpBaseColumn = z.infer<typeof userOtpColumnBaseSchema>
