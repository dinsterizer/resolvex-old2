import { Route } from '@tanstack/react-router'
import { env } from '~/env'
import { trpc } from '~/utils/trpc'
import { rootRoute } from './_root'

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component() {
    const { data, isLoading } = trpc.ping.useQuery()
    const { mutate } = trpc.test.useMutation()

    return (
      <div>
        home page - {data} - {isLoading ? 'Loading' : ''} - {env.API_URL}
        <button onClick={() => mutate()}>click me</button>
      </div>
    )
  },
})
