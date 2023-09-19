import { faker } from '@faker-js/faker'
import { z } from 'zod'
import { Customers, Timelines, Users, WorkspaceMembers, Workspaces } from '../../schema'
import { customerStatusColumnAllowValues } from '../../schema.customer'
import { authedProcedure } from '../../trpc'

export const workspaceCreateRouter = authedProcedure
  .input(z.object({ name: z.string().min(1).max(100), withDemoData: z.boolean().default(false) }))
  .mutation(async ({ ctx, input }) => {
    await ctx.rateLimit({
      key: 'create-workspace:' + ctx.auth.userId,
      limit: 2,
    })

    const workspace = await ctx.db
      .insert(Workspaces)
      .values({
        name: input.name,
      })
      .returning({
        id: Workspaces.id,
      })
      .get()

    await ctx.db.insert(WorkspaceMembers).values({
      userId: ctx.auth.userId,
      workspaceId: workspace.id,
      role: 'admin',
    })

    if (input.withDemoData) {
      const userNames = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Corp', 'Stark Industries']
      const fakeUsers = await Promise.all(
        userNames.map(async (name) => {
          const email = name.toLowerCase().replace(' ', '.') + '+user_demo@example.com'
          const user = await ctx.db.query.Users.findFirst({
            columns: {
              id: true,
              name: true,
              email: true,
            },
            where(t, { eq }) {
              return eq(t.email, email)
            },
          })

          if (user) {
            return user
          }

          return ctx.db
            .insert(Users)
            .values({
              name,
              email,
            })
            .returning({
              id: Users.id,
              name: Users.name,
              email: Users.email,
            })
            .get()
        }),
      )

      await Promise.all(
        fakeUsers.map(async (user) => {
          return await ctx.db.insert(WorkspaceMembers).values({
            userId: user.id,
            workspaceId: workspace.id,
            role: 'basic_member',
          })
        }),
      )

      const customerNames = [
        'Emily Johnson',
        'Ethan Davis',
        'Olivia Martinez',
        'William Wilson',
        'Sophia Anderson',
        'Benjamin Lee',
        'Isabella Taylor',
        'Michael Brown',
        'Mia Rodriguez',
        'Alexander Garcia',
        'Charlotte Hernandez',
        'Amelia Davis',
        'Matthew Wilson',
        'Harper Anderson',
        'Samuel Lee',
        'Abigail Taylor',
        'Joseph Brown',
        'Elizabeth Rodriguez',
        'David Garcia',
        'Madison Hernandez',
        'Daniel Martinez',
      ]
      const fakeCustomers = await Promise.all(
        customerNames.map(async (name) => {
          const email = name.toLowerCase().replace(' ', '.') + '+demo_customer@example.com'
          const date = faker.date.between({
            from: new Date().setDate(new Date().getDate() - 6),
            to: new Date(Date.now() - 1000 * 60 * 60),
          })
          return await ctx.db
            .insert(Customers)
            .values({
              workspaceId: workspace.id,
              status:
                customerStatusColumnAllowValues[Math.floor(Math.random() * customerStatusColumnAllowValues.length)],
              name,
              email,
              assignedUserId: fakeUsers[Math.floor(Math.random() * fakeUsers.length)].id,
              createdAt: Math.floor(date.getTime() / 1000),
              updatedAt: Math.floor(date.getTime() / 1000),
            })
            .returning({
              id: Customers.id,
              name: Customers.name,
              email: Customers.email,
              status: Customers.status,
              assignedUserId: Customers.assignedUserId,
              createdAt: Customers.createdAt,
            })
            .get()
        }),
      )

      await Promise.all(
        fakeCustomers.map(async (customer) => {
          const date = faker.date.between({
            from: customer.createdAt * 1000,
            to: new Date(),
          })
          await Promise.all([
            ctx.db
              .insert(Timelines)
              .values({
                customerId: customer.id,
                data: {
                  type: 'chat',
                  message: faker.lorem.sentences({ min: 1, max: 3 }) + '?',
                },
                creatorId: customer.id,
                createdAt: Math.floor(date.getTime() / 1000) - 60 * 60,
              })
              .get(),
            ctx.db
              .insert(Timelines)
              .values({
                customerId: customer.id,
                data: {
                  type: 'chat',
                  message: faker.lorem.sentences({ min: 1, max: 4 }),
                },
                creatorId: customer.assignedUserId,
                createdAt: Math.floor(date.getTime() / 1000) - 60 * 30,
              })
              .get(),
            Math.random() > 0.5 &&
              ctx.db
                .insert(Timelines)
                .values({
                  customerId: customer.id,
                  data: {
                    type: 'chat',
                    message: faker.lorem.sentences({ min: 1, max: 3 }) + '?',
                  },
                  creatorId: customer.id,
                  createdAt: Math.floor(date.getTime() / 1000) - 60 * 5,
                })
                .get(),
            Math.random() > 0.5 &&
              ctx.db
                .insert(Timelines)
                .values({
                  customerId: customer.id,
                  data: {
                    type: 'chat',
                    message: faker.lorem.sentences({ min: 1, max: 4 }),
                  },
                  creatorId: customer.assignedUserId,
                  createdAt: date.getTime(),
                })
                .get(),
          ])
        }),
      )
    }

    return {
      workspaceId: workspace.id,
    }
  })
