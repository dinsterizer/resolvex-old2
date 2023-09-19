import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { Workspaces } from '../../schema'
import { authedProcedure } from '../../trpc'

export const workspaceUpdateRouter = authedProcedure
  .input(
    z.object({
      workspace: z.object({
        id: z.string(),
        name: z.string(),
      }),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.assertMemberOfWorkspace({
      userId: ctx.auth.userId,
      workspaceId: input.workspace.id,
      role: 'admin',
    })

    await ctx.db
      .update(Workspaces)
      .set({
        name: input.workspace.name,
      })
      .where(eq(Workspaces.id, input.workspace.id))
      .get()

    return {
      workspaceId: input.workspace.id,
    }
  })
