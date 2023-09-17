import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { customerStatusColumnBaseSchema } from '../../schema.customer'
import { authedProcedure } from '../../trpc'

export const customerListRouter = authedProcedure
  .input(
    z.object({
      workspaceId: z.string(),
      status: customerStatusColumnBaseSchema.optional(),
      limit: z.number().min(1).max(20).default(10),
      cursor: z.number().min(0).default(0),
    }),
  )
  .query(async ({ ctx, input }) => {
    const workspaceMember = await ctx.db.query.WorkspaceMembers.findFirst({
      where(t, { eq, and }) {
        return and(eq(t.workspaceId, input.workspaceId), eq(t.userId, ctx.auth.userId))
      },
    })

    if (!workspaceMember) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Workspace not found' })
    }

    const items = await ctx.db.query.Customers.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        status: true,
        updatedAt: true,
        workspaceId: true,
      },
      with: {
        assignedUser: {
          columns: {
            name: true,
            email: true,
          },
        },
        createdTimelines: {
          columns: {
            data: true,
          },
          limit: 1,
          orderBy(t, { desc }) {
            return [desc(t.createdAt), desc(t.id)]
          },
        },
      },
      where(t, { eq, and }) {
        return and(eq(t.workspaceId, input.workspaceId), input.status ? eq(t.status, input.status) : undefined)
      },
      orderBy(t, { desc }) {
        return [desc(t.updatedAt), desc(t.id)]
      },
      limit: input.limit,
      offset: input.cursor,
    })

    return {
      items,
      nextCursor: items.length < input.limit ? null : input.cursor + input.limit,
    }
  })
