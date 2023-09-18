import type { SelectCustomer, SelectTimeline, SelectUser } from '@resolvex/api/src/schema'
import { formatDistanceToNow } from 'date-fns'
import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Md5 } from 'ts-md5'
import { CustomerStatusBadge } from './customer-status-badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

type Props = {
  customer: Pick<SelectCustomer, 'id' | 'name' | 'email' | 'updatedAt' | 'status' | 'workspaceId'> & {
    createdTimelines: Pick<SelectTimeline, 'data'>[]
    assignedUser: Pick<SelectUser, 'name' | 'email'> | null
  }
}

export function CustomerCard({ customer }: Props) {
  const timeline = customer.createdTimelines[0]

  return (
    <Card className="py-2 px-3 @container">
      <div className="flex justify-between gap-2">
        <div>
          <Link
            to={`/${customer.workspaceId}/customers/${customer.id}?status=${customer.status}`}
            className="font-medium text-sm"
          >
            {customer.name}
          </Link>

          {customer.email && (
            <span className="ml-1 text-xs text-muted-foreground hidden @xs:inline">
              · <span className="pl-1">{customer.email}</span>
            </span>
          )}
        </div>

        <div className="flex gap-3">
          {customer.assignedUser && (
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={`https://www.gravatar.com/avatar/${Md5.hashStr(customer.assignedUser.email)}?s=20&default=404`}
                alt={`Member ${customer.assignedUser.name}`}
              />
              <AvatarFallback className="text-[10px]">{customer.assignedUser.name[0]}</AvatarFallback>
            </Avatar>
          )}

          {/* TODO */}
          {/* <button type="button">
            <MoreHorizontal size={16} />
          </button> */}
        </div>
      </div>
      {timeline?.data.type === 'chat' && (
        <Link
          to={`/${customer.workspaceId}/customers/${customer.id}?status=${customer.status}`}
          className="line-clamp-2 text-foreground/80 text-xs"
        >
          {timeline.data.message}
        </Link>
      )}

      <div className="flex gap-2 mt-3">
        <div className="px-2 py-1 border rounded-md text-muted-foreground flex items-center gap-1">
          <Calendar size={14} />
          <span className="text-xs">
            {formatDistanceToNow(new Date(customer.updatedAt * 1000), { addSuffix: true })}
          </span>
        </div>
        <CustomerStatusBadge status={customer.status} />
      </div>
    </Card>
  )
}

export function CustomerCardSkeleton() {
  return (
    <Card className="py-2 px-3">
      <div className="flex justify-between gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-3 w-72 mt-1" />

      <div className="flex gap-2 mt-3">
        <Skeleton className="h-[18px] w-16" />
        <Skeleton className="h-[18px] w-16" />
      </div>
    </Card>
  )
}
