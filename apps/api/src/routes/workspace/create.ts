import { z } from 'zod'
import { WorkspaceMembers, Workspaces } from '../../schema'
import { authedProcedure } from '../../trpc'

export const workspaceCreateRouter = authedProcedure
  .input(z.object({ name: z.string().min(1).max(100) }))
  .mutation(async ({ ctx, input }) => {
    const workspace = await ctx.db
      .insert(Workspaces)
      .values({
        name: input.name,
      })
      .returning({
        id: Workspaces.id,
      })
      .get()

    await ctx.db.insert(WorkspaceMembers).values({
      userId: ctx.auth.userId,
      workspaceId: workspace.id,
      role: 'admin',
    })

    return {
      id: workspace.id,
    }
  })
