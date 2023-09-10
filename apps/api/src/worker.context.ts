import { drizzle } from 'drizzle-orm/d1'
import type { Env } from './worker.env'
import * as schema from './schema'

export function createContext({ env, ec }: { env: Env; ec: ExecutionContext }) {
  const db = drizzle(env.DB, { schema })

  return {
    env,
    ec,
    db,
  }
}

export type Context = ReturnType<typeof createContext>
