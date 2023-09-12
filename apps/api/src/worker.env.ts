import { enumType, object, special, string, url, withDefault } from 'valibot'
import type { Output } from 'valibot'

export const envSchema = object({
  WORKER_ENV: withDefault(enumType(['development', 'production']), 'production'),
  WEB_URL: string([url()]),
  DB: special<D1Database>(i => typeof i === 'object' && i !== null),
  AUTH_SECRET: string(),
})

export type Env = Output<typeof envSchema>
