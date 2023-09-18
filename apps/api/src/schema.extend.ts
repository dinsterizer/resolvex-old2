import { customType } from 'drizzle-orm/sqlite-core'
import SuperJSON from 'superjson'
import { z } from 'zod'

export function json<T>(...args: Parameters<ReturnType<typeof customType>>) {
  return customType<{ data: T }>({
    dataType: () => 'text',
    toDriver: (value) => SuperJSON.stringify(value),
    fromDriver: (value) => SuperJSON.parse(value as string),
  })(...args)
}

export const email = customType<{ data: string }>({
  dataType: () => 'text',
  toDriver: (value) => z.string().parse(value),
})
