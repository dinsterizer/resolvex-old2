import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'
import type { Env } from './worker.env'
import { createRateLimiter } from './worker.rate-limiter'

export function createContext({ env, ec }: { env: Env; ec: ExecutionContext }) {
  const db = drizzle(env.DB, { schema, logger: env.WORKER_ENV === 'development' })
  const rateLimiter = createRateLimiter({ don: env.RATE_LIMITER_DON })

  const firstOrCreateUser = async ({ email, name }: { email: string; name?: string }) => {
    const lowerEmail = email.toLowerCase()
    const user = await db.query.Users.findFirst({
      where(t, { eq }) {
        return eq(t.email, lowerEmail)
      },
      columns: {
        id: true,
        name: true,
        email: true,
        otp: true,
        createdAt: true,
      },
    })

    if (user) return user

    return await db
      .insert(schema.Users)
      .values({ email: lowerEmail, name: name || lowerEmail.split('@')[0] })
      .returning({
        id: schema.Users.id,
        name: schema.Users.name,
        email: schema.Users.email,
        otp: schema.Users.otp,
        createdAt: schema.Users.createdAt,
      })
      .get()
  }

  return {
    env,
    ec,
    db,
    rateLimiter,
    firstOrCreateUser,
  }
}

export type Context = ReturnType<typeof createContext>
