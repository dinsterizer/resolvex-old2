import { formatDistanceToNow } from 'date-fns'
import { match } from 'ts-pattern'
import { cn } from '~/lib/utils'
import { trpc } from '~/utils/trpc'
import { CustomerAvatar } from './customer-avatar'
import { Empty } from './empty'
import { End } from './end'
import { GeneralSkeleton } from './general-skeleton'
import { QueryError } from './query-error'
import { Skeleton } from './ui/skeleton'
import { UserAvatar } from './user-avatar'
import { ViewportBlock } from './viewport-block'

type Props = {
  customerId: string
  className?: string
}

export function TimelineInfiniteList({ customerId, className }: Props) {
  const query = trpc.timeline.list.useInfiniteQuery(
    {
      customerId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )
  return (
    <div className={cn('space-y-[18px]', className)}>
      {match(query)
        .with({ status: 'loading' }, () => (
          <>
            <Skeleton className="w-[180px] h-4" />
            <Skeleton className="w-full h-[135px]" />
            <div className="py-2">
              <Skeleton className="w-[160px] h-5" />
            </div>
            <Skeleton className="w-full h-[179px]" />
            <Skeleton className="w-[160px] h-4" />
            <Skeleton className="w-[170px] h-4" />
          </>
        ))
        .with({ status: 'error' }, () => <QueryError />)
        .with({ status: 'success' }, (query) => {
          const count = query.data.pages.reduce((acc, page) => acc + page.items.length, 0)

          if (count === 0) return <Empty />

          if (!query.hasNextPage && count === 0) return <Empty />

          return (
            <>
              {query.data.pages.map((page) =>
                page.items.map((timeline) => {
                  return match(timeline)
                    .with({ data: { type: 'chat' } }, () => (
                      <div className="border rounded-md">
                        <div className="py-3 px-4 border-b flex gap-1 items-center">
                          <div className="flex items-center gap-1">
                            {timeline.userCreator && (
                              <>
                                <UserAvatar size={20} user={timeline.userCreator} />
                                <span className="text-sm">{timeline.userCreator.name}</span>
                              </>
                            )}
                            {timeline.customerCreator && (
                              <>
                                <CustomerAvatar size={20} customerName={timeline.customerCreator.name} />
                                <span className="text-sm">{timeline.customerCreator.name}</span>
                              </>
                            )}
                          </div>

                          <span className="text-xs text-muted-foreground">
                            · {formatDistanceToNow(new Date(timeline.createdAt * 1000), { addSuffix: true })} via chat
                          </span>
                        </div>

                        <div className="text-sm p-4">{timeline.data.message}</div>
                      </div>
                    ))
                    .exhaustive()
                }),
              )}
              {query.isFetching && query.hasNextPage && <GeneralSkeleton count={1} />}
              {!query.isFetching && query.hasNextPage && (
                <ViewportBlock onEnterViewport={() => query.fetchNextPage()} />
              )}
              {!query.hasNextPage && count > 0 && <End />}
            </>
          )
        })
        .exhaustive()}
    </div>
  )
}
