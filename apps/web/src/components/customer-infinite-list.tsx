import { CustomerStatusBaseColumn } from '@resolvex/api/src/schema.customer'
import { ComponentPropsWithoutRef } from 'react'
import { match } from 'ts-pattern'
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
  const customerListQuery = trpc.customer.list.useInfiniteQuery(
    {
      status,
      workspaceId,
      limit,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  return (
    <div {...props}>
      {match(customerListQuery)
        .with({ status: 'loading' }, () => (
          <>
            <CustomerCardSkeleton />
            <CustomerCardSkeleton />
            <CustomerCardSkeleton />
            <CustomerCardSkeleton />
          </>
        ))
        .with({ status: 'error' }, () => <QueryError />)
        .with({ status: 'success' }, (query) => {
          const workspaceCount = query.data.pages.reduce((acc, page) => acc + page.items.length, 0)

          if (workspaceCount === 0) return <Empty />

          if (!query.hasNextPage && workspaceCount === 0) return <Empty />

          return (
            <>
              {query.data.pages.map((page) =>
                page.items.map((customer) => <CustomerCard key={customer.id} customer={customer} />),
              )}
              {query.isFetching && query.hasNextPage && <CustomerCardSkeleton />}
              {!query.isFetching && query.hasNextPage && (
                <ViewportBlock onEnterViewport={() => query.fetchNextPage()} />
              )}
              {!query.hasNextPage && workspaceCount > 0 && <End />}
            </>
          )
        })
        .exhaustive()}
    </div>
  )
}
