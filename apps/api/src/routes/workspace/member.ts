import { z } from 'zod'
import { WorkspaceMembers } from '../../schema'
import { workspaceMemberRoleColumnBaseSchema } from '../../schema.workspace-member'
import { authedProcedure, router } from '../../trpc'

export const workspaceMemberRouter = router({
  invite: authedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        memberEmail: z.string().email(),
        role: workspaceMemberRoleColumnBaseSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.assertMemberOfWorkspace({
        userId: ctx.auth.userId,
        workspaceId: input.workspaceId,
        role: 'admin',
      })

      const user = await ctx.firstOrCreateUser({ email: input.memberEmail })

      await ctx.db
        .insert(WorkspaceMembers)
        .values({
          workspaceId: input.workspaceId,
          userId: user.id,
          role: input.role,
        })
        .get()

      return {
        workspaceId: input.workspaceId,
      }
    }),
})
