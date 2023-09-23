import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authedProcedure } from '../../trpc'

export const timelineListRouter = authedProcedure
  .input(
    z.object({
      customerId: z.string(),
      limit: z.number().min(1).max(20).optional().default(10),
      cursor: z.number().min(0).optional().default(0),
    }),
  )
  .query(async ({ ctx, input }) => {
    const customer = await ctx.db.query.Customers.findFirst({
      columns: {
        workspaceId: true,
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

    const items = await ctx.db.query.Timelines.findMany({
      columns: {
        id: true,
        createdAt: true,
        data: true,
      },
      with: {
        customerCreator: {
          columns: { id: true, name: true },
        },
        userCreator: {
          columns: { id: true, name: true, email: true },
        },
      },
      where(t, { eq }) {
        return eq(t.customerId, input.customerId)
      },
      orderBy(t, { desc }) {
        return [desc(t.createdAt), desc(t.id)]
      },
      limit: input.limit,
      offset: input.cursor,
    })

    return {
      items,
      //   nextCursor: items.length < input.limit ? null : input.cursor + input.limit,
      nextCursor: 1,
    }
  })
