import { Columns, CornerDownLeft, UserCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { CustomerAvatar } from '~/components/customer-avatar'
import { QueryError } from '~/components/query-error'
import { TimelineInfiniteList } from '~/components/timeline-infinite-list'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { UserAvatar } from '~/components/user-avatar'
import { trpc } from '~/utils/trpc'

export function CustomerDetailPage() {
  const params = useParams() as { customerId: string }
  const query = trpc.customer.detail.useQuery({ customerId: params.customerId })

  return (
    <div className="py-4 pr-4 pl-2 h-screen lg:h-full">
      <div className="border rounded-md h-full flex flex-col">
        {match(query)
          .with({ status: 'loading' }, () => (
            <div className="px-4 py-2.5 flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-[17px] w-[92px]" />
              </div>

              <Skeleton className="w-[18px] h-[18px]" />
            </div>
          ))
          .with({ status: 'error' }, () => <QueryError />)
          .with({ status: 'success' }, (query) => (
            <div className="px-4 py-2.5 flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <CustomerAvatar size={32} customerName={query.data.customer.name} />
                <span className="font-medium">{query.data.customer.name}</span>
              </div>

              <button type="button">
                {/* TODO  */}
                <Columns size={18} />
              </button>
            </div>
          ))
          .exhaustive()}

        <div className="flex-1 overflow-auto">
          <div className="max-w-lg mx-auto py-6 ">
            <TimelineInfiniteList
              className="min-w-[300px] flex flex-col-reverse gap-5"
              customerId={params.customerId}
            />
          </div>
        </div>

        {match(query)
          .with({ status: 'loading' }, () => (
            <div>
              <div className="py-3 px-4">
                <Skeleton className="w-full h-7" />
              </div>
              <div className="px-4 py-2.5 flex justify-between items-center border-t">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-[17px] w-[92px]" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-[44px] h-6" />
                  <Skeleton className="w-[104px] h-6" />
                </div>
              </div>
            </div>
          ))
          .with({ status: 'error' }, () => <QueryError />)
          .with({ status: 'success' }, (query) => (
            <div>
              <div className="py-3 px-4">
                {/* TODO */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full justify-start text-muted-foreground cursor-text"
                >
                  Press <CornerDownLeft size={16} /> to start reply
                </Button>
              </div>
              <div className="px-4 py-2.5 flex justify-between items-center border-t">
                {/* TODO: assign button */}
                <Button type="button" variant="ghost" size="sm" className="gap-2">
                  {query.data.customer.assignedUser ? (
                    <>
                      <UserAvatar size={20} user={query.data.customer.assignedUser} />
                      <span>{query.data.customer.assignedUser.name}</span>
                    </>
                  ) : (
                    <>
                      <UserCircle size={20} />
                      <span>Unassigned</span>
                    </>
                  )}
                </Button>
                <div className="flex items-center gap-2">
                  {/* TODO: implement */}
                  {match(query.data.customer.status)
                    .with('waiting', () => (
                      <>
                        <Button type="button" variant="ghost" size="sm">
                          Spam
                        </Button>
                        <Button type="button" variant="outline" size="sm">
                          Marked as helped
                          <kbd className="ml-1 px-1 py-0.5 rounded border border-border leading-none">H</kbd>
                        </Button>
                      </>
                    ))
                    .with('helping', () => <></>)
                    .with('helped', () => <></>)
                    .with('spam', () => <></>)
                    .exhaustive()}
                </div>
              </div>
            </div>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}
