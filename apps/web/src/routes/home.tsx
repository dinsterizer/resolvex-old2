import { Route } from '@tanstack/react-router'
import { rootRoute } from './_root'
import { trpc } from '~/utils/trpc'
import { env } from '~/env'

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component() {
    const { data, isLoading } = trpc.ping.useQuery()

    return <div>home page - {data} - {isLoading ? 'Loading' : ''} - {env.API_URL}</div>
  },
})
