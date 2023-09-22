import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { WorkspaceMembers } from '../../schema'
import { workspaceMemberRoleColumnBaseSchema } from '../../schema.workspace-member'
import { authedProcedure, router } from '../../trpc'

export const workspaceMemberRouter = router({
  invite: authedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        memberEmail: z.string().email().toLowerCase(),
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

      const existingMember = await ctx.db.query.WorkspaceMembers.findFirst({
        where(t, { eq, and }) {
          return and(eq(t.userId, user.id), eq(t.workspaceId, input.workspaceId))
        },
      })

      if (existingMember) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Member already exists',
        })
      }

      await ctx.db
        .insert(WorkspaceMembers)
        .values({
          workspaceId: input.workspaceId,
          userId: user.id,
          role: input.role,
        })
        .get()

      // TODO: email notification

      return {
        workspaceId: input.workspaceId,
      }
    }),

  update: authedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
        role: workspaceMemberRoleColumnBaseSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.assertMemberOfWorkspace({
        userId: ctx.auth.userId,
        workspaceId: input.workspaceId,
        role: 'admin',
      })

      const existingMember = await ctx.db.query.WorkspaceMembers.findFirst({
        where(t, { eq, and }) {
          return and(eq(t.userId, input.userId), eq(t.workspaceId, input.workspaceId))
        },
      })

      if (!existingMember) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Member does not exist',
        })
      }

      await ctx.db
        .update(WorkspaceMembers)
        .set({
          role: input.role,
        })
        .where(and(eq(WorkspaceMembers.userId, input.userId), eq(WorkspaceMembers.workspaceId, input.workspaceId)))
        .get()

      // TODO: email notification

      return {
        workspaceId: input.workspaceId,
      }
    }),
})
