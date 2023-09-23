import { useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { QueryError } from '~/components/query-error'
import { Skeleton } from '~/components/ui/skeleton'
import { trpc } from '~/utils/trpc'

export function CustomerDetailPage() {
  const params = useParams() as { customerId: string }
  const query = trpc.customer.detail.useQuery({ customerId: params.customerId })

  return (
    <div className="py-4 pr-4 pl-2 h-screen lg:h-full">
      {match(query)
        .with({ status: 'loading' }, () => <CustomerDetailPageSkeleton />)
        .with({ status: 'error' }, () => <QueryError />)
        .with({ status: 'success' }, (query) => 'TODO')
        .exhaustive()}
    </div>
  )
}

function CustomerDetailPageSkeleton() {
  return (
    <div className="border rounded-md h-full flex flex-col">
      <div className="px-4 py-2.5 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-[17px] w-[92px]" />
        </div>

        <Skeleton className="w-[18px] h-[18px]" />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-lg mx-auto space-y-[18px] py-6">
          <Skeleton className="w-[180px] h-4" />
          <Skeleton className="w-full h-[135px]" />
          <div className="py-2">
            <Skeleton className="w-[160px] h-5" />
          </div>
          <Skeleton className="w-full h-[179px]" />
          <Skeleton className="w-[160px] h-4" />
          <Skeleton className="w-[170px] h-4" />
        </div>
      </div>

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
    </div>
  )
}
