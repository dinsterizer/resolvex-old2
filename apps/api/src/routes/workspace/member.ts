import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { generateWorkspaceInvitationEmail } from '../../emails/workspace-invitation'
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

      ctx.ec.waitUntil(
        (async () => {
          const inviter = await ctx.db.query.Users.findFirst({
            columns: {
              name: true,
            },
            where(t, { eq }) {
              return eq(t.id, ctx.auth.userId)
            },
          })

          const workspace = await ctx.db.query.Workspaces.findFirst({
            columns: {
              name: true,
            },
            where(t, { eq }) {
              return eq(t.id, input.workspaceId)
            },
          })

          if (!inviter || !workspace) {
            return
          }

          const { htmlContent, textContent, subject } = generateWorkspaceInvitationEmail({
            inviterName: inviter.name,
            workspaceName: workspace.name,
          })

          await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'api-key': ctx.env.BREVO_API_KEY,
              accept: 'application/json',
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              sender: {
                id: ctx.env.BREVO_SENDER_ID,
              },
              to: [{ email: input.memberEmail }],
              htmlContent,
              textContent,
              subject,
            }),
          })
        })(),
      )

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

      if (ctx.auth.userId === input.userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot update yourself from the workspace',
        })
      }

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

      return {
        workspaceId: input.workspaceId,
      }
    }),
  remove: authedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.assertMemberOfWorkspace({
        userId: ctx.auth.userId,
        workspaceId: input.workspaceId,
        role: 'admin',
      })

      if (ctx.auth.userId === input.userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot remove yourself from the workspace',
        })
      }

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
        .delete(WorkspaceMembers)
        .where(and(eq(WorkspaceMembers.userId, input.userId), eq(WorkspaceMembers.workspaceId, input.workspaceId)))
        .get()

      return {
        workspaceId: input.workspaceId,
      }
    }),
})
