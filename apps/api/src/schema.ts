import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { date, object, string } from 'valibot'
import { datetime, emailCol, json } from './schema.extend'
import { generateUserId } from './utils'

export const Users = sqliteTable('users', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateUserId()),
  name: text('name').notNull(),
  email: emailCol('email').notNull().unique(),
  otp: json(
    object({
      code: string(),
      expiresAt: date(),
    }),
    'otp',
  ),
  createdAt: datetime('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
})
