import { customType } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

export const email = customType<{ data: string }>({
  dataType: () => 'text',
  toDriver: (value) => z.string().parse(value),
})
