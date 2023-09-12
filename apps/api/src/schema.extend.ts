import { customType } from 'drizzle-orm/sqlite-core'
import SuperJSON from 'superjson'
import { email, parse, string } from 'valibot'
import type { BaseSchema, Output } from 'valibot'

export function json<T extends BaseSchema>(schema: T, ...args: Parameters<ReturnType<typeof customType>>) {
  return customType<{ data: Output<typeof schema> }>({
    dataType: () => 'text',
    toDriver: value => SuperJSON.stringify(parse(schema, value)),
    fromDriver: value => SuperJSON.parse(value as string),
  })(...args)
}

export const datetime = customType<{ data: Date }>({
  dataType: () => 'integer',
  toDriver: value => value.getTime(),
  fromDriver: value => new Date(value as number),
})

export const emailCol = customType<{ data: string }>({
  dataType: () => 'text',
  toDriver: value => parse(string([email()]), value),
})
