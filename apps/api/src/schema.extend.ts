import { customType } from 'drizzle-orm/sqlite-core'
import SuperJSON from 'superjson'
import { Schema, z } from 'zod'

export function json<T extends Schema>(schema: T, ...args: Parameters<ReturnType<typeof customType>>) {
  return customType<{ data: z.infer<typeof schema> }>({
    dataType: () => 'text',
    toDriver: (value) => SuperJSON.stringify(schema.parse(value)),
    fromDriver: (value) => SuperJSON.parse(value as string),
  })(...args)
}

export const datetime = customType<{ data: Date }>({
  dataType: () => 'integer',
  toDriver: (value) => value.getTime(),
  fromDriver: (value) => new Date(value as number),
})

export const emailCol = customType<{ data: string }>({
  dataType: () => 'text',
  toDriver: (value) => z.string().parse(value),
})
