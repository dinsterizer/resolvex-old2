import { drizzle } from 'drizzle-orm/d1'
import type { Env } from './worker.env'
import * as schema from './schema'
import { createRateLimiter } from './worker.rate-limiter'

export function createContext({ env, ec }: { env: Env; ec: ExecutionContext }) {
  const db = drizzle(env.DB, { schema, logger: env.WORKER_ENV === 'development' })
  const rateLimiter = createRateLimiter({ don: env.RATE_LIMITER_DON })

  return {
    env,
    ec,
    db,
    rateLimiter,
  }
}

export type Context = ReturnType<typeof createContext>
