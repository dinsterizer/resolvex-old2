import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, httpBatchLink } from '@trpc/client'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { useToast } from './components/ui/use-toast'
import { env } from './env'
import { useAuthStore } from './stores/auth'
import { trpc } from './utils/trpc'

export function QueryProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const auth = useAuthStore()

  const queryClient = useMemo(
    () =>
      new QueryClient({
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
              const code = err.data?.code
              const message = err.message

              if (code === 'UNAUTHORIZED') {
                auth.logout()
              }

              if (message !== code) {
                toast({
                  variant: 'destructive',
                  title: message,
                })
              } else {
                if (message === 'TOO_MANY_REQUESTS') {
                  toast({
                    variant: 'destructive',
                    title: 'Too many requests',
                    description: 'Please try again later.',
                  })
                } else if (message === 'UNAUTHORIZED') {
                  toast({
                    variant: 'destructive',
                    title: 'Unauthorized',
                    description: 'Please login and try again.',
                  })
                } else {
                  switch (code) {
                    case 'TOO_MANY_REQUESTS':
                      toast({
                        variant: 'destructive',
                        title: 'Too many requests',
                        description: 'Please try again later.',
                      })
                      break
                    case 'UNAUTHORIZED':
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
              }
            }
          },
        }),
      }),
    [toast, auth],
  )

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: new URL('/trpc', env.API_URL).toString(),
            async headers() {
              const headers: Record<string, string> = {}

              const { jwt } = auth
              if (jwt) headers['Api-Key'] = jwt

              return headers
            },
          }),
        ],
      }),
    [auth],
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
