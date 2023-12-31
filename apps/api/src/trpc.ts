import { TRPCError, initTRPC } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { jwtVerify } from 'jose'
import { Buffer } from 'node:buffer'
import { z } from 'zod'
import { WorkspaceMemberRoleBaseColumn } from './schema.workspace-member'
import type { Context } from './worker.context'

export function createTRPCContext({ context }: { context: Context }) {
  const rateLimit = async (...args: Parameters<typeof context.rateLimiter.limit>) => {
    const { success } = await context.rateLimiter.limit(...args)

    if (!success) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
      })
    }
  }

  const assertMemberOfWorkspace = async ({
    workspaceId,
    userId,
    role,
  }: {
    workspaceId: string
    userId: string
    role?: WorkspaceMemberRoleBaseColumn
  }) => {
    const workspaceMember = await context.db.query.WorkspaceMembers.findFirst({
      where(t, { eq, and }) {
        return and(eq(t.workspaceId, workspaceId), eq(t.userId, userId), role ? eq(t.role, role) : undefined)
      },
    })

    if (!workspaceMember) {
      const message =
        role === 'admin' ? 'You are not an admin of this workspace' : 'You are not a member of this workspace'
      throw new TRPCError({ code: 'NOT_FOUND', message })
    }
  }

  return async (opts: FetchCreateContextFnOptions) => {
    return {
      ...context,
      ...opts,
      rateLimit,
      assertMemberOfWorkspace,
    }
  }
}

const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create({})

export const middleware = t.middleware
export const router = t.router

export const publicProcedure = t.procedure

export const authedProcedure = publicProcedure.use(
  middleware(async ({ ctx, next }) => {
    try {
      const apiKey = ctx.req.headers.get('Api-Key')!
      const { payload } = await jwtVerify(apiKey, Buffer.from(ctx.env.AUTH_SECRET))

      return next({
        ctx: {
          ...ctx,
          auth: z
            .object({
              userId: z.string(),
            })
            .parse(payload),
        },
      })
    } catch (e) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      })
    }
  }),
)
