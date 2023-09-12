import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import type { ReactNode } from 'react'
import { useState } from 'react'
import SuperJSON from 'superjson'
import { trpc } from './utils/trpc'
import { env } from './env'
import { useAuthStore } from './stores/auth'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: new URL('/trpc', env.API_URL).toString(),
          async headers() {
            const headers: Record<string, string> = {}

            const { jwt } = useAuthStore.getState()
            if (jwt)
              headers['Api-Key'] = jwt

            return headers
          },
        }),
      ],
    }),
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
