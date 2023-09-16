import { z } from 'zod'

export const envSchema = z.object({
  WORKER_ENV: z.enum(['development', 'production']).default('production'),
  WEB_URL: z.string().url(),
  DB: z.custom<D1Database>((value) => typeof value === 'object' && value !== null),
  RATE_LIMITER_DON: z.custom<DurableObjectNamespace>((value) => typeof value === 'object' && value !== null),
  AUTH_SECRET: z.string(),
  BREVO_API_KEY: z.string(),
  BREVO_SENDER_ID: z.number().min(1),
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
})

export type Env = z.infer<typeof envSchema>
