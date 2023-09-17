/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { TRPCError } from '@trpc/server'
import { authRouter } from './routes/auth'
import { customerRouter } from './routes/customer'
import { workspaceRouter } from './routes/workspace'
import { publicProcedure, router } from './trpc'

export const appRouter = router({
  ping: publicProcedure.query(() => 'pong'),
  test: publicProcedure.mutation(() => {
    throw new TRPCError({ code: 'BAD_REQUEST' })
  }),
  auth: authRouter,
  workspace: workspaceRouter,
  customer: customerRouter,
})

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter
