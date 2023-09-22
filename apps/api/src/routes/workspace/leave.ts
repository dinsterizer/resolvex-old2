import { TRPCError } from '@trpc/server'
import { and, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { Customers, Timelines, WorkspaceMembers, Workspaces } from '../../schema'
import { authedProcedure } from '../../trpc'

export const workspaceLeaveRouter = authedProcedure
  .input(
    z.object({
      workspaceId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.assertMemberOfWorkspace({
      userId: ctx.auth.userId,
      workspaceId: input.workspaceId,
    })

    const members = await ctx.db.query.WorkspaceMembers.findMany({
      where(t, { eq }) {
        return eq(t.workspaceId, input.workspaceId)
      },
    })

    if (members.length === 1) {
      await ctx.db
        .delete(Timelines)
        .where(
          inArray(
            Timelines.id,
            ctx.db
              .select({
                id: Timelines.id,
              })
              .from(Timelines)
              .innerJoin(Customers, eq(Timelines.customerId, Customers.id))
              .where(eq(Customers.workspaceId, input.workspaceId)),
          ),
        )
        .get()
      await ctx.db.delete(Customers).where(eq(Customers.workspaceId, input.workspaceId)).get()
      await ctx.db.delete(Workspaces).where(eq(Workspaces.id, input.workspaceId)).get()
    } else {
      const otherAdmins = members.filter((member) => member.role === 'admin' && member.userId !== ctx.auth.userId)

      if (otherAdmins.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Please make someone else an admin before leaving or remove other members out before leaving',
        })
      }
    }

    await ctx.db
      .delete(WorkspaceMembers)
      .where(and(eq(WorkspaceMembers.workspaceId, input.workspaceId), eq(WorkspaceMembers.userId, ctx.auth.userId)))
      .get()

    return {
      workspaceId: input.workspaceId,
    }
  })
