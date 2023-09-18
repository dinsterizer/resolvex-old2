import { customerStatusColumnBaseSchema } from '@resolvex/api/src/schema.customer'
import { Outlet, useParams, useSearchParams } from 'react-router-dom'
import { CustomerCard, CustomerCardSkeleton } from '~/components/customer-card'
import { Empty } from '~/components/empty'
import { End } from '~/components/end'
import { QueryError } from '~/components/query-error'
import { ViewportBlock } from '~/components/viewport-block'
import { trpc } from '~/utils/trpc'

export function CustomerListPage() {
  const { workspaceId } = useParams() as { workspaceId: string }
  const [searchParams] = useSearchParams()
  const status = customerStatusColumnBaseSchema.catch('waiting').parse(searchParams.get('status'))

  const { data, hasNextPage, isError, isSuccess, fetchNextPage, isFetching, isLoading } =
    trpc.customer.list.useInfiniteQuery(
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

      <div className="flex-1 lg:overflow-auto space-y-4 mt-8 lg:mt-10 pr-1">
        {data?.pages.map((page) =>
          page.items.map((customer) => <CustomerCard key={customer.id} customer={customer} />),
        )}
        {isLoading && (
          <>
            <CustomerCardSkeleton />
            <CustomerCardSkeleton />
            <CustomerCardSkeleton />
            <CustomerCardSkeleton />
          </>
        )}
        {isFetching && hasNextPage && <CustomerCardSkeleton />}
        {!isFetching && hasNextPage && <ViewportBlock onEnterViewport={() => fetchNextPage()} />}
        {isSuccess && customerCount === 0 && <Empty />}
        {isSuccess && !hasNextPage && customerCount > 0 && <End />}
        {isError && <QueryError />}
      </div>

      <Outlet />
    </div>
  )
}
