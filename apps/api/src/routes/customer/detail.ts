import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authedProcedure } from '../../trpc'

export const customerDetailRouter = authedProcedure
  .input(
    z.object({
      customerId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const customer = await ctx.db.query.Customers.findFirst({
      columns: {
        id: true,
        name: true,
        email: true,
        status: true,
        updatedAt: true,
        createdAt: true,
        workspaceId: true,
      },
      with: {
        assignedUser: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      where(t, { eq }) {
        return eq(t.id, input.customerId)
      },
    })

    if (!customer) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Customer not found',
      })
    }

    await ctx.assertMemberOfWorkspace({
      userId: ctx.auth.userId,
      workspaceId: customer.workspaceId,
    })

    return {
      customer,
    }
  })
