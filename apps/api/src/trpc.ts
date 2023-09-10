import { initTRPC } from '@trpc/server'
import { once } from 'lodash-es'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import type { Context } from './worker.context'

export function createTRPCContext({ context }: { context: Context }) {
  return async (opts: FetchCreateContextFnOptions) => {
    return {
      ...context,
      ...opts,
    }
  }
}

const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create()

export const middleware = t.middleware
export const router = t.router

export const queryDuplications = new Map<string, any>()
export const publicProcedure = t.procedure.use(middleware((opts) => {
  if (opts.type !== 'query')
    return opts.next({ ctx: opts.ctx })

  const key = `${opts.path}::${JSON.stringify(opts.rawInput)}`

  if (!queryDuplications.has(key)) {
    queryDuplications.set(key, once(() => opts.next({
      ctx: opts.ctx,
    })))
  }

  return queryDuplications.get(key)()
}))
