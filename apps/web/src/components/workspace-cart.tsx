import { Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Md5 } from 'ts-md5'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

type Props = {
  workspace: {
    id: string
    name: string
    members: {
      user: {
        name: string
        email: string
      }
    }[]
  }
}

export function WorkspaceCard({ workspace }: Props) {
  return (
    <Card className="p-2.5 relative">
      <div className="flex gap-4">
        <Link to={`/${workspace.id}`} className="h-16 w-16 bg-accent rounded-md flex items-center justify-center group">
          <Building2 className="text-accent-foreground group-hover:text-accent-foreground/80" />
        </Link>
        <div>
          <Link to={`/${workspace.id}`} className="font-medium hover:text-foreground/80">
            {workspace.name}
          </Link>
          <div className="flex mt-3 gap-0.5">
            {workspace.members.slice(0, 4).map((member) => (
              <Avatar key={member.user.email} className="h-5 w-5">
                <AvatarImage
                  src={`https://www.gravatar.com/avatar/${Md5.hashStr(member.user.email)}?s=20&default=404`}
                  alt={`Member ${member.user.name}`}
                />
                <AvatarFallback className="text-[10px]">{member.user.name[0]}</AvatarFallback>
              </Avatar>
            ))}
            {workspace.members.length > 4 && (
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">+{workspace.members.length - 4}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>

      <div>{/* TODO: workspace chart */}</div>
    </Card>
  )
}

export function WorkspaceCardSkeleton() {
  return (
    <Card className="p-2.5 relative @container">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16" />
          <div>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-5 w-20 mt-3" />
          </div>
        </div>

        <div className="hidden @xs:block">
          <Skeleton className="h-16 w-60" />
        </div>
      </div>
    </Card>
  )
}
