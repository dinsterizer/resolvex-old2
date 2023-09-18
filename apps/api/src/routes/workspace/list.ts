import { z } from 'zod'
import { WorkspaceMembers } from '../../schema'
import { authedProcedure } from '../../trpc'

export const workspaceListRouter = authedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(20).optional().default(10),
      cursor: z.number().min(0).optional().default(0),
    }),
  )
  .query(async ({ input, ctx }) => {
    const workspaceMembers = await ctx.db.query.WorkspaceMembers.findMany({
      columns: {
        workspaceId: true,
      },
      where(t, { eq }) {
        return eq(t.userId, ctx.auth.userId)
      },
      orderBy(t, { desc }) {
        return desc(WorkspaceMembers.createdAt), desc(WorkspaceMembers.workspaceId)
      },
      limit: input.limit,
      offset: input.cursor,
    })
    const workspaceIds = workspaceMembers.map((w) => w.workspaceId)

    if (!workspaceIds.length) {
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
        return inArray(t.id, workspaceIds)
      },
    })

    return {
      items,
      nextCursor: items.length < input.limit ? null : input.cursor + input.limit,
    }
  })
