import { Outlet, Route } from '@tanstack/react-router'
import { z } from 'zod'
import { CustomerCard, CustomerCardSkeleton } from '~/components/customer-card'
import { End } from '~/components/end'
import { QueryError } from '~/components/query-error'
import { ViewportBlock } from '~/components/viewport-block'
import { trpc } from '~/utils/trpc'
import { workspaceDetailRoute } from './workspace-detail'

export const customerListRoute = new Route({
  getParentRoute: () => workspaceDetailRoute,
  path: 'customers',
  validateSearch: z.object({
    status: z.enum(['waiting', 'helping', 'helped', 'spam']),
  }),
  component: function CustomerListPage({ useParams, useSearch }) {
    const { workspaceId } = useParams()
    const { status } = useSearch()

    const { data, hasNextPage, isError, isSuccess, fetchNextPage, isFetching } = trpc.customer.list.useInfiniteQuery(
      {
        status,
        workspaceId,
        limit: 12,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

    const customerCount = data?.pages.reduce((acc, page) => acc + page.items.length, 0) ?? 0
    return (
      <div className="flex flex-col h-full">
        <h1 className="font-title text-xl font-medium">Customers</h1>

        <div className="flex-1 overflow-auto space-y-4 mt-7 pr-1">
          {data?.pages.map((page) =>
            page.items.map((customer) => <CustomerCard key={customer.id} customer={customer} />),
          )}
          {isFetching && <CustomerCardSkeleton />}
          {!isFetching && hasNextPage && <ViewportBlock onEnterViewport={() => fetchNextPage()} />}
          {isSuccess && customerCount === 0 && <Empty />}
          {isSuccess && !hasNextPage && customerCount > 0 && <End />}
          {isError && <QueryError />}
        </div>

        <Outlet />
      </div>
    )
  },
})

export function Empty() {
  // TODO
  return 'empty'
}
