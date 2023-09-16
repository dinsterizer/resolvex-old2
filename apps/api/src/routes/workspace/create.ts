import { z } from 'zod'
import { Users, WorkspaceMembers, Workspaces } from '../../schema'
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
      const getDemoUser = async (name: string) => {
        const email = name.toLowerCase().replace(' ', '.') + '+demo@example.com'
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
      }

      const fakeUsers = [await getDemoUser('John Doe'), await getDemoUser('Mary Jane'), await getDemoUser('Bob Smith')]

      for (const user of fakeUsers) {
        await ctx.db.insert(WorkspaceMembers).values({
          userId: user.id,
          workspaceId: workspace.id,
          role: 'basic_member',
        })
      }
    }

    return {
      id: workspace.id,
    }
  })
