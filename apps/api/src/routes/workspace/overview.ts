import { and, eq, gte, sql } from 'drizzle-orm'
import { z } from 'zod'
import { Customers } from '../../schema'
import { authedProcedure } from '../../trpc'

export const workspaceOverviewRouter = authedProcedure
  .input(
    z.object({
      workspaceId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    await ctx.assertMemberOfWorkspace({
      workspaceId: input.workspaceId,
      userId: ctx.auth.userId,
    })

    const totalCustomers = await ctx.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(Customers)
      .where(eq(Customers.workspaceId, input.workspaceId))
      .get()

    const sub7Days = new Date()
    sub7Days.setDate(sub7Days.getDate() - 7)
    sub7Days.setHours(0, 0, 0, 0)

    const newCustomersPerDayInLast7Days = await ctx.db
      .select({
        day: sql<string>`strftime('%d', ${Customers.createdAt}, 'unixepoch')`,
        count: sql<number>`COUNT(*)`,
      })
      .from(Customers)
      .where(
        and(
          eq(Customers.workspaceId, input.workspaceId),
          gte(Customers.createdAt, Math.floor(sub7Days.getTime() / 1000)),
        ),
      )
      .groupBy(sql<string>`strftime('%d', ${Customers.createdAt}, 'unixepoch')`)
      .all()

    const firstDayOfThisMonth = new Date()
    firstDayOfThisMonth.setDate(1)
    firstDayOfThisMonth.setHours(0, 0, 0, 0)

    const activeCustomers = await ctx.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(Customers)
      .where(
        and(
          eq(Customers.workspaceId, input.workspaceId),
          gte(Customers.updatedAt, Math.floor(firstDayOfThisMonth.getTime() / 1000)),
        ),
      )
      .get()

    return {
      totalCustomersCount: totalCustomers?.count ?? 0,
      activeCustomersCount: activeCustomers?.count ?? 0,
      newCustomersPerDayInLast7Days,
    }
  })
