import { z } from 'zod'

export const userOtpColumnBaseSchema = z.object({
  code: z.string(),
  expiresAt: z.date(),
})

export type UserOtpBaseColumn = z.infer<typeof userOtpColumnBaseSchema>
