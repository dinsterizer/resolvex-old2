import { maxValue, minValue, number, object, withDefault, nullish } from 'valibot'
import { authedProcedure } from '../../trpc'

export const workspaceListRouter = authedProcedure
  .input(
    object({
      limit: withDefault(nullish(number([minValue(0), maxValue(20)])), 10),
      cursor: withDefault(number([minValue(0)]), 0),
    }),
  )
  .query(({ input, ctx }) => {
    const limit = input.limit!

    let items = [
      {
        id: '1',
        name: 'My Workspace',
        members: [
          {
            name: 'John Doe 1',
            email: '1johndo@gmail.com',
          },
          {
            name: 'John Doe 2',
            email: '2johndo@gmail.com',
          },
          {
            name: 'Lucas',
            email: 'me@divn.dev',
          },
          {
            name: 'John Doe 3',
            email: '3johndo@gmail.com',
          },
          {
            name: 'John Doe 4',
            email: '4johndo@gmail.com',
          },
          {
            name: 'John Doe 6',
            email: '6johndo@gmail.com',
          },
        ],
      },
      {
        id: '2',
        name: 'My Workspace',
        members: [
          {
            name: 'John Doe 1',
            email: '1johndo@gmail.com',
          },
          {
            name: 'John Doe 2',
            email: '2johndo@gmail.com',
          },
          {
            name: 'Lucas',
            email: 'me@divn.dev',
          },
          {
            name: 'John Doe 3',
            email: '3johndo@gmail.com',
          },
          {
            name: 'John Doe 4',
            email: '4johndo@gmail.com',
          },
          {
            name: 'John Doe 6',
            email: '6johndo@gmail.com',
          },
        ],
      },
    ]

    items = []
    return {
      items,
      nextCursor: null,
    }
  })
