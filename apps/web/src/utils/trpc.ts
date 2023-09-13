import type { AppRouter } from '@resolvex/api/src/trpc.router'
import { createTRPCReact } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()
