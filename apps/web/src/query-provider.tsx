import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, httpBatchLink } from '@trpc/client'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import SuperJSON from 'superjson'
import { trpc } from './utils/trpc'
import { env } from './env'
import { useAuthStore } from './stores/auth'
import { useToast } from './components/ui/use-toast'

export function QueryProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const auth = useAuthStore()

  const queryClient = useMemo(() => new QueryClient({
    queryCache: new QueryCache({
      onError(err) {
        if (err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED') {
          auth.logout()
          toast({
            variant: 'destructive',
            title: 'Unauthorized',
            description: 'Please login and try again.',
          })
        }
      },
    }),
    mutationCache: new MutationCache({
      onError(err) {
        if (err instanceof TRPCClientError) {
          switch (err.data?.code) {
            case 'TOO_MANY_REQUESTS':
              toast({
                variant: 'destructive',
                title: 'Too many requests',
                description: 'Please try again later.',
              })
              break
            case 'UNAUTHORIZED':
              auth.logout()
              toast({
                variant: 'destructive',
                title: 'Unauthorized',
                description: 'Please login and try again.',
              })
              break
            default:
              toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'Please try again later.',
              })
          }
        }
      },
    }),
  }), [toast, auth])

  const trpcClient = useMemo(() =>
    trpc.createClient({
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: new URL('/trpc', env.API_URL).toString(),
          async headers() {
            const headers: Record<string, string> = {}

            const { jwt } = auth
            if (jwt)
              headers['Api-Key'] = jwt

            return headers
          },
        }),
      ],
    }),
  [auth],
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
