import type { Config } from 'drizzle-kit'
import { readFileSync } from 'fs'
import path from 'node:path'
import { join } from 'path'
import { parse } from 'toml'

const wranglerConfig = parse(readFileSync(join(__dirname, './wrangler.toml'), 'utf-8'))

const mainDbId = wranglerConfig.env.local.d1_databases.find((db: any) => db.database_name === 'main-db')
  .database_id as string

export default {
  schema: './src/schema.ts',
  out: './migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: path.resolve(__dirname, `./.wrangler/state/v3/d1/${mainDbId}/db.sqlite`),
  },
} satisfies Config
