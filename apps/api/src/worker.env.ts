import { coerce, enumType, minValue, number, object, special, string, url, withDefault } from 'valibot'
import type { Output } from 'valibot'

export const envSchema = object({
  WORKER_ENV: withDefault(enumType(['development', 'production']), 'production'),
  WEB_URL: string([url()]),
  DB: special<D1Database>((i) => typeof i === 'object' && i !== null),
  RATE_LIMITER_DON: special<DurableObjectNamespace>((i) => typeof i === 'object' && i !== null),
  AUTH_SECRET: string(),
  BREVO_API_KEY: string(),
  BREVO_SENDER_ID: coerce(number([minValue(1)]), Number),
  GOOGLE_OAUTH_CLIENT_ID: string(),
  GOOGLE_OAUTH_CLIENT_SECRET: string(),
})

export type Env = Output<typeof envSchema>
