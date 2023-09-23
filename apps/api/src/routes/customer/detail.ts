import { z } from 'zod'
import { authedProcedure } from '../../trpc'

export const customerDetailRouter = authedProcedure
  .input(
    z.object({
      customerId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    return {}
  })
