import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './trpc.router'
import { createTRPCContext } from './trpc'
import type { Context } from './worker.context'

export async function handleTrpcRequest({ request, context }: { request: Request; context: Context }) {
  const url = new URL(request.url)

  if (url.pathname.startsWith('/trpc')) {
    const res = await fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: appRouter,
      createContext: createTRPCContext({ context }),
      onError({ error }) {
        if (error.code === 'INTERNAL_SERVER_ERROR')
          console.error(error)
      },
    })

    return res
  }
}
