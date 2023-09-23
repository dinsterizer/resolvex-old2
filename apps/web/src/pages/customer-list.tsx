import { customerStatusColumnBaseSchema } from '@resolvex/api/src/schema.customer'
import { Outlet, useOutlet, useParams, useSearchParams } from 'react-router-dom'
import { CustomerInfiniteList } from '~/components/customer-infinite-list'
import { cn } from '~/lib/utils'

export function CustomerListPage() {
  const { workspaceId } = useParams() as { workspaceId: string }
  const [searchParams] = useSearchParams()
  const outlet = useOutlet()
  const status = customerStatusColumnBaseSchema.catch('waiting').parse(searchParams.get('status'))

  return (
    <div className="flex flex-col h-full">
      <h1 className="font-title text-xl font-medium p-4">Customers</h1>

      <div
        className={cn({
          'lg:grid lg:grid-cols-11': outlet !== null,
          'flex-1 lg:overflow-auto': outlet !== null,
        })}
      >
        <div
          className={cn('p-4', {
            'lg:col-span-4': outlet !== null,
            'h-full overflow-auto pr-1': outlet !== null,
            'hidden lg:block': outlet !== null,
          })}
        >
          <CustomerInfiniteList className="space-y-4" status={status} limit={12} workspaceId={workspaceId} />
        </div>

        <div className="flex flex-col overflow-auto lg:col-span-7">
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
