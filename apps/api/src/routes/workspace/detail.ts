import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authedProcedure } from '../../trpc'

export const workspaceDetailRouter = authedProcedure
  .input(
    z.object({
      workspaceId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    await ctx.assertMemberOfWorkspace({
      userId: ctx.auth.userId,
      workspaceId: input.workspaceId,
    })

    const workspace = await ctx.db.query.Workspaces.findFirst({
      columns: {
        id: true,
        name: true,
      },
      with: {
        members: true,
      },
      where(t, { eq }) {
        return eq(t.id, input.workspaceId)
      },
    })

    if (!workspace) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found',
      })
    }

    return {
      workspace,
    }
  })
