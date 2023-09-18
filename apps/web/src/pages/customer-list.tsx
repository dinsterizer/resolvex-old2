import { customerStatusColumnBaseSchema } from '@resolvex/api/src/schema.customer'
import { Outlet, useParams, useSearchParams } from 'react-router-dom'
import { CustomerInfiniteList } from '~/components/customer-infinite-list'

export function CustomerListPage() {
  const { workspaceId } = useParams() as { workspaceId: string }
  const [searchParams] = useSearchParams()
  const status = customerStatusColumnBaseSchema.catch('waiting').parse(searchParams.get('status'))

  return (
    <div className="flex flex-col h-full">
      <h1 className="font-title text-xl font-medium p-4">Customers</h1>

      <CustomerInfiniteList className="space-y-4 p-4" status={status} limit={12} workspaceId={workspaceId} />

      <Outlet />
    </div>
  )
}
