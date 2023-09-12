import { Buffer } from 'node:buffer'
import { TRPCError, initTRPC } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import SuperJSON from 'superjson'
import { jwtVerify } from 'jose'
import { object, parse, string } from 'valibot'
import type { Context } from './worker.context'

export function createTRPCContext({ context }: { context: Context }) {
  return async (opts: FetchCreateContextFnOptions) => {
    return {
      ...context,
      ...opts,
    }
  }
}

const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create({
  transformer: SuperJSON,
})

export const middleware = t.middleware
export const router = t.router

export const publicProcedure = t.procedure

export const authedProcedure = publicProcedure.use(middleware(async ({ ctx, next }) => {
  try {
    const apiKey = ctx.req.headers.get('Api-Key')!
    const { payload } = await jwtVerify(apiKey, Buffer.from(ctx.env.AUTH_SECRET))

    return next({
      ctx: {
        ...ctx,
        auth: parse(object({
          userId: string(),
        }), payload),
      },
    })
  }
  catch (e) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    })
  }
}))
