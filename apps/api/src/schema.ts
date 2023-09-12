import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { date, object, string } from 'valibot'
import { datetime, json } from './schema.extend'

export const Users = sqliteTable('users', {
  id: integer('id').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  otp: json(object({
    code: string(),
    expiresAt: date(),
  }), 'otp'),
  createdAt: datetime('created_at').notNull().$defaultFn(() => new Date()),
})
