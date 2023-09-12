import { customType } from 'drizzle-orm/sqlite-core'
import SuperJSON from 'superjson'
import { parse } from 'valibot'
import type { BaseSchema, Output } from 'valibot'

export function json<T extends BaseSchema>(schema: T, ...args: Parameters<ReturnType<typeof customType>>) {
  return customType<{ data: Output<typeof schema> }>({
    dataType: () => 'TEXT',
    toDriver: value => SuperJSON.stringify(parse(schema, value)),
    fromDriver: value => SuperJSON.parse(value as string),
  })(...args)
}

export const datetime = customType<{ data: Date }>({
  dataType: () => 'INTEGER',
  toDriver: value => value.getTime(),
  fromDriver: value => new Date(value as number),
})
