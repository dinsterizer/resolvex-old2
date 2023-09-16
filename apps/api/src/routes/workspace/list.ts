import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { WorkspaceMembers, Workspaces } from '../../schema'
import { authedProcedure } from '../../trpc'

export const workspaceListRouter = authedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(20).optional().default(10),
      cursor: z.number().min(0).optional().default(0),
    }),
  )
  .query(async ({ input, ctx }) => {
    const workspaces = await ctx.db
      .select({
        id: Workspaces.id,
      })
      .from(Workspaces)
      .innerJoin(WorkspaceMembers, eq(Workspaces.id, WorkspaceMembers.workspaceId))
      .where(eq(WorkspaceMembers.userId, ctx.auth.userId))
      .groupBy(Workspaces.id)
      .orderBy(desc(Workspaces.createdAt), desc(Workspaces.id))
      .offset(input.cursor)
      .limit(input.limit)
      .all()

    if (!workspaces.length) {
      return {
        items: [],
        nextCursor: null,
      }
    }

    const items = await ctx.db.query.Workspaces.findMany({
      columns: {
        id: true,
        name: true,
      },
      with: {
        members: {
          columns: {},
          with: {
            user: {
              columns: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      where(t, { inArray }) {
        return inArray(
          t.id,
          workspaces.map((w) => w.id),
        )
      },
    })

    return {
      items,
      nextCursor: input.cursor + input.limit,
    }
  })
