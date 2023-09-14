import type { Config } from 'drizzle-kit'
import path from 'node:path'

export default {
  schema: './src/schema.ts',
  out: './migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: path.resolve(__dirname, './.wrangler/state/v3/d1/269c5104-d94e-46c7-af27-b8b1ae94ea61/db.sqlite'),
  },
} satisfies Config
