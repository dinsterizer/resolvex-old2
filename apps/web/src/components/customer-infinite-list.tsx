import { CustomerStatusBaseColumn } from '@resolvex/api/src/schema.customer'
import { ComponentPropsWithoutRef } from 'react'
import { trpc } from '~/utils/trpc'
import { CustomerCard, CustomerCardSkeleton } from './customer-card'
import { Empty } from './empty'
import { End } from './end'
import { QueryError } from './query-error'
import { ViewportBlock } from './viewport-block'

type Props = ComponentPropsWithoutRef<'div'> & {
  status: CustomerStatusBaseColumn
  workspaceId: string
  limit: number
}

export function CustomerInfiniteList({ status, workspaceId, limit, ...props }: Props) {
  const { data, hasNextPage, isError, isSuccess, fetchNextPage, isFetching, isLoading } =
    trpc.customer.list.useInfiniteQuery(
      {
        status,
        workspaceId,
        limit,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

  const customerCount = data?.pages.reduce((acc, page) => acc + page.items.length, 0) ?? 0
  return (
    <div {...props}>
      {data?.pages.map((page) => page.items.map((customer) => <CustomerCard key={customer.id} customer={customer} />))}
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
  )
}
