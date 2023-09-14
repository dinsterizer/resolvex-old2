import { TRPCError, initTRPC } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { jwtVerify } from 'jose'
import { Buffer } from 'node:buffer'
import SuperJSON from 'superjson'
import { object, parse, string } from 'valibot'
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

  return async (opts: FetchCreateContextFnOptions) => {
    return {
      ...context,
      ...opts,
      rateLimit,
    }
  }
}

const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create({
  transformer: SuperJSON,
})

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
          auth: parse(
            object({
              userId: string(),
            }),
            payload,
          ),
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
